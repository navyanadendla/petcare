import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Building2, Stethoscope, CheckCircle2, ArrowRight } from 'lucide-react';
import { db } from '../services/storage';
import { User, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialMode?: 'login' | 'register' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [role, setRole] = useState<'owner' | 'vet'>('owner');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [forgotSent, setForgotSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!email.trim()) {
        throw new Error('Please enter your email address.');
      }
      const { user } = db.auth.login(email.trim(), password);
      setIsLoading(false);
      onSuccess(user);
      onClose();
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!name.trim()) throw new Error('Please enter your full name.');
      if (!email.trim() || !email.includes('@')) throw new Error('Please enter a valid email address.');
      if (password.length < 6) throw new Error('Password must be at least 6 characters long.');
      if (role === 'vet' && !clinicName.trim()) throw new Error('Please provide your clinic or practice name.');

      const { user } = db.auth.register(name.trim(), email.trim(), role, {
        clinicName: role === 'vet' ? clinicName.trim() : undefined,
        specialization: role === 'vet' ? (specialization.trim() || 'General Veterinary Medicine') : undefined,
      });

      setIsLoading(false);
      onSuccess(user);
      onClose();
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Registration failed.');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide your registered email address.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setForgotSent(true);
    }, 600);
  };

  const quickDemoLogin = (targetRole: UserRole) => {
    const { user } = db.auth.loginAsRole(targetRole);
    onSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {mode === 'login' && 'Sign in to PetCare'}
              {mode === 'register' && 'Create your Account'}
              {mode === 'forgot' && 'Reset your Password'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {mode === 'login' && 'Manage your pets, appointments & health records'}
              {mode === 'register' && 'Join thousands of pet parents and veterinarians'}
              {mode === 'forgot' && 'Enter your email to receive recovery instructions'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
            {error}
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setError(null); }}
                  className="text-xs text-teal-700 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo One-Click Access */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2 text-center">
                One-Click Instant Demo Login
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => quickDemoLogin('owner')}
                  className="px-2 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 border border-transparent rounded-lg text-xs font-medium text-slate-700 transition-colors text-center"
                >
                  Pet Owner
                </button>
                <button
                  type="button"
                  onClick={() => quickDemoLogin('vet')}
                  className="px-2 py-1.5 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 border border-transparent rounded-lg text-xs font-medium text-slate-700 transition-colors text-center"
                >
                  Veterinarian
                </button>
                <button
                  type="button"
                  onClick={() => quickDemoLogin('admin')}
                  className="px-2 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-transparent rounded-lg text-xs font-medium text-slate-700 transition-colors text-center"
                >
                  Administrator
                </button>
              </div>
            </div>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-500">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(null); }}
                  className="font-semibold text-teal-700 hover:underline"
                >
                  Register here
                </button>
              </p>
            </div>
          </form>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                I am registering as:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('owner')}
                  className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
                    role === 'owner'
                      ? 'border-teal-600 bg-teal-50/70 text-teal-800 font-semibold'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  Pet Owner
                </button>
                <button
                  type="button"
                  onClick={() => setRole('vet')}
                  className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
                    role === 'vet'
                      ? 'border-sky-600 bg-sky-50/70 text-sky-800 font-semibold'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Stethoscope className="w-4 h-4" />
                  Veterinarian
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={role === 'vet' ? 'Dr. Jane Smith, DVM' : 'Jane Smith'}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            {role === 'vet' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Veterinary Clinic / Practice Name
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={clinicName}
                      onChange={e => setClinicName(e.target.value)}
                      placeholder="e.g. City Veterinary Hospital"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Medical Specialization (Optional)
                  </label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={e => setSpecialization(e.target.value)}
                    placeholder="e.g. Feline & Canine Medicine, Surgery"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? 'Creating Account...' : 'Complete Registration'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); }}
                  className="font-semibold text-teal-700 hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        )}

        {/* Forgot Password Flow */}
        {mode === 'forgot' && (
          <div className="p-6">
            {forgotSent ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-semibold text-slate-900">
                  Password Reset Link Sent
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                  We've sent recovery instructions to <strong>{email}</strong>. For this demo, your account is immediately accessible via the one-click demo logins.
                </p>
                <div className="pt-3">
                  <button
                    onClick={() => { setMode('login'); setForgotSent(false); }}
                    className="py-2 px-4 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition"
                  >
                    Return to Sign In
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Your Registered Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. emily@example.com"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm rounded-lg transition-colors"
                >
                  {isLoading ? 'Sending Instructions...' : 'Send Recovery Link'}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setError(null); }}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
