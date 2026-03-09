import { motion } from 'framer-motion';
import { getRiskGradient } from '@/utils/helpers';

const RiskMeter = ({ score = 0, level = 'low', size = 'md' }) => {
  const sizes = {
    sm: { ring: 80,  stroke: 8,  text: 'text-xl', label: 'text-xs' },
    md: { ring: 120, stroke: 10, text: 'text-3xl', label: 'text-sm' },
    lg: { ring: 160, stroke: 12, text: 'text-4xl', label: 'text-base' },
  };
  const s = sizes[size];
  const radius = (s.ring - s.stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const colorMap = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
  };
  const color = colorMap[level] || colorMap.low;

  const labelMap = { low: 'Low Risk', medium: 'Medium Risk', high: 'High Risk' };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: s.ring, height: s.ring }}>
        <svg width={s.ring} height={s.ring} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={s.ring / 2} cy={s.ring / 2} r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={s.stroke}
            className="text-slate-200 dark:text-slate-700"
          />
          {/* Progress ring */}
          <motion.circle
            cx={s.ring / 2} cy={s.ring / 2} r={radius}
            fill="none"
            stroke={color}
            strokeWidth={s.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`${s.text} font-bold`}
            style={{ color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-slate-500 dark:text-slate-400">/100</span>
        </div>
      </div>
      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold`}
           style={{ color, backgroundColor: `${color}15` }}>
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
        {labelMap[level]}
      </div>
    </div>
  );
};

export default RiskMeter;
