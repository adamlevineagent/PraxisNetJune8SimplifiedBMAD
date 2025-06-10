'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { AuthService } from '@/lib/auth-service';
import { useAuthStore } from '@/store/auth';
import { websocketService } from '@/services/websocket.service';
import { debounce } from 'lodash';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [disclosureLevel, setDisclosureLevel] = useState('STEALTH');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailability, setUsernameAvailability] = useState<{
    available: boolean;
    message?: string;
  } | null>(null);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore();

  // Initialize WebSocket connection for anonymous username checking
  useEffect(() => {
    // Connect without token for anonymous username checking
    const socket = websocketService.connect('');
    
    const handleConnected = () => {
      setIsWebSocketConnected(true);
    };

    const handleDisconnect = () => {
      setIsWebSocketConnected(false);
    };

    websocketService.on('connected', handleConnected);
    socket.on('disconnect', handleDisconnect);

    return () => {
      websocketService.off('connected', handleConnected);
      socket.off('disconnect', handleDisconnect);
      websocketService.disconnect();
    };
  }, []);

  // Create debounced username check function
  const checkUsernameAvailability = useCallback(
    debounce(async (value: string) => {
      if (value.length < 3) {
        setUsernameAvailability(null);
        return;
      }

      setIsCheckingUsername(true);
      try {
        if (isWebSocketConnected) {
          // Use WebSocket for real-time checking
          const result = await websocketService.checkUsername(value);
          setUsernameAvailability(result);
        } else {
          // Fallback to HTTP
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/check-username/${value}`);
          const data = await response.json();
          setUsernameAvailability({
            available: data.available,
            message: data.message || (data.available ? 'Username available' : 'Username already taken'),
          });
        }
      } catch (err) {
        console.error('Failed to check username:', err);
        setUsernameAvailability({
          available: false,
          message: 'Failed to check availability',
        });
      } finally {
        setIsCheckingUsername(false);
      }
    }, 300),
    [isWebSocketConnected]
  );

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setUsername(value);
    setError('');
    checkUsernameAvailability(value);
  };

  const getUsernameIcon = () => {
    if (isCheckingUsername) {
      return <Loader2 className="h-4 w-4 animate-spin text-gray-400" />;
    }
    if (!usernameAvailability) return null;
    if (usernameAvailability.available) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate username availability
    if (!usernameAvailability?.available) {
      setError('Please choose an available username');
      return;
    }

    setIsLoading(true);

    try {
      const data = await AuthService.register(email, username, password, disclosureLevel as 'OPEN' | 'STEALTH');
      
      // Store the auth data
      login(data.user, data.access_token);
      
      // Redirect to handle selection
      router.push('/onboard/handle');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create your account</CardTitle>
          <CardDescription className="text-center">
            Join Praxis Network and let your AI agent discover opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={handleUsernameChange}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {getUsernameIcon()}
                </div>
              </div>
              {usernameAvailability && !usernameAvailability.available && (
                <p className="text-xs text-red-500">
                  {usernameAvailability.message}
                </p>
              )}
              {usernameAvailability && usernameAvailability.available && username.length >= 3 && (
                <p className="text-xs text-green-500">
                  {usernameAvailability.message}
                </p>
              )}
              <p className="text-xs text-text-secondary">
                3+ characters, letters, numbers, underscores, and hyphens only
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={8}
              />
            </div>

            <div className="space-y-2">
              <Label>Disclosure Level</Label>
              <RadioGroup value={disclosureLevel} onValueChange={setDisclosureLevel}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="STEALTH" id="stealth" />
                  <Label htmlFor="stealth">Stealth (Private profile)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="OPEN" id="open" />
                  <Label htmlFor="open">Open (Public profile)</Label>
                </div>
              </RadioGroup>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || isCheckingUsername || (username.length >= 3 && !usernameAvailability?.available)}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-text-secondary">Already have an account? </span>
            <Link href="/login" className="text-accent-primary hover:underline">
              Sign in
            </Link>
          </div>

          {isWebSocketConnected && (
            <p className="text-xs text-center text-green-600 mt-4">
              ● Real-time validation active
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}