import { motion } from 'framer-motion';
import { CheckCircle, Clock, Zap, CreditCard, AlertCircle } from 'lucide-react';
import { formatDateTime, formatCurrency } from '@/utils/helpers';

const stepConfig = {
  'Disruption detected':          { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  'Claim auto-approved':          { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  'Trigger Detection':            { icon: Zap,         color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  'Payout':                       { icon: CreditCard,  color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  default:                        { icon: Clock,       color: 'text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800' },
};

const getStep = (event) => {
  const key = Object.keys(stepConfig).find(k => event.includes(k));
  return key ? stepConfig[key] : stepConfig.default;
};

const ClaimTimeline = ({ timeline = [] }) => {
  if (!timeline.length) return (
    <p className="text-sm text-slate-400 text-center py-4">No timeline events yet</p>
  );

  return (
    <ol className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-5">
      {timeline.map((item, i) => {
        const { icon: Icon, color, bg } = getStep(item.event || '');
        return (
          <motion.li
            key={i}
            className="ml-6"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <span className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full ${bg} ring-4 ring-white dark:ring-slate-900`}>
              <Icon className={`w-3 h-3 ${color}`} />
            </span>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-3">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.event}</p>
              {item.timestamp && (
                <p className="text-xs text-slate-400 mt-0.5">{formatDateTime(item.timestamp)}</p>
              )}
              {item.meta?.txnId && (
                <p className="text-xs font-mono text-slate-500 mt-1">TXN: {item.meta.txnId}</p>
              )}
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
};

export default ClaimTimeline;
