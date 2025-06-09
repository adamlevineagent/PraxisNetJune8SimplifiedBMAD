"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useWebSocket } from '@/hooks/useWebSocket';
import { debounce } from 'lodash';

/**
 * Enhanced Handle Selection Page with WebSocket Support
 * 
 * This demonstrates how to integrate WebSocket for real-time username availability checking.
 * Copy this pattern to the actual page when ready to implement.
 */
export default function EnhancedHandleSelectionPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const { isConnected, checkUsername } = useWebSocket();
  
  const [handle, setHandle] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState<{
    available: boolean;
    message?: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !token) {
      router.push('/login');
    }
  }, [user, token, router]);

  // Create a debounced check function
  const debouncedCheck = useCallback(
    debounce(async (value: string) => {
      if (value.length < 3) {
        setAvailability(null);
        return;
      }

      setIsChecking(true);
      try {
        // Use WebSocket if connected, fallback to HTTP
        if (isConnected) {
          const result = await checkUsername(value);
          setAvailability(result);
        } else {
          // Fallback to HTTP endpoint
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/check-handle/${value}`);
          const data = await response.json();
          setAvailability({
            available: data.available,
            message: data.reason || (data.available ? 'Handle available' : 'Handle not available'),
          });
        }
      } catch (err) {
        console.error('Failed to check handle availability:', err);
        setAvailability({
          available: false,
          message: 'Failed to check availability',
        });
      } finally {
        setIsChecking(false);
      }
    }, 300),
    [isConnected, checkUsername]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setHandle(value);
    setError('');
    
    // Check availability with debounce
    debouncedCheck(value);
  };

  const handleSubmit = async () => {
    if (!availability?.available || !user || !token) return;

    setIsSaving(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`, {
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
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/onboarding-stage`, {
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
    } finally {
      setIsSaving(false);
    }
  };

  const getAvailabilityIcon = () => {
    if (isChecking) {
      return <Loader2 className="h-4 w-4 animate-spin text-gray-400" />;
    }
    
    if (!availability) return null;
    
    if (availability.available) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
    
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getAvailabilityMessage = () => {
    if (!availability || isChecking) return null;
    
    return (
      <p className={`text-xs mt-1 ${availability.available ? 'text-green-500' : 'text-red-500'}`}>
        {availability.message}
      </p>
    );
  };

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Choose Your Handle</h1>
            <p className="text-text-secondary">
              This will be your unique identifier on Praxis Network
            </p>
          </div>

          {!isConnected && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>Real-time checking unavailable. Using standard validation.</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="handle">Handle</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                @
              </span>
              <Input
                id="handle"
                type="text"
                placeholder="yourhandle"
                value={handle}
                onChange={handleInputChange}
                className="pl-8 pr-10"
                maxLength={50}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {getAvailabilityIcon()}
              </div>
            </div>
            {getAvailabilityMessage()}
            <p className="text-xs text-text-secondary mt-1">
              3-50 characters. Letters, numbers, underscores, and hyphens only.
            </p>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={isSaving}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!availability?.available || isSaving || handle.length < 3}
              className="flex-1"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </div>

          {isConnected && (
            <p className="text-xs text-center text-green-600">
              ● Real-time validation active
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}