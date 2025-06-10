"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

export default function HandleSelectionPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [handle, setHandle] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState<{
    available: boolean;
    reason?: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !token) {
      router.push('/login');
    }
  }, [user, token, router]);

  const checkHandleAvailability = async (value: string) => {
    if (value.length < 3) {
      setAvailability(null);
      return;
    }

    setIsChecking(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/check-handle/${value}`);
      const data = await response.json();
      setAvailability(data);
    } catch (err) {
      console.error('Failed to check handle availability:', err);
      setAvailability({
        available: false,
        reason: 'Failed to check availability',
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setHandle(value);
    
    // Debounce the availability check
    const timeoutId = setTimeout(() => {
      checkHandleAvailability(value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleSubmit = async () => {
    if (!availability?.available || !user || !token) return;

    setIsSaving(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ handle }),
      });

      if (!response.ok) {
        throw new Error('Failed to save handle');
      }

      // Update user in store
      const updatedUser = await response.json();
      useAuthStore.getState().setUser(updatedUser);

      // Update onboarding stage
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/onboarding-stage`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stage: 'AGENT_NAMING' }),
      });

      // Proceed to agent personalization
      router.push('/onboard/personalize');
    } catch (err) {
      setError('Failed to save handle. Please try again.');
      console.error('Handle save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const getAvailabilityIcon = () => {
    if (isChecking) {
      return <AlertCircle className="w-5 h-5 text-yellow-500 animate-pulse" />;
    }
    if (availability === null) return null;
    if (availability.available) {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-background-primary p-4">
      <div className="max-w-md mx-auto pt-20">
        <Card className="p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Choose Your Handle</h1>
            <p className="text-text-secondary">
              Your unique identifier on Praxis Network. This can't be changed later.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="handle">Handle</Label>
              <div className="relative">
                <Input
                  id="handle"
                  type="text"
                  value={handle}
                  onChange={handleInputChange}
                  placeholder="e.g., john_doe"
                  className="pr-10"
                  maxLength={50}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {getAvailabilityIcon()}
                </div>
              </div>
              
              {availability && !availability.available && (
                <p className="text-sm text-red-500 mt-1">
                  {availability.reason || 'This handle is already taken'}
                </p>
              )}
              
              {availability && availability.available && handle.length >= 3 && (
                <p className="text-sm text-green-500 mt-1">
                  Great! This handle is available
                </p>
              )}
              
              <p className="text-xs text-text-secondary mt-2">
                3-50 characters, letters, numbers, underscores, and hyphens only
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!availability?.available || isSaving || isChecking}
              className="w-full"
              size="lg"
            >
              {isSaving ? 'Saving...' : 'Continue'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}