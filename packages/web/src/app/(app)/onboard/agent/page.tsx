"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bot, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

export default function AgentNamingPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [agentName, setAgentName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !token) {
      router.push('/login');
      return;
    }
    // Set default name as "{handle}'s Agent"
    if (user.handle) {
      setAgentName(`${user.handle}'s Agent`);
    }
  }, [user, token, router]);

  const handleSubmit = async () => {
    if (!user || !token || !agentName.trim()) return;

    setIsSaving(true);
    setError('');

    try {
      // Create or update agent profile
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          positionMatrix: {
            name: agentName.trim(),
            // Initialize empty position matrix
            narrative: '',
            currentFocus: [],
            seekingConnections: [],
            offeringExpertise: [],
            metadata: {
              completeness: 0,
              lastUpdated: new Date().toISOString(),
            }
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save agent name');
      }

      // Update onboarding stage
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/onboarding-stage`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stage: 'PROFESSIONAL_ESSENCE' }),
      });

      // Proceed to professional essence
      router.push('/onboard/personalize');
    } catch (err) {
      setError('Failed to save agent name. Please try again.');
      console.error('Agent naming error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-primary p-4">
      <div className="max-w-md mx-auto pt-20">
        <Card className="p-8">
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Bot className="w-6 h-6 mr-2 text-accent-primary" />
              <h1 className="text-2xl font-bold">Name Your Praxis Agent</h1>
            </div>
            <p className="text-text-secondary">
              Your agent will represent you in conversations. Give it a memorable name.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="agentName">Agent Name</Label>
              <Input
                id="agentName"
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="e.g., Alex's Agent, The Collaborator"
                className="mt-1"
                maxLength={50}
              />
              <p className="text-xs text-text-secondary mt-2">
                This is how your agent will be identified in conversations
              </p>
            </div>

            <div className="bg-background-secondary p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-accent-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm text-text-secondary">
                  <p className="font-medium mb-1">MVP Note:</p>
                  <p>
                    In this version, all agents have similar communication styles. 
                    Personality customization will be available in future updates.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!agentName.trim() || isSaving}
              className="w-full"
              size="lg"
            >
              {isSaving ? 'Saving...' : 'Continue to Professional Essence'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}