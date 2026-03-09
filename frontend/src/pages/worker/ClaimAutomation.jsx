import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Cloud, Zap, BadgeCheck, Wallet,
  ArrowRight, Activity, CheckCircle2,
} from 'lucide-react';
import api from '@/services/api';
import { formatDate } from '@/utils/helpers';

const STEPS = [
  {
    icon: Cloud,
    label: 'Weather Monitored',
    desc: 'Live data from OpenWeatherMap checked every 15 minutes across 7 cities',
    color: 'from-blue-500 to-cyan-500',
    bg:   'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
  },
  {
    icon: Activity,
    label: 'Threshold Detected',
    desc: 'If rain > 80mm, heat > 42°C, or AQI > 300 — a disruption event is recorded',
    color: 'from-amber-500 to-orange-500',
    bg:   'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-600 dark:text-amber-400',
  },
  {
    icon: Zap,
    label: 'Claims Auto-Created',
    desc: 'All active policy holders in the affected city receive automatic claims — no forms',
    color: 'from-purple-500 to-primary-500',
    bg:   'bg-purple-50 dark:bg-purple-900/20',
    text: 'text-purple-600 dark:text-purple-400',
  },
  {
    icon: BadgeCheck,
    label: 'Fraud Check Passed',
    desc: 'AI fraud scoring validates GPS data, claim frequency, and KYC status',
    color: 'from-emerald-500 to-teal-500',
    bg:   'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: Wallet,
    label: 'Payout Credited',
    desc: 'Compensation is transferred to your registered UPI/wallet within minutes',
    color: 'from-rose-500 to-pink-500',
    bg:   'bg-rose-50 dark:bg-rose-900/20',
    text: 'text-rose-600 dark:text-rose-400',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function ClaimAutomation() {
  const { data: disruptions, isLoading } = useQuery({
    queryKey: ['disruptions'],
    queryFn:  () => api.get('/disruptions').then(r => r.data.data),
  });

  const recent = (disruptions || []).filter(d => d.isTriggered).slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">How Claims Work</h1>
        <p className="text-sm text-slate-500 mt-0.5">Parametric automation — zero paperwork, instant payouts</p>
      </div>

      {/* Animated pipeline */}
      <motion.div
        className="grid md:grid-cols-5 gap-4 items-start"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {STEPS.map((step, i) => (
          <div key={step.label} className="flex md:flex-col items-start md:items-center gap-4 md:gap-2">
            <motion.div
              variants={itemVariants}
              className={`rounded-2xl p-5 ${step.bg} border border-slate-200 dark:border-slate-700 w-full`}
            >
              <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${step.color} shadow-lg mb-3`}>
                <step.icon className="w-5 h-5 text-white" />
              </div>
              <p className={`text-sm font-bold ${step.text}`}>{step.label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{step.desc}</p>
            </motion.div>

            {i < STEPS.length - 1 && (
              <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0 mt-3 hidden md:block" />
            )}
          </div>
        ))}
      </motion.div>

      {/* Key thresholds */}
      <div className="glass-card p-6">
        <h2 className="font-bold text-slate-900 dark:text-white mb-4">Trigger Thresholds</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: 'Heavy Rain',    threshold: '> 80 mm',   unit: 'rainfall',  color: 'bg-blue-500' },
            { label: 'Extreme Heat',  threshold: '> 42 °C',   unit: 'temperature', color: 'bg-orange-500' },
            { label: 'Poor Air Quality', threshold: 'AQI > 300', unit: 'index',  color: 'bg-slate-500' },
          ].map(({ label, threshold, unit, color }) => (
            <div key={label} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center gap-3">
              <div className={`w-2.5 h-10 rounded-full ${color}`} />
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">{threshold}</p>
                <p className="text-xs text-slate-400">{unit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent triggered disruptions */}
      <div className="glass-card p-6">
        <h2 className="font-bold text-slate-900 dark:text-white mb-4">Recent Triggered Disruptions</h2>
        {isLoading && (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}
          </div>
        )}
        {!isLoading && recent.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-6">No disruptions triggered yet.</p>
        )}
        {recent.map((d, i) => (
          <motion.div
            key={d._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-4 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 capitalize">
                {d.type?.replace('_', ' ')} — {d.city}
              </p>
              <p className="text-xs text-slate-400">{formatDate(d.createdAt)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {d.claimsGenerated || 0} claims triggered
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
