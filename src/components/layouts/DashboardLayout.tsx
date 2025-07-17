import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  Building2, 
  Users, 
  Bot, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Shield,
  UserCheck,
  CreditCard,
  DollarSign
} from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Role-based navigation component
const RoleBasedNav: React.FC<{ userRole: string; currentPath: string }> = ({ userRole, currentPath }) => {
  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: BarChart3, roles: ['company', 'agent', 'admin'] },
    ];

    const roleSpecificItems = [
      // Company-specific items
      { name: 'Digital Twins', href: '/company/digital-twins', icon: Bot, roles: ['company'] },
      { name: 'Campaigns', href: '/company/campaigns', icon: BarChart3, roles: ['company'] },
      { name: 'Agents', href: '/company/agents', icon: Users, roles: ['company'] },
      { name: 'Billing', href: '/company/billing', icon: CreditCard, roles: ['company'] },
      
      // Agent-specific items
      { name: 'My Profile', href: '/agent/profile', icon: UserCheck, roles: ['agent'] },
      { name: 'Available Campaigns', href: '/agent/campaigns', icon: BarChart3, roles: ['agent'] },
      { name: 'My Earnings', href: '/agent/earnings', icon: DollarSign, roles: ['agent'] },
      
      // Admin-specific items
      { name: 'Companies', href: '/admin/companies', icon: Building2, roles: ['admin'] },
      { name: 'All Agents', href: '/admin/agents', icon: Users, roles: ['admin'] },
      { name: 'System Settings', href: '/admin/settings', icon: Shield, roles: ['admin'] },
      
      // Common settings (role-specific paths)
      { name: 'Settings', href: '/settings', icon: Settings, roles: ['company', 'agent', 'admin'] },
    ];

    return [...baseItems, ...roleSpecificItems].filter(item => 
      item.roles.includes(userRole)
    );
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="space-y-1">
      {navigationItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            currentPath === item.href
              ? 'bg-primary bg-opacity-10 text-primary dark:bg-primary dark:bg-opacity-20'
              : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          <item.icon className="w-5 h-5 mr-3" />
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { profile, signOut, isCompany, isAgent, isAdmin, hasRole, canAccess } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Debug: Log when sidebar renders
  React.useEffect(() => {
    console.log('[Sidebar] Rendered:', { email: profile?.email, role: profile?.role, sidebarOpen });
  }, [profile?.email, profile?.role, sidebarOpen]);

  // Get user role for navigation
  const userRole = profile?.role || 'guest';

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-neutral-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } dark:bg-neutral-800`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-200 dark:border-neutral-700">
          <h1 className="text-xl font-bold text-primary">ReelAgents</h1>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => {
                setSidebarOpen(false);
                console.log('[Sidebar] Closed');
              }}
              className="lg:hidden p-2 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="mt-6 px-3">
          <RoleBasedNav userRole={userRole} currentPath={location.pathname} />
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center mb-3 gap-2">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {profile?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-3 flex flex-col justify-center gap-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 text-left break-all truncate max-w-[140px]">{profile?.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 capitalize text-left">{profile?.role}</p>
                {isAdmin && <Shield className="w-3 h-3 text-danger" />}
                {profile?.role === 'company' && <Building2 className="w-3 h-3 text-info" />}
                {profile?.role === 'agent' && <UserCheck className="w-3 h-3 text-success" />}
              </div>
            </div>
          </div>
          <button
            onClick={signOut}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div>
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white dark:bg-neutral-800 shadow-sm border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => {
                setSidebarOpen(true);
                console.log('[Sidebar] Opened');
              }}
              className="lg:hidden p-2 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1" />
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
          </div>
        </div>
        {/* Page content */}
        <main className="p-6 flex flex-col items-center justify-center w-full min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
};