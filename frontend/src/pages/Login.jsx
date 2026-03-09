import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight, User, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]         = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick demo logins
  const demoLogin = async (role) => {
    const creds = role === 'admin'
      ? { email: 'admin@devtrails.in', password: 'Admin@1234' }
      : { email: 'worker@devtrails.in', password: 'Worker@1234' };
    setForm(creds);
    try {
      setLoading(true);
      const user = await login(creds.email, creds.password);
      toast.success('Demo login successful!');
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    } catch {
      toast.error('Demo account not seeded yet. Please register.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 via-purple-700 to-primary-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div key={i}
              animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.7 }}
              className="absolute"
              style={{ left: `${10 + i * 15}%`, top: `${10 + i * 12}%`,
                       width: 80 + i * 20, height: 80 + i * 20,
                       background: 'rgba(255,255,255,0.05)', borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}
            />
          ))}
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">DevTrails</span>
          </div>
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Your income,<br />always protected.
          </h2>
          <p className="text-white/70 text-lg">
            AI-powered insurance that pays you automatically when disruptions hit your delivery zone.
          </p>
        </div>
        <div className="relative grid grid-cols-2 gap-4">
          {[
            { v: '₹2.4Cr+', l: 'Paid Out' },
            { v: '50K+',    l: 'Workers' },
            { v: '< 2min',  l: 'Auto Payout' },
            { v: '7 Cities',l: 'Coverage' },
          ].map(({ v, l }) => (
            <div key={l} className="bg-white/10 rounded-2xl p-4">
              <p className="text-2xl font-black text-white">{v}</p>
              <p className="text-white/60 text-sm">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-slate-900">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Welcome back</h1>
            <p className="text-slate-500 dark:text-slate-400">Sign in to manage your coverage and claims.</p>
          </div>

          {/* Demo buttons */}
          <div className="flex gap-3 mb-6">
            <button onClick={() => demoLogin('worker')}
              className="flex items-center justify-center gap-1.5 flex-1 py-2 rounded-xl text-xs font-semibold border-2 border-dashed border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
              <User className="w-3 h-3" /> Demo Worker
            </button>
            <button onClick={() => demoLogin('admin')}
              className="flex items-center justify-center gap-1.5 flex-1 py-2 rounded-xl text-xs font-semibold border-2 border-dashed border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
              <Zap className="w-3 h-3" /> Demo Admin
            </button>
          </div>

          <div className="relative flex items-center mb-6">
            <div className="flex-1 border-t border-slate-200 dark:border-slate-700" />
            <span className="px-3 text-xs text-slate-400">or sign in manually</span>
            <div className="flex-1 border-t border-slate-200 dark:border-slate-700" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="input-field pl-10" placeholder="you@example.com" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="input-field pl-10 pr-10" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full py-3 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Get protected free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
