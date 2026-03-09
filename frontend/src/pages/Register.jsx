import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Eye, EyeOff, User, Phone, MapPin, Bike, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune'];
const PLATFORMS = ['Swiggy', 'Zomato', 'Dunzo', 'Blinkit', 'Other'];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    city: 'Mumbai', deliveryPlatform: 'Swiggy',
  });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    try {
      setLoading(true);
      const user = await register(form);
      toast.success(`Welcome to DevTrails, ${user.name.split(' ')[0]}!`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-primary-50/30 to-purple-50/30 dark:from-[#020617] dark:via-slate-900 dark:to-slate-900 p-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-300/20 dark:bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {step === 1 ? 'Create Account' : 'Work Details'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {step === 1 ? 'Start protecting your income in 2 minutes' : 'Help us calculate your risk score'}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map(s => (
            <div key={s} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${s <= step ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 ? (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input className="input-field pl-10" type="text" placeholder="Rahul Kumar" value={form.name}
                    onChange={e => update('name', e.target.value)} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input className="input-field pl-10" type="email" placeholder="rahul@example.com" value={form.email}
                    onChange={e => update('email', e.target.value)} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input className="input-field pl-10" type="tel" placeholder="9876543210" value={form.phone}
                    onChange={e => update('phone', e.target.value)} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input className="input-field pl-10 pr-10" type={showPass ? 'text' : 'password'} placeholder="Min. 8 chars" value={form.password}
                    onChange={e => update('password', e.target.value)} required minLength={8} />
                  <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Your City</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select className="input-field pl-10 appearance-none" value={form.city} onChange={e => update('city', e.target.value)}>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Delivery Platform</label>
                <div className="relative">
                  <Bike className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select className="input-field pl-10 appearance-none" value={form.deliveryPlatform} onChange={e => update('deliveryPlatform', e.target.value)}>
                    {PLATFORMS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
                <p className="text-sm font-medium text-primary-800 dark:text-primary-300 mb-1 flex items-center gap-1.5"><CheckCircle className="w-4 h-4" />What happens next?</p>
                <ul className="text-xs text-primary-700 dark:text-primary-400 space-y-1">
                  <li>• AI calculates your personalised risk score</li>
                  <li>• Get a quote for weekly premium (₹20–₹50)</li>
                  <li>• Activate and you're instantly covered</li>
                </ul>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            {step === 2 && (
              <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
            )}
            <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
              className="btn-primary flex-1 py-3 disabled:opacity-60">
              {loading ? 'Creating account...' : step === 1 ? 'Continue' : 'Create Account'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </motion.button>
          </div>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Already registered?{' '}
          <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
