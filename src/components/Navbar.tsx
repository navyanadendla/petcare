import React, { useState } from 'react';
import {
  PawPrint,
  Bell,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Stethoscope,
  HeartHandshake,
} from 'lucide-react';
import { User, UserRole, NotificationItem } from '../types';
import { NotificationsDropdown } from './NotificationsDropdown';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  notifications: NotificationItem[];
  unreadCount: number;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDeleteNotif: (id: string) => void;
  onSwitchRole: (role: UserRole) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  onSelectTab,
  notifications,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
  onDeleteNotif,
  onSwitchRole,
  onOpenAuth,
  onLogout,
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Dynamic navigation links based on user role (strict 4-5 single-line items)
  const getNavLinks = () => {
    if (!currentUser) {
      return [
        { id: 'features', label: 'Features' },
        { id: 'health', label: 'Health Records' },
        { id: 'vets', label: 'Veterinarians' },
        { id: 'nutrition', label: 'Pet Nutrition' },
      ];
    }
    if (currentUser.role === 'owner') {
      return [
        { id: 'overview', label: 'Overview' },
        { id: 'pets', label: 'My Pets' },
        { id: 'health', label: 'Health' },
        { id: 'appointments', label: 'Appointments' },
        { id: 'nutrition', label: 'Nutrition' },
      ];
    }
    if (currentUser.role === 'vet') {
      return [
        { id: 'overview', label: 'Overview' },
        { id: 'appointments', label: 'Appointments' },
        { id: 'patients', label: 'Patients' },
        { id: 'records', label: 'Clinical Logs' },
        { id: 'vaccines', label: 'Vaccines' },
      ];
    }
    // Admin
    return [
      { id: 'overview', label: 'System Overview' },
      { id: 'owners', label: 'Pet Owners' },
      { id: 'vets', label: 'Veterinarians' },
      { id: 'appointments', label: 'Appointments' },
      { id: 'audit', label: 'System Logs' },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark with brand icon */}
          <div
            onClick={() => onSelectTab(currentUser ? 'overview' : 'features')}
            className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-xs">
              <PawPrint className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                PetCare<span className="text-teal-600">Pulse</span>
              </span>
            </div>
          </div>

          {/* Zone 2: 4-5 clean single-line navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            {navLinks.map(link => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onSelectTab(link.id)}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary action + user & notifications */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <>
                {/* Role Switcher Button */}
                <div className="relative hidden sm:block">
                  <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs font-medium">
                    <button
                      onClick={() => onSwitchRole('owner')}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        currentUser.role === 'owner'
                          ? 'bg-white text-teal-800 shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Owner
                    </button>
                    <button
                      onClick={() => onSwitchRole('vet')}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        currentUser.role === 'vet'
                          ? 'bg-white text-sky-800 shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Vet
                    </button>
                    <button
                      onClick={() => onSwitchRole('admin')}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        currentUser.role === 'admin'
                          ? 'bg-white text-indigo-800 shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Admin
                    </button>
                  </div>
                </div>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsNotifOpen(!isNotifOpen);
                      setIsUserMenuOpen(false);
                    }}
                    className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
                    aria-label="View notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-teal-500 rounded-full ring-2 ring-white" />
                    )}
                  </button>

                  <NotificationsDropdown
                    notifications={notifications}
                    unreadCount={unreadCount}
                    isOpen={isNotifOpen}
                    onClose={() => setIsNotifOpen(false)}
                    onMarkRead={onMarkRead}
                    onMarkAllRead={onMarkAllRead}
                    onDelete={onDeleteNotif}
                    onSelectTab={onSelectTab}
                  />
                </div>

                {/* User Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(!isUserMenuOpen);
                      setIsNotifOpen(false);
                    }}
                    className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover bg-slate-100 ring-1 ring-slate-200"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                        {currentUser.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-slate-800 hidden sm:inline truncate max-w-[120px]">
                      {currentUser.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {currentUser.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {currentUser.email}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-teal-700 capitalize">
                          {currentUser.role === 'owner' && <HeartHandshake className="w-3.5 h-3.5" />}
                          {currentUser.role === 'vet' && <Stethoscope className="w-3.5 h-3.5" />}
                          {currentUser.role === 'admin' && <ShieldCheck className="w-3.5 h-3.5" />}
                          Role: {currentUser.role}
                        </div>
                      </div>

                      {/* Mobile role switcher */}
                      <div className="sm:hidden px-3 py-2 border-b border-slate-100">
                        <span className="text-[10px] font-semibold uppercase text-slate-400 block mb-1">
                          Switch Role
                        </span>
                        <div className="grid grid-cols-3 gap-1">
                          <button
                            onClick={() => { onSwitchRole('owner'); setIsUserMenuOpen(false); }}
                            className="p-1 text-center text-xs bg-slate-50 rounded"
                          >
                            Owner
                          </button>
                          <button
                            onClick={() => { onSwitchRole('vet'); setIsUserMenuOpen(false); }}
                            className="p-1 text-center text-xs bg-slate-50 rounded"
                          >
                            Vet
                          </button>
                          <button
                            onClick={() => { onSwitchRole('admin'); setIsUserMenuOpen(false); }}
                            className="p-1 text-center text-xs bg-slate-50 rounded"
                          >
                            Admin
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onLogout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav bar row */}
      <div className="md:hidden border-t border-slate-100 px-4 py-2 flex items-center gap-2 overflow-x-auto">
        {navLinks.map(link => {
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => onSelectTab(link.id)}
              className={`px-3 py-1 text-xs rounded-md whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-teal-50 text-teal-800 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
