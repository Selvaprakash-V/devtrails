export const cn = (...classes) =>
  classes.filter(Boolean).join(' ');

export const formatCurrency = (amount, currency = '₹') =>
  `${currency}${Number(amount || 0).toLocaleString('en-IN')}`;

export const formatDate = (date, opts = {}) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', ...opts,
  });

export const formatDateTime = (date) =>
  new Date(date).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

export const getRiskColor = (level) => ({
  low:    'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400',
  medium: 'text-amber-600  bg-amber-50  dark:bg-amber-900/20  dark:text-amber-400',
  high:   'text-red-600   bg-red-50   dark:bg-red-900/20   dark:text-red-400',
}[level] || 'text-slate-600');

export const getRiskGradient = (score) => {
  if (score <= 33) return 'from-emerald-400 to-emerald-600';
  if (score <= 66) return 'from-amber-400 to-orange-500';
  return 'from-red-400 to-red-600';
};

export const getStatusColor = (status) => ({
  active:    'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400',
  paid:      'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400',
  approved:  'text-blue-600   bg-blue-50   dark:bg-blue-900/20   dark:text-blue-400',
  pending:   'text-amber-600  bg-amber-50  dark:bg-amber-900/20  dark:text-amber-400',
  rejected:  'text-red-600   bg-red-50   dark:bg-red-900/20   dark:text-red-400',
  flagged:   'text-red-600   bg-red-50   dark:bg-red-900/20   dark:text-red-400',
  inactive:  'text-slate-500  bg-slate-100 dark:bg-slate-800     dark:text-slate-400',
  cancelled: 'text-slate-500  bg-slate-100 dark:bg-slate-800     dark:text-slate-400',
}[status] || 'text-slate-600');

import { CloudRain, Thermometer, Wind, Waves, Lock, CloudLightning } from 'lucide-react';

export const disruptionIcon = {
  rain:   CloudRain,
  heat:   Thermometer,
  aqi:    Wind,
  flood:  Waves,
  curfew: Lock,
  storm:  CloudLightning,
};
