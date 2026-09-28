import React, { useState } from 'react';
import { Sparkles, User, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { loginUser, registerUser } from '../api';
import { User as UserType } from '../types';

interface LoginPageProps {
  initialTab?: 'signin' | 'register';
  onNavigate: (page: string) => void;
  onLoginSuccess: (user: UserType) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  initialTab = 'signin',
  onNavigate,
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>(initialTab);

  // Login fields
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
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
    if (!loginUsername || !loginPassword) {
      setError('Please provide both username and password');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await loginUser(loginUsername, loginPassword);
      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername || !regEmail || !regPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError(null);

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

  const handleFillDemo = async () => {
    setLoginUsername('sai');
    setLoginPassword('password123');
    setError(null);
    setIsLoading(true);
    try {
      const data = await loginUser('sai', 'password123');
      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Login failed with demo account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[88vh] bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 mb-3 shadow-md cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onNavigate('landing')}
          >
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Pocket<span className="text-blue-600">Smart</span> AI
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            AI-Powered Budget Planning & Smart Recommendations
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Tab Selector: Sign In vs Get Started */}
          <div className="flex border-b border-slate-200 bg-slate-100/70 p-1.5 gap-1.5 m-3 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setError(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'signin'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-900'
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
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Get Started Free
            </button>
          </div>

          <div className="p-6 sm:p-8 pt-4">
            {activeTab === 'signin' ? (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900">Sign In to PocketSmart</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Access your personalized budget plans and recommendations.
                  </p>
                </div>

                {error && (
                  <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                        placeholder="e.g. sai"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
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

                {/* 1-Click Documented Demo Account */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleFillDemo}
                    disabled={isLoading}
                    className="w-full py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100/80 text-blue-700 text-xs font-bold border border-blue-200 transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>1-Click Sign In with Demo (sai / password123)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-5">
                  <h3 className="text-lg font-bold text-slate-900">Create Your Account</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Join PocketSmart AI and start smart budget planning.
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{error}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Username *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        placeholder="e.g. rahul_k"
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="rahul@example.com"
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="Rahul Kumar"
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-3"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
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
            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => onNavigate('landing')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1.5 transition-colors"
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
