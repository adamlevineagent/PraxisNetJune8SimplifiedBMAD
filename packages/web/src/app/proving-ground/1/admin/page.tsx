"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  CheckCircle, 
  AlertCircle, 
  Shield,
  FileText,
  MessageSquare,
  Clock
} from 'lucide-react';

interface PendingUser {
  id: string;
  handle: string;
  agentName: string;
  joinedAt: string;
  essenceScore: number;
  narrativeRichness: string;
  completeness: number;
  authenticitySignal: string;
  redFlags: string[];
}

export default function ProvingGround1AdminPage() {
  const router = useRouter();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([
    {
      id: '1',
      handle: '@techbridge',
      agentName: 'Alex (Warm & Conversational)',
      joinedAt: '2 minutes ago',
      essenceScore: 0.72,
      narrativeRichness: 'High',
      completeness: 72,
      authenticitySignal: 'Strong',
      redFlags: [],
    },
    {
      id: '2',
      handle: '@innovator23',
      agentName: 'Nova (Professional & Focused)',
      joinedAt: '15 minutes ago',
      essenceScore: 0.65,
      narrativeRichness: 'Medium',
      completeness: 65,
      authenticitySignal: 'Moderate',
      redFlags: ['Narrative too short'],
    },
    {
      id: '3',
      handle: '@builder_jane',
      agentName: 'Sage (Direct & Efficient)',
      joinedAt: '1 hour ago',
      essenceScore: 0.81,
      narrativeRichness: 'High',
      completeness: 81,
      authenticitySignal: 'Strong',
      redFlags: [],
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [viewMode, setViewMode] = useState<'essence' | 'conversation'>('essence');

  const handleApprove = (userId: string) => {
    // Simulate approval
    setPendingUsers(prev => prev.filter(u => u.id !== userId));
    setSelectedUser(null);
    alert('User approved successfully! Welcome email sent.');
  };

  const handleRequestMore = (userId: string) => {
    // Simulate requesting more info
    alert('Feedback sent to user. They will be notified to update their profile.');
  };

  const getQualityColor = (signal: string) => {
    switch (signal) {
      case 'Strong': return 'text-green-500';
      case 'Moderate': return 'text-yellow-500';
      case 'Weak': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background-primary p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard - Approval Queue</h1>
          <div className="w-full h-px bg-accent-primary mt-4"></div>
        </div>

        {/* Pending Users List */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Pending Approvals ({pendingUsers.length})</h2>
              <div className="space-y-3">
                {pendingUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className="cursor-pointer"
                  >
                    <Card
                      className={`p-4 transition-colors ${
                        selectedUser?.id === user.id ? 'border-accent-primary' : ''
                      }`}
                    >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{user.handle}</p>
                        <p className="text-sm text-text-secondary">{user.agentName}</p>
                      </div>
                      <Badge variant="outline">{user.essenceScore}</Badge>
                    </div>
                    <p className="text-xs text-text-secondary mb-2">Joined: {user.joinedAt}</p>
                    {user.redFlags.length > 0 && (
                      <div className="flex items-center text-xs text-red-500">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {user.redFlags.length} issue{user.redFlags.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </Card>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* User Details */}
          <div className="lg:col-span-2">
            {selectedUser ? (
              <Card className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">User Review: {selectedUser.handle}</h3>
                    <p className="text-text-secondary">{selectedUser.agentName}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setViewMode('essence')}
                      variant={viewMode === 'essence' ? 'primary' : 'outline'}
                      size="sm"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Full Essence
                    </Button>
                    <Button
                      onClick={() => setViewMode('conversation')}
                      variant={viewMode === 'conversation' ? 'primary' : 'outline'}
                      size="sm"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      View Conversation
                    </Button>
                  </div>
                </div>

                {/* Quality Metrics */}
                <div className="bg-background-secondary p-4 rounded-lg mb-6">
                  <h4 className="font-medium mb-3">Quality Metrics:</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-text-secondary">Narrative Richness</p>
                      <p className="font-medium">{selectedUser.narrativeRichness}</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">Completeness</p>
                      <p className="font-medium">{selectedUser.completeness}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">Authenticity Signal</p>
                      <p className={`font-medium ${getQualityColor(selectedUser.authenticitySignal)}`}>
                        {selectedUser.authenticitySignal}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">Red Flags</p>
                      <p className="font-medium">
                        {selectedUser.redFlags.length === 0 ? (
                          <span className="text-green-500">None detected</span>
                        ) : (
                          <span className="text-red-500">{selectedUser.redFlags.join(', ')}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content View */}
                {viewMode === 'essence' ? (
                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="font-medium mb-2">Professional Narrative</h4>
                      <p className="text-sm text-text-secondary">
                        "A passionate technologist focused on democratizing AI for non-technical 
                        founders. Currently building tools that bridge the gap between complex 
                        AI capabilities and practical business applications. My journey started 
                        in engineering but evolved into a mission to make technology accessible 
                        to everyone who has ideas worth building."
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Key Themes Discovered</h4>
                      <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                        <li>Democratization & Accessibility</li>
                        <li>Bridge-building between technical and non-technical</li>
                        <li>Tool creation for empowerment</li>
                        <li>User-centric design philosophy</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 mb-6">
                    <div className="bg-background-secondary p-4 rounded-lg">
                      <p className="text-sm mb-2"><strong>Agent:</strong> What's got your professional attention these days?</p>
                      <p className="text-sm text-text-secondary">
                        <strong>User:</strong> I'm really focused on making AI accessible to non-technical founders. 
                        Too many great ideas die because people can't navigate the technical complexity.
                      </p>
                    </div>
                    <div className="bg-background-secondary p-4 rounded-lg">
                      <p className="text-sm mb-2"><strong>Agent:</strong> That's fascinating! What specific challenges are you seeing?</p>
                      <p className="text-sm text-text-secondary">
                        <strong>User:</strong> The biggest issue is the knowledge gap. Founders know what they want 
                        to build but don't know how to evaluate technical solutions or communicate with developers...
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button
                    onClick={() => handleApprove(selectedUser.id)}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleRequestMore(selectedUser.id)}
                    variant="outline"
                    className="flex-1"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Request More Info
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <Shield className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                <p className="text-text-secondary">
                  Select a user from the queue to review their application
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Button
            onClick={() => router.push('/proving-ground/1')}
            variant="outline"
          >
            ← Back to Proving Ground
          </Button>
        </div>
      </div>
    </div>
  );
}