"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { CheckCircle2, XCircle, AlertTriangle, User, Bot } from 'lucide-react';

interface UserReview {
  user: {
    id: string;
    username: string;
    email: string;
    createdAt: string;
    status: string;
  };
  agent: {
    name: string;
    communicationStyle: string;
  };
  professionalEssence: {
    narrative: string;
    currentFocus: string[];
    seekingConnections: string[];
    offeringExpertise: string[];
    metadata: {
      completeness: number;
      lastUpdated: string;
    };
  };
  qualityMetrics: {
    narrativeRichness: string;
    completeness: number;
    authenticitySignal: string;
    redFlags: string[];
  };
}

export default function ReviewUserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { token } = useAdminAuth();
  const [userReview, setUserReview] = useState<UserReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [feedback, setFeedback] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    fetchUserReview();
  }, [params.id, token]);

  const fetchUserReview = async () => {
    if (!token) return;
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${params.id}/essence`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const data = await response.json();
      setUserReview(data);
    } catch (err) {
      setError('Failed to load user details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setProcessing(true);
    setError('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${params.id}/approve`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ adminNotes }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to approve user');
      }

      router.push('/admin/pending-users');
    } catch (err) {
      setError('Failed to approve user');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleRequestInfo = async () => {
    if (!feedback.trim()) {
      setError('Please provide feedback for the user');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${params.id}/request-info`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ feedback }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to request information');
      }

      router.push('/admin/pending-users');
    } catch (err) {
      setError('Failed to request information');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-text-secondary">Loading user details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userReview) {
    return (
      <div className="min-h-screen bg-background-primary p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-500">User not found</p>
          </div>
        </div>
      </div>
    );
  }

  const { user, agent, professionalEssence, qualityMetrics } = userReview;

  return (
    <div className="min-h-screen bg-background-primary p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button variant="outline" onClick={() => router.push('/admin/pending-users')}>
            ← Back to Pending Users
          </Button>
        </div>

        <div className="space-y-6">
          {/* User Info Card */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <User className="w-8 h-8 text-accent-primary" />
                  <div>
                    <h1 className="text-2xl font-bold">@{user.username}</h1>
                    <p className="text-text-secondary">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-text-secondary">
                  <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                  <Badge variant="outline">{user.status}</Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5" />
                  <span className="font-medium">{agent.name}</span>
                </div>
                <p className="text-sm text-text-secondary capitalize">
                  {agent.communicationStyle.replace(/_/g, ' ')}
                </p>
              </div>
            </div>
          </Card>

          {/* Quality Metrics Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quality Metrics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-secondary">Completeness Score</p>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold">
                    {Math.round(qualityMetrics.completeness * 100)}%
                  </span>
                  {qualityMetrics.completeness >= 0.7 ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Narrative Richness</p>
                <p className="text-lg font-medium">{qualityMetrics.narrativeRichness}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Authenticity Signal</p>
                <p className="text-lg font-medium">{qualityMetrics.authenticitySignal}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Red Flags</p>
                {qualityMetrics.redFlags.length === 0 ? (
                  <p className="text-green-500">None detected</p>
                ) : (
                  <div className="space-y-1">
                    {qualityMetrics.redFlags.map((flag, index) => (
                      <Badge key={index} variant="destructive" className="text-xs">
                        {flag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Professional Essence Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Professional Essence</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Narrative</h3>
                <div className="p-4 bg-background-secondary rounded-lg">
                  <p className="text-text-primary whitespace-pre-wrap">
                    {professionalEssence.narrative || 'No narrative provided'}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Current Focus</h3>
                <div className="flex flex-wrap gap-2">
                  {professionalEssence.currentFocus.length > 0 ? (
                    professionalEssence.currentFocus.map((focus, index) => (
                      <Badge key={index} variant="secondary">
                        {focus}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-text-secondary">None specified</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Seeking Connections</h3>
                <div className="flex flex-wrap gap-2">
                  {professionalEssence.seekingConnections.length > 0 ? (
                    professionalEssence.seekingConnections.map((seeking, index) => (
                      <Badge key={index} variant="outline">
                        {seeking}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-text-secondary">None specified</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Offering Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {professionalEssence.offeringExpertise.length > 0 ? (
                    professionalEssence.offeringExpertise.map((expertise, index) => (
                      <Badge key={index} variant="default">
                        {expertise}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-text-secondary">None specified</p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Admin Actions Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Admin Actions</h2>
            
            {!showFeedbackForm ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Admin Notes (Optional)
                  </label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add any internal notes about this approval..."
                    rows={3}
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-500">{error}</p>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowFeedbackForm(true)}
                    disabled={processing}
                  >
                    Request More Info
                  </Button>
                  <Button
                    onClick={handleApprove}
                    disabled={processing}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {processing ? 'Processing...' : 'Approve User'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Feedback for User
                  </label>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide specific feedback about what needs improvement..."
                    rows={5}
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-500">{error}</p>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowFeedbackForm(false)}
                    disabled={processing}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRequestInfo}
                    disabled={processing || !feedback.trim()}
                  >
                    {processing ? 'Sending...' : 'Send Feedback'}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}