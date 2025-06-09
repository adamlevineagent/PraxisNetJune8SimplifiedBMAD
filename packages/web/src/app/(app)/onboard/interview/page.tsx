"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth';
import { Message, ChatContainer, ChatInput, TypingIndicator } from '@/components/ui/chat';
import { Progress } from '@/components/ui/progress';

interface ConversationProgress {
  completeness: number;
  narrative: number;
  currentFocus: number;
  seeking: number;
  offering: number;
}

export default function InterviewPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [messages, setMessages] = useState<Array<{ content: string; isUser: boolean; timestamp?: string }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [progress, setProgress] = useState<ConversationProgress>({
    completeness: 0,
    narrative: 0,
    currentFocus: 0,
    seeking: 0,
    offering: 0,
  });
  const [turnCount, setTurnCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState('');

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [agentName, setAgentName] = useState<string>('Your agent');

  // Load from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedConversationId = sessionStorage.getItem('conversationId');
      const storedAgentName = sessionStorage.getItem('agentName');
      
      if (!storedConversationId) {
        router.push('/onboard/personalize');
        return;
      }
      
      setConversationId(storedConversationId);
      setAgentName(storedAgentName || 'Your agent');
    }
  }, [router]);

  useEffect(() => {
    if (!conversationId) {
      return;
    }

    // Load initial greeting from session or fetch status
    const loadInitialState = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/onboarding/status/${conversationId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProgress(data.progress || {
            completeness: 0,
            narrative: 0,
            currentFocus: 0,
            seeking: 0,
            offering: 0,
          });
          setTurnCount(data.turnCount || 0);
          setIsComplete(data.isComplete || false);
          
          // Add initial greeting if available
          if (data.messages && data.messages.length > 0) {
            setMessages(data.messages.map((msg: any) => ({
              content: msg.content,
              isUser: msg.role === 'user',
              timestamp: new Date(msg.timestamp).toLocaleTimeString(),
            })));
          }
        }
      } catch (err) {
        console.error('Failed to load conversation status:', err);
      }
    };

    loadInitialState();
  }, [conversationId, token, router]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = { 
      content: inputValue, 
      isUser: true, 
      timestamp: new Date().toLocaleTimeString() 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/onboarding/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversationId,
          message: inputValue,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        content: data.response,
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      }]);
      
      setProgress(data.progress);
      setTurnCount(data.turnCount);
      setIsComplete(data.isComplete);

    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleComplete = async () => {
    setIsTyping(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/onboarding/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ conversationId }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete onboarding');
      }

      const data = await response.json();
      
      // Store essence for review page
      sessionStorage.setItem('professionalEssence', JSON.stringify(data.essence));
      
      router.push('/onboard/review');
    } catch (err) {
      setError('Failed to complete onboarding. Please try again.');
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const progressPercentage = Math.round(progress.completeness * 100);

  return (
    <div className="min-h-screen bg-background-primary">
      <main className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Chat with {agentName}</h1>
              <p className="text-text-secondary">Let's discover your Professional Essence together</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-text-secondary">Turn {turnCount} of ~10-15</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <ChatContainer className="flex-1">
                  {messages.map((message, index) => (
                    <Message
                      key={index}
                      content={message.content}
                      isUser={message.isUser}
                      timestamp={message.timestamp}
                    />
                  ))}
                  {isTyping && (
                    <div className="flex justify-start mb-4">
                      <div className="bg-background-secondary rounded-2xl px-4 py-3 rounded-tl-none">
                        <TypingIndicator />
                      </div>
                    </div>
                  )}
                </ChatContainer>
                <ChatInput
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onSend={handleSendMessage}
                  disabled={isTyping}
                  placeholder="Type your response..."
                />
              </Card>
            </div>

            <div className="md:col-span-1">
              <Card className="p-6 sticky top-8">
                <h3 className="font-semibold mb-4">Professional Essence Building...</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Overall Completeness</span>
                      <span className="text-sm font-medium">{progressPercentage}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Narrative</span>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < Math.round(progress.narrative * 5)
                                ? 'bg-accent-primary'
                                : 'bg-background-secondary'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Current Focus</span>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < Math.round(progress.currentFocus * 5)
                                ? 'bg-accent-primary'
                                : 'bg-background-secondary'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Seeking</span>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < Math.round(progress.seeking * 5)
                                ? 'bg-accent-primary'
                                : 'bg-background-secondary'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Offering</span>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < Math.round(progress.offering * 5)
                                ? 'bg-accent-primary'
                                : 'bg-background-secondary'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {isComplete && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-accent-primary mb-3">
                        Great conversation! Your Professional Essence is ready for review.
                      </p>
                      <Button onClick={handleComplete} className="w-full" disabled={isTyping}>
                        Complete Interview →
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-500">{error}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}