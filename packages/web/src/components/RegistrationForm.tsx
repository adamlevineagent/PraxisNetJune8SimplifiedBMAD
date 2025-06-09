'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRegistration } from '../hooks/useRegistration';

interface RegistrationFormProps {
  className?: string;
}

export function RegistrationForm({ className = '' }: RegistrationFormProps) {
  const [step, setStep] = useState<'email' | 'details'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [disclosureLevel, setDisclosureLevel] = useState<'OPEN' | 'STEALTH'>('STEALTH');
  const [emailError, setEmailError] = useState('');
  
  const { state, register, clearError } = useRegistration();
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    setStep('details');
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!password.trim() || !username.trim()) {
      return;
    }
    
    try {
      await register({
        email,
        password,
        username,
        disclosureLevel,
      });
      
      // Redirect to handle selection after successful registration
      router.push('/onboard/handle');
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    clearError();
  };

  if (step === 'email') {
    return (
      <div className={`max-w-md mx-auto ${className}`}>
        <form onSubmit={handleEmailSubmit} className="sm:flex">
          <div className="flex-1">
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 border border-background-secondary rounded-md text-text-primary bg-background-secondary focus:ring-2 focus:ring-accent-primary focus:outline-none"
              placeholder="Enter your email"
            />
            {emailError && (
              <p className="mt-2 text-sm text-red-600">{emailError}</p>
            )}
          </div>
          <div className="mt-3 sm:mt-0 sm:ml-3">
            <button
              type="submit"
              className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-background-primary bg-accent-primary hover:bg-accent-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary"
            >
              Get Started
            </button>
          </div>
        </form>
        <p className="mt-3 text-sm text-text-secondary">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-accent-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <div className="bg-background-primary p-6 rounded-lg border border-background-secondary">
        <h3 className="text-xl font-semibold mb-4 text-center">Complete Your Registration</h3>
        
        <form onSubmit={handleRegistrationSubmit} className="space-y-4">
          <div>
            <label htmlFor="email-display" className="block text-sm font-medium text-text-secondary mb-1">
              Email
            </label>
            <input
              id="email-display"
              type="email"
              value={email}
              disabled
              className="w-full px-3 py-2 border border-background-secondary rounded-md bg-background-secondary/50 text-text-secondary"
            />
            <button
              type="button"
              onClick={handleBackToEmail}
              className="mt-1 text-sm text-accent-primary hover:text-accent-primary/80"
            >
              Change email
            </button>
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-1">
              Username *
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-background-secondary rounded-md text-text-primary bg-background-secondary focus:ring-2 focus:ring-accent-primary focus:outline-none"
              placeholder="Choose a username"
            />
            <p className="mt-1 text-xs text-text-secondary">
              You'll choose a unique handle in the next step
            </p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">
              Password *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-background-secondary rounded-md text-text-primary bg-background-secondary focus:ring-2 focus:ring-accent-primary focus:outline-none"
              placeholder="Create a secure password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Disclosure Level
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="disclosureLevel"
                  value="STEALTH"
                  checked={disclosureLevel === 'STEALTH'}
                  onChange={(e) => setDisclosureLevel(e.target.value as 'STEALTH')}
                  className="mr-2"
                />
                <span className="text-sm">Stealth (Private profile)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="disclosureLevel"
                  value="OPEN"
                  checked={disclosureLevel === 'OPEN'}
                  onChange={(e) => setDisclosureLevel(e.target.value as 'OPEN')}
                  className="mr-2"
                />
                <span className="text-sm">Open (Public profile)</span>
              </label>
            </div>
          </div>

          {state.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{state.error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={state.isLoading || !password.trim() || !username.trim()}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-background-primary bg-accent-primary hover:bg-accent-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state.isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-background-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}