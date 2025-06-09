"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Check if user has a temporary handle
    if (user.handle?.startsWith('user_')) {
      // Redirect to handle selection
      router.push('/onboard/handle');
    } else {
      // Handle is set, proceed to personalization
      router.push('/onboard/personalize');
    }
  }, [user, router]);
  
  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center">
      <div className="text-center">
        <p className="text-text-secondary">Redirecting to onboarding...</p>
      </div>
    </div>
  );
}
