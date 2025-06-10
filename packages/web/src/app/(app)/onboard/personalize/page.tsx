"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Bot, MessageSquare } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

const communicationStyles = [
  {
    value: 'professional_focused',
    label: 'Professional & Focused',
    description: 'Clear, specific questions about work and expertise',
    preview: "Hello! I'm {name}, your Praxis Network agent. I'm here to help you articulate your professional identity and discover collaboration opportunities.",
  },
  {
    value: 'warm_conversational',
    label: 'Warm & Conversational',
    description: 'Friendly, encouraging, and comfortable',
    preview: "Hi! I'm {name}, your Praxis agent. I'm excited to learn about your professional journey and help you discover amazing collaboration opportunities!",
  },
  {
    value: 'direct_efficient',
    label: 'Direct & Efficient',
    description: 'Concise questions for quick completion',
    preview: "I'm {name}, your Praxis agent. Let's build your Professional Essence efficiently.",
  },
];

export default function PersonalizePage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [agentName, setAgentName] = useState('');
  const [communicationStyle, setCommunicationStyle] = useState('warm_conversational');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !token) {
      router.push('/login');
      return;
    }
    // Check if agent already exists
    checkExistingAgent();
  }, [user, token, router]);

  const checkExistingAgent = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const profile = await response.json();
        if (profile?.name) {
          setAgentName(profile.name);
        }
      }
    } catch (error) {
      console.error('Failed to check existing agent:', error);
    }
  };

  const selectedStyle = communicationStyles.find(s => s.value === communicationStyle);
  const preview = selectedStyle?.preview.replace('{name}', agentName || 'Your Agent') || '';

  const handleContinue = async () => {
    if (!agentName.trim()) {
      setError('Please give your agent a name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // First, update agent profile with name
      const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          positionMatrix: {
            name: agentName.trim(),
          }
        }),
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to save agent name');
      }

      // Start the conversational interview
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/onboarding/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          agentName: agentName.trim(),
          communicationStyle,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start interview');
      }

      const data = await response.json();
      
      // Store conversation ID and navigate to interview
      sessionStorage.setItem('conversationId', data.conversationId);
      sessionStorage.setItem('agentName', agentName.trim());
      
      // Update onboarding stage
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/onboarding-stage`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stage: 'PROFESSIONAL_ESSENCE' }),
      });

      router.push('/onboard/interview');
    } catch (err) {
      setError('Failed to start the interview. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-primary p-4">
      <div className="max-w-2xl mx-auto pt-20">
        <Card className="p-8">
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Bot className="w-6 h-6 mr-2 text-accent-primary" />
              <h1 className="text-2xl font-bold">Let's Personalize Your AI Agent</h1>
            </div>
            <p className="text-text-secondary">
              Your agent will represent you in the Praxis Network, discovering opportunities while you sleep.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="agent-name">What would you like to name your agent?</Label>
              <Input
                id="agent-name"
                placeholder="e.g., Max, Nova, Sage..."
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-3">
              <Label>How should your agent communicate?</Label>
              <RadioGroup value={communicationStyle} onValueChange={setCommunicationStyle}>
                {communicationStyles.map((style) => (
                  <div key={style.value} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-background-secondary transition-colors">
                    <RadioGroupItem value={style.value} id={style.value} className="mt-1" />
                    <label htmlFor={style.value} className="flex-1 cursor-pointer">
                      <div className="font-medium">{style.label}</div>
                      <div className="text-sm text-text-secondary">{style.description}</div>
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          {agentName && (
            <Card className="p-6 mt-6 bg-background-secondary">
              <h3 className="font-medium mb-3">Preview your agent's greeting:</h3>
              <div className="p-4 bg-background-primary rounded-lg">
                <p className="text-text-primary italic">"{preview}"</p>
              </div>
            </Card>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <div className="flex justify-end mt-8">
            <Button
              onClick={handleContinue}
              disabled={isLoading || !agentName.trim()}
              size="lg"
              className="flex items-center"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              {isLoading ? 'Starting Interview...' : 'Start Interview →'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}