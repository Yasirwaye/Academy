import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '@/lib/SupabaseAuthContext';

export default function AppLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background font-body">
      <Sidebar user={user} />
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 md:p-8 pt-16 lg:pt-8">
          <Outlet context={{ user }} />
        </div>
      </main>
    </div>
  );
}