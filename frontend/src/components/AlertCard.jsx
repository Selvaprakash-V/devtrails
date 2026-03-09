import { motion } from 'framer-motion';
import { AlertTriangle, CloudRain, Thermometer, Wind, Waves, Shield } from 'lucide-react';
import { formatDateTime } from '@/utils/helpers';

const iconMap = {
  rain:   CloudRain,
  heat:   Thermometer,
  aqi:    Wind,
  flood:  Waves,
  curfew: Shield,
  storm:  AlertTriangle,
};

const severityConfig = {
  low:     { bg: 'bg-blue-50 dark:bg-blue-900/10',   border: 'border-blue-200 dark:border-blue-800',   text: 'text-blue-700 dark:text-blue-400',   dot: 'bg-blue-400' },
  medium:  { bg: 'bg-amber-50 dark:bg-amber-900/10', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-400' },
  high:    { bg: 'bg-red-50 dark:bg-red-900/10',     border: 'border-red-200 dark:border-red-800',     text: 'text-red-700 dark:text-red-400',     dot: 'bg-red-400' },
  extreme: { bg: 'bg-red-100 dark:bg-red-900/20',    border: 'border-red-300 dark:border-red-700',    text: 'text-red-800 dark:text-red-300',     dot: 'bg-red-600 animate-pulse' },
};

const AlertCard = ({ disruption, animate = true }) => {
  const cfg = severityConfig[disruption.severity] || severityConfig.medium;
  const Icon = iconMap[disruption.type] || AlertTriangle;

  const card = (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${cfg.bg} ${cfg.border}`}>
      <div className={`p-2 rounded-lg ${cfg.bg} border ${cfg.border} shrink-0`}>
        <Icon className={`w-4 h-4 ${cfg.text}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-sm font-semibold ${cfg.text}`}>
            {disruption.type?.replace('_', ' ').toUpperCase()} Alert
          </span>
          <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
        </div>
        <p className={`text-xs ${cfg.text} opacity-80`}>
          {disruption.city} · {disruption.measuredValue}{disruption.unit}
          {disruption.detectedAt && ` · ${formatDateTime(disruption.detectedAt)}`}
        </p>
      </div>
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text} border ${cfg.border} capitalize shrink-0`}>
        {disruption.severity}
      </span>
    </div>
  );

  if (!animate) return card;
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      {card}
    </motion.div>
  );
};

export default AlertCard;
