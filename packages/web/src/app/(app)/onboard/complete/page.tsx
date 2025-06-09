"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

export default function OnboardingCompletePage() {
  const router = useRouter();
  const { user, token } = useAuthStore();

  useEffect(() => {
    if (!user || !token) {
      router.push('/login');
    }
  }, [user, token, router]);

  return (
    <div className="min-h-screen bg-background-primary p-4">
      <div className="max-w-2xl mx-auto pt-20">
        <Card className="p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome to the Praxis Network!</h1>
            <p className="text-lg text-text-secondary">
              Your onboarding is complete. Here's what happens next:
            </p>
          </div>

          <div className="space-y-4 text-left mb-8">
            <div className="flex items-start space-x-3 p-4 bg-background-secondary rounded-lg">
              <Clock className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Admin Review</h3>
                <p className="text-sm text-text-secondary">
                  Your profile is now in the admin approval queue. This typically takes 24-48 hours.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-background-secondary rounded-lg">
              <Sparkles className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">The Midnight Protocol</h3>
                <p className="text-sm text-text-secondary">
                  Once approved, your agent will participate in nightly conversations to find 
                  collaboration opportunities while you sleep.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-background-secondary rounded-lg">
              <CheckCircle className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Morning Reports</h3>
                <p className="text-sm text-text-secondary">
                  You'll receive a daily email with opportunities your agent discovered, 
                  ready for your review and action.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-background-secondary p-6 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">What You Can Do Now</h3>
            <ul className="text-sm text-text-secondary space-y-2">
              <li>• Check your email for confirmation</li>
              <li>• Bookmark this site for easy access</li>
              <li>• Prepare for your first morning report after approval</li>
            </ul>
          </div>

          <Button
            onClick={() => router.push('/dashboard')}
            className="w-full"
            size="lg"
          >
            Go to Dashboard
          </Button>
        </Card>
      </div>
    </div>
  );
}