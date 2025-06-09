"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { CheckCircle2, XCircle, Eye, Clock } from 'lucide-react';
import Link from 'next/link';

interface PendingUser {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  agentName: string;
  essenceCompleteness: number;
}

export default function PendingUsersPage() {
  const { token } = useAdminAuth();
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPendingUsers();
  }, [currentPage, token]);

  const fetchPendingUsers = async () => {
    if (!token) return;
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/pending-users?page=${currentPage}&limit=10`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch pending users');
      }

      const data = await response.json();
      setUsers(data.users);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError('Failed to load pending users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCompletenessColor = (completeness: number) => {
    if (completeness >= 0.7) return 'text-green-500';
    if (completeness >= 0.5) return 'text-yellow-500';
    return 'text-red-500';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Pending User Approvals</h1>
          <div className="text-center py-12">
            <p className="text-text-secondary">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Pending User Approvals</h1>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {users.length} Pending
          </Badge>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {users.length === 0 ? (
            <Card className="p-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Pending Users</h2>
              <p className="text-text-secondary">All user registrations have been reviewed!</p>
            </Card>
          ) : (
            users.map((user) => (
              <Card key={user.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-semibold text-lg">@{user.username}</h3>
                        <p className="text-sm text-text-secondary">{user.email}</p>
                      </div>
                      <Badge variant="outline">
                        Agent: {user.agentName}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center space-x-6 text-sm text-text-secondary">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(user.createdAt)}
                      </span>
                      <span className="flex items-center">
                        Essence Score: 
                        <span className={`ml-1 font-medium ${getCompletenessColor(user.essenceCompleteness)}`}>
                          {Math.round(user.essenceCompleteness * 100)}%
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link href={`/admin/review/${user.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Review
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}