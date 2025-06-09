"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Edit2 } from 'lucide-react';

interface ProfessionalEssence {
  narrative: string;
  currentFocus: string[];
  seekingConnections: string[];
  offeringExpertise: string[];
  metadata: {
    completeness: number;
    lastUpdated: Date;
  };
}

export default function ReviewPage() {
  const router = useRouter();
  const [essence, setEssence] = useState<ProfessionalEssence | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const storedEssence = sessionStorage.getItem('professionalEssence');
    if (!storedEssence) {
      router.push('/onboard/personalize');
      return;
    }

    try {
      setEssence(JSON.parse(storedEssence));
    } catch (err) {
      console.error('Failed to parse essence:', err);
      router.push('/onboard/personalize');
    }
  }, [router]);

  const handleSubmit = () => {
    setIsSubmitted(true);
    // Clear session storage
    sessionStorage.removeItem('conversationId');
    sessionStorage.removeItem('agentName');
    sessionStorage.removeItem('professionalEssence');
  };

  const handleEdit = () => {
    router.push('/profile');
  };

  if (!essence) {
    return <div>Loading...</div>;
  }

  const completenessPercent = Math.round(essence.metadata.completeness * 100);

  return (
    <div className="min-h-screen bg-background-primary">
      <main className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          {!isSubmitted ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Your Professional Essence</h1>
                <p className="text-text-secondary">
                  Review what we've discovered about you. You can edit this anytime from your profile.
                </p>
              </div>

              <Card className="p-8 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Completeness Score</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-accent-primary">{completenessPercent}%</span>
                    {completenessPercent >= 70 ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Clock className="w-6 h-6 text-yellow-500" />
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Your Narrative</h3>
                    <div className="p-4 bg-background-secondary rounded-lg">
                      <p className="text-text-primary whitespace-pre-wrap">{essence.narrative}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Current Focus</h3>
                    <div className="flex flex-wrap gap-2">
                      {essence.currentFocus.map((focus, index) => (
                        <Badge key={index} variant="secondary">
                          {focus}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Seeking Connections</h3>
                    <div className="flex flex-wrap gap-2">
                      {essence.seekingConnections.map((seeking, index) => (
                        <Badge key={index} variant="outline">
                          {seeking}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Offering Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {essence.offeringExpertise.map((expertise, index) => (
                        <Badge key={index} variant="default">
                          {expertise}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t">
                  <h3 className="font-medium mb-3">Privacy Settings</h3>
                  <div className="space-y-2 text-sm text-text-secondary">
                    <div className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
                      <span>Public</span>
                      <span className="text-text-primary">Basic professional identity</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
                      <span>Members</span>
                      <span className="text-text-primary">Current projects and interests</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
                      <span>Trusted</span>
                      <span className="text-text-primary">Specific collaboration needs</span>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary mt-3">
                    You can adjust privacy settings anytime from your profile
                  </p>
                </div>
              </Card>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={handleEdit}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Later
                </Button>
                <Button onClick={handleSubmit} size="lg">
                  Submit for Approval →
                </Button>
              </div>
            </>
          ) : (
            <Card className="p-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4">Profile Submitted!</h2>
              <p className="text-text-secondary mb-6 max-w-md mx-auto">
                Thank you for completing the onboarding interview! Your profile has been submitted for approval.
                You'll receive a notification once it's approved, and your agent will begin networking on your behalf.
              </p>
              <div className="space-y-4">
                <p className="text-sm text-text-secondary">
                  Expect your first "Morning Report" within 24-48 hours of approval.
                </p>
                <Button onClick={() => router.push('/dashboard')} variant="outline">
                  Go to Dashboard
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}