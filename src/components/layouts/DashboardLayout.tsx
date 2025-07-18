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
import styles from './DashboardLayout.module.css';

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
    <div className={styles.navList}>
      {navigationItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={`${styles.navLink} ${
            currentPath === item.href
              ? styles['navLink--active']
              : styles['navLink--inactive']
          }`}
        >
          <item.icon className={styles.navIcon} />
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
    <div className={styles.layout}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className={styles.sidebarBackdrop}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${
        sidebarOpen ? styles['sidebar--open'] : styles['sidebar--closed']
      }`}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.logo}>ReelAgents</h1>
          <div className={styles.headerActions}>
            <ThemeToggle />
            <button
              onClick={() => {
                setSidebarOpen(false);
                console.log('[Sidebar] Closed');
              }}
              className={styles.mobileCloseButton}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className={styles.navigation}>
          <RoleBasedNav userRole={userRole} currentPath={location.pathname} />
        </nav>

        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <span className={styles.userAvatarText}>
                {profile?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className={styles.userDetails}>
              <p className={styles.userEmail}>{profile?.email}</p>
              <div className={styles.userRole}>
                <p className={styles.userRoleText}>{profile?.role}</p>
                {isAdmin && <Shield className={`${styles.roleIcon} ${styles['roleIcon--admin']}`} />}
                {profile?.role === 'company' && <Building2 className={`${styles.roleIcon} ${styles['roleIcon--company']}`} />}
                {profile?.role === 'agent' && <UserCheck className={`${styles.roleIcon} ${styles['roleIcon--agent']}`} />}
              </div>
            className={`nav-link ${
          </div>
                ? 'nav-link-active'
                : 'nav-link-inactive'
            className={styles.signOutButton}
          >
            <LogOut className={styles.navIcon} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className={styles.mainContent}>
        {/* Top bar */}
        <div className={styles.topBar}>
          <div className={styles.topBarContent}>
            <button
              onClick={() => {
                setSidebarOpen(true);
                console.log('[Sidebar] Opened');
              }}
              className={styles.mobileMenuButton}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className={styles.topBarSpacer} />
            <div className={styles.desktopThemeToggle}>
              <ThemeToggle />
            </div>
          </div>
        </div>
        {/* Page content */}
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>
    </div>
  );
};