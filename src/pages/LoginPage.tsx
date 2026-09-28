import React, { useState } from 'react';
import { User as UserIcon, Lock, Mail, Sparkles, ArrowRight, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { loginUser, registerUser } from '../api';
import { User } from '../types';

interface LoginPageProps {
  initialTab?: 'signin' | 'register';
  onNavigate: (page: string) => void;
  onLoginSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  initialTab = 'signin',
  onNavigate,
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>(initialTab);

  // Sign In state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await loginUser(loginUsername, loginPassword);
      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your username and password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await registerUser(regUsername, regEmail, regPassword, regFullName);
      setSuccessMsg('Account created successfully! Logging you in...');
      const loginData = await loginUser(regUsername, regPassword);
      onLoginSuccess(loginData.user);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[88vh] bg-[#0F172A] text-[#F8FAFC] flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1E293B] text-[#A78BFA] mb-3 shadow-md border border-purple-500/20 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onNavigate('landing')}
          >
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-[#F8FAFC] tracking-tight">
            Pocket<span className="text-[#A78BFA]">Smart</span> <span className="text-[#38BDF8]">AI</span>
          </h2>
          <p className="text-xs text-[#94A3B8] font-medium mt-1">
            AI-Powered Budget Planning & Smart Recommendations
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#1E293B] rounded-3xl shadow-xl border border-slate-800 overflow-hidden">
          {/* Tab Selector: Sign In vs Get Started */}
          <div className="flex border-b border-slate-800 bg-[#0F172A] p-1.5 gap-1.5 m-3 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setError(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'signin'
                  ? 'bg-[#7C3AED] text-[#F8FAFC] shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setError(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'register'
                  ? 'bg-[#7C3AED] text-[#F8FAFC] shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Get Started Free
            </button>
          </div>

          <div className="p-6 sm:p-8 pt-4">
            {activeTab === 'signin' ? (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-[#F8FAFC]">Sign In to PocketSmart</h3>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Access your personalized budget plans and recommendations.
                  </p>
                </div>

                {error && (
                  <div className="mb-5 p-3 rounded-xl bg-red-950/20 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#EF4444]" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                        placeholder="e.g. sai"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#0F172A] border border-slate-700 rounded-xl text-sm text-[#F8FAFC] placeholder-slate-500 focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#0F172A] border border-slate-700 rounded-xl text-sm text-[#F8FAFC] placeholder-slate-500 focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-[#7C3AED] hover:bg-[#8B5CF6] text-[#F8FAFC] font-bold text-sm rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2 active:scale-95"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <div className="mb-5">
                  <h3 className="text-lg font-bold text-[#F8FAFC]">Create Your Account</h3>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Join PocketSmart AI and start smart budget planning.
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-red-950/20 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#EF4444]" />
                    <span>{error}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-[#22C55E]" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                      Username *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        placeholder="e.g. rahul_k"
                        className="w-full pl-10 pr-4 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-xs text-[#F8FAFC] placeholder-slate-500 focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="rahul@example.com"
                        className="w-full pl-10 pr-4 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-xs text-[#F8FAFC] placeholder-slate-500 focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="Rahul Kumar"
                        className="w-full pl-10 pr-4 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-xs text-[#F8FAFC] placeholder-slate-500 focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-xs text-[#F8FAFC] placeholder-slate-500 focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-xs text-[#F8FAFC] placeholder-slate-500 focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-[#7C3AED] hover:bg-[#8B5CF6] text-[#F8FAFC] font-extrabold text-sm rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-3 active:scale-95"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Get Started</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Link to Landing page */}
            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <button
                type="button"
                onClick={() => onNavigate('landing')}
                className="text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] inline-flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Explore PocketSmart features without signing in</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
