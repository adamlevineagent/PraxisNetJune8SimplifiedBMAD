'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the new admin pending users page
    router.push('/admin/pending-users');
  }, [router]);
  
  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center">
      <div className="text-center">
        <p className="text-text-secondary">Redirecting to admin dashboard...</p>
      </div>
    </div>
  );
}
