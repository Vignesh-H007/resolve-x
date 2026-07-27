import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, User, Key, Mail, Sparkles, Building2 } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthProps {
  onSuccess: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onSuccess }) => {
  const { login, register } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'citizen' | 'admin'>('citizen');
  const [error, setError] = useState('');

  const handleDemoClick = (demoEmail: string, demoRole: 'citizen' | 'admin') => {
    setError('');
    login(demoEmail, demoRole);
    onSuccess();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please provide an email address.');
      return;
    }

    if (!isLogin && !name) {
      setError('Please enter your full name.');
      return;
    }

    if (isLogin) {
      // For demo convenience, let's auto-determine role by email patterns or just standard roles
      let assignedRole: 'citizen' | 'admin' = 'citizen';
      if (email.toLowerCase().includes('admin') || email.toLowerCase() === 'admin@resolvex.gov') {
        assignedRole = 'admin';
      }
      
      login(email, assignedRole);
      onSuccess();
    } else {
      register(name, email, role);
      onSuccess();
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-blue-950 flex items-center justify-center text-white font-black text-lg shadow-md">
            RX
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          ResolveX Civic Portal
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Transparent issue resolution for our local municipality
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          layout
          className="bg-white py-8 px-6 sm:px-10 rounded-2xl shadow-lg border border-slate-200/60"
        >
          {/* Logo & Header inside Form Card like screenshot 1 */}
          <div className="flex items-center gap-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200/40">
            <div className="w-10 h-10 rounded-lg bg-blue-900 text-white flex items-center justify-center">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-950 text-sm">Welcome back</h3>
              <p className="text-xs text-slate-500">Sign in to your ResolveX account</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
              <ShieldAlert size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key size={16} className="text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Choose Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('citizen')}
                    className={`py-2 px-3 border text-sm font-semibold rounded-xl text-center cursor-pointer transition ${
                      role === 'citizen'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Citizen (Reporter)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-2 px-3 border text-sm font-semibold rounded-xl text-center cursor-pointer transition ${
                      role === 'admin'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    City Admin
                  </button>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition cursor-pointer"
              >
                {isLogin ? 'Sign in' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 cursor-pointer"
            >
              {isLogin ? (
                <>New here? <span className="underline">Create an account</span></>
              ) : (
                <>Already have an account? <span className="underline">Sign in</span></>
              )}
            </button>
          </div>

          {/* Demo Credentials Block as shown in Screenshot 1 */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/50 space-y-3">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                <Sparkles size={10} /> Quick Access Demo Accounts
              </span>
              <p className="text-xs text-slate-500 font-medium">Click a demo account below to auto-log in:</p>
              
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleDemoClick('admin@resolvex.gov', 'admin')}
                  className="w-full flex items-center justify-between text-xs px-3 py-2 bg-white hover:bg-indigo-50 border border-slate-200 rounded-lg text-slate-700 text-left cursor-pointer hover:border-indigo-300 transition"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">City Admin</span>
                    <span className="text-slate-400 font-normal">admin@resolvex.gov</span>
                  </div>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoClick('demo@citizen.com', 'citizen')}
                  className="w-full flex items-center justify-between text-xs px-3 py-2 bg-white hover:bg-blue-50 border border-slate-200 rounded-lg text-slate-700 text-left cursor-pointer hover:border-blue-300 transition"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">Demo Citizen</span>
                    <span className="text-slate-400 font-normal">demo@citizen.com</span>
                  </div>
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Citizen</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
