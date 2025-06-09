'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuthStore } from '@/store/auth';
import { 
  User, 
  Shield, 
  MessageSquare, 
  FileText, 
  Settings,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface OnboardingStatus {
  stage: 'HANDLE_SELECTION' | 'AGENT_NAMING' | 'INTERVIEW' | 'PRIVACY_SETUP' | 'PENDING_APPROVAL' | 'APPROVED' | 'COMPLETED';
  completeness: number;
  lastUpdated: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuthStore();
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push('/login');
      return;
    }

    fetchOnboardingStatus();
  }, [isAuthenticated, token, router]);

  const fetchOnboardingStatus = async () => {
    try {
      // In a real implementation, this would fetch from an API endpoint
      // For now, we'll simulate based on user status
      const mockStatus: OnboardingStatus = {
        stage: user?.status === 'APPROVED' ? 'COMPLETED' : 
               user?.status === 'PENDING_APPROVAL' ? 'PENDING_APPROVAL' : 
               'INTERVIEW',
        completeness: user?.status === 'APPROVED' ? 100 : 65,
        lastUpdated: new Date().toISOString()
      };
      
      setOnboardingStatus(mockStatus);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getOnboardingMessage = () => {
    if (!onboardingStatus) return '';
    
    switch (onboardingStatus.stage) {
      case 'HANDLE_SELECTION':
        return 'Choose your unique handle to continue';
      case 'AGENT_NAMING':
        return 'Name and personalize your AI agent';
      case 'INTERVIEW':
        return 'Complete your professional essence interview';
      case 'PRIVACY_SETUP':
        return 'Configure your privacy settings';
      case 'PENDING_APPROVAL':
        return 'Your profile is under review by our admin team';
      case 'APPROVED':
      case 'COMPLETED':
        return 'Your profile is active and ready for networking!';
      default:
        return 'Continue your onboarding journey';
    }
  };

  const getOnboardingAction = () => {
    if (!onboardingStatus) return null;
    
    switch (onboardingStatus.stage) {
      case 'HANDLE_SELECTION':
        return { label: 'Select Handle', href: '/onboard/handle' };
      case 'AGENT_NAMING':
        return { label: 'Personalize Agent', href: '/onboard/personalize' };
      case 'INTERVIEW':
        return { label: 'Continue Interview', href: '/onboard/interview' };
      case 'PRIVACY_SETUP':
        return { label: 'Set Privacy', href: '/onboard/privacy' };
      case 'PENDING_APPROVAL':
        return null;
      case 'APPROVED':
      case 'COMPLETED':
        return { label: 'View Profile', href: '/profile' };
      default:
        return { label: 'Continue', href: '/onboard' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <p className="text-text-secondary">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <div className="flex items-center text-red-500 mb-4">
            <AlertCircle className="w-5 h-5 mr-2" />
            <p>{error}</p>
          </div>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  const onboardingAction = getOnboardingAction();

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-accent-primary mb-2">
            Welcome back, {user?.handle || 'User'}
          </h1>
          <p className="text-text-secondary">
            Your Praxis Network command center
          </p>
        </div>

        {/* Onboarding Status Card */}
        {onboardingStatus && onboardingStatus.stage !== 'COMPLETED' && (
          <Card className="mb-8 p-6 border-accent-primary/20">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Onboarding Progress</h2>
                <p className="text-text-secondary mb-4">
                  {getOnboardingMessage()}
                </p>
              </div>
              {onboardingStatus.stage === 'PENDING_APPROVAL' ? (
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500">
                  <Clock className="w-4 h-4 mr-1" />
                  Under Review
                </Badge>
              ) : (
                <Badge variant="outline">
                  {Math.round(onboardingStatus.completeness)}% Complete
                </Badge>
              )}
            </div>
            
            <Progress value={onboardingStatus.completeness} className="mb-4" />
            
            {onboardingAction && (
              <Link href={onboardingAction.href}>
                <Button className="w-full sm:w-auto">
                  {onboardingAction.label}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </Card>
        )}

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <Link href="/profile">
            <Card className="p-6 hover:border-accent-primary/50 transition-colors cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-accent-primary/20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-accent-primary" />
                </div>
                <h3 className="text-lg font-semibold ml-4">Your Profile</h3>
              </div>
              <p className="text-text-secondary mb-4">
                View and edit your professional essence
              </p>
              <div className="flex items-center text-accent-primary">
                <span className="text-sm">Manage Profile</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Card>
          </Link>

          {/* Privacy Settings Card */}
          <Link href="/onboard/privacy">
            <Card className="p-6 hover:border-accent-primary/50 transition-colors cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-accent-primary/20 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-accent-primary" />
                </div>
                <h3 className="text-lg font-semibold ml-4">Privacy Settings</h3>
              </div>
              <p className="text-text-secondary mb-4">
                Control who sees your information
              </p>
              <div className="flex items-center text-accent-primary">
                <span className="text-sm">Configure Privacy</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Card>
          </Link>

          {/* Morning Report Card */}
          <Card className="p-6 opacity-60 cursor-not-allowed">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-500/20 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold ml-4">Morning Reports</h3>
            </div>
            <p className="text-text-secondary mb-4">
              Daily networking opportunities (Coming Soon)
            </p>
            <div className="flex items-center text-gray-500">
              <span className="text-sm">Not Available Yet</span>
            </div>
          </Card>
        </div>

        {/* Status Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Account Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-text-secondary text-sm mb-1">Account Type</p>
              <p className="font-medium">{user?.disclosureLevel || 'STEALTH'}</p>
            </div>
            <div>
              <p className="text-text-secondary text-sm mb-1">Profile Status</p>
              <div className="flex items-center">
                {user?.status === 'APPROVED' ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-green-500">Active</span>
                  </>
                ) : user?.status === 'PENDING_APPROVAL' ? (
                  <>
                    <Clock className="w-4 h-4 text-yellow-500 mr-2" />
                    <span className="text-yellow-500">Under Review</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-500">Incomplete</span>
                  </>
                )}
              </div>
            </div>
            <div>
              <p className="text-text-secondary text-sm mb-1">Member Since</p>
              <p className="font-medium">
                {user ? new Date().toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </Card>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-text-secondary mb-4">
            Need help? Check out our{' '}
            <a href="#" className="text-accent-primary hover:underline">
              documentation
            </a>{' '}
            or{' '}
            <a href="#" className="text-accent-primary hover:underline">
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}