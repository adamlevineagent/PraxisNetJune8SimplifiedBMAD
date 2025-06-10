import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

export function useOnboardingRecovery() {
  const router = useRouter();
  const { user, token } = useAuthStore();

  useEffect(() => {
    if (!user || !token) return;

    const checkOnboardingStatus = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/onboarding-status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) return;

        const status = await response.json();

        // If onboarding is not complete and we're not already on an onboarding page
        if (!status.isComplete && status.nextStep && 
            !window.location.pathname.startsWith('/onboard')) {
          router.push(status.nextStep);
        }
      } catch (error) {
        console.error('Failed to check onboarding status:', error);
      }
    };

    checkOnboardingStatus();
  }, [user, token, router]);
}