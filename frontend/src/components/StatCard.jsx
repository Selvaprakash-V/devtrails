import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  gradient,
  subtitle,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="glass-card p-5 space-y-3">
        <div className="skeleton h-4 w-24 rounded" />
        <div className="skeleton h-8 w-32 rounded" />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    );
  }

  const isPositive = trend >= 0;

  return (
    <motion.div
      whileHover={{ y: -2, shadow: '0 12px 40px rgba(0,0,0,0.1)' }}
      className="glass-card p-5 group cursor-default"
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        {Icon && (
          <div className={`p-2 rounded-xl ${gradient || 'bg-primary-50 dark:bg-primary-900/20'}`}>
            <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
        )}
      </div>

      <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{value}</p>

      {subtitle && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{subtitle}</p>
      )}

      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{Math.abs(trend)}% {trendLabel || 'vs last week'}</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
