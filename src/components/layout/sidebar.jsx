import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Shield, Megaphone, Trophy,
  Menu, X, LogOut, ChevronRight, Video, Star, ListOrdered
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/SupabaseAuthContext';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Squads', path: '/squads', icon: Shield },
  { label: 'Spotlight', path: '/spotlight', icon: Star },
  { label: 'Highlights', path: '/highlights', icon: Video },
  { label: 'Announcements', path: '/announcements', icon: Megaphone },
];

const adminItems = [
  { label: 'Manage Squads', path: '/admin/squads', icon: Shield },
  { label: 'Manage Players', path: '/admin/players', icon: Users },
  { label: 'Squad Lineup', path: '/admin/lineup', icon: ListOrdered },
  { label: 'Spotlight', path: '/admin/spotlight', icon: Star },
  { label: 'Highlights', path: '/admin/highlights', icon: Video },
  { label: 'Announcements', path: '/admin/announcements', icon: Megaphone },
];

export default function Sidebar({ user }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  // Supabase user metadata role — set via Supabase Dashboard > Authentication > Users > user_metadata
  const isAdmin = user?.user_metadata?.role === 'admin';

  const NavLink = ({ item }) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-primary/20'
            : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
        }`}
      >
        <item.icon className="w-5 h-5" />
        <span>{item.label}</span>
        {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
      </Link>
    );
  };

  const displayName = user?.user_metadata?.full_name || user?.email || 'User';
  const displayInitial = displayName[0]?.toUpperCase() || 'U';

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Trophy className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-heading text-lg font-bold text-sidebar-foreground tracking-wide">ELITE FC</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-sidebar-foreground/50">Academy</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <p className="text-[10px] uppercase tracking-[0.15em] text-sidebar-foreground/40 font-semibold px-4 mb-3">Menu</p>
        {navItems.map(item => <NavLink key={item.path} item={item} />)}

        {isAdmin && (
          <>
            <div className="my-4 border-t border-sidebar-border" />
            <p className="text-[10px] uppercase tracking-[0.15em] text-sidebar-foreground/40 font-semibold px-4 mb-3">Admin</p>
            {adminItems.map(item => <NavLink key={item.path} item={item} />)}
          </>
        )}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-9 h-9 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-sm font-semibold text-sidebar-foreground">{displayInitial}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{displayName}</p>
            <p className="text-xs text-sidebar-foreground/50 truncate">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground/50 hover:text-sidebar-foreground"
            onClick={logout}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card shadow-lg border border-border"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 z-40 h-screen w-64 bg-sidebar transition-transform duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        {sidebarContent}
      </aside>
    </>
  );
}