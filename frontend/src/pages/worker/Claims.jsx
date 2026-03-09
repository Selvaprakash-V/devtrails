import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, Thermometer, Wind, Waves, Lock, ChevronDown, Filter } from 'lucide-react';
import api from '@/services/api';
import { formatCurrency, formatDate, getStatusColor } from '@/utils/helpers';
import ClaimTimeline from '@/components/ClaimTimeline';

const STATUSES = ['all', 'pending', 'approved', 'paid', 'rejected', 'flagged'];

const DIS_ICONS = {
  heavy_rain: CloudRain,
  extreme_heat: Thermometer,
  aqi: Wind,
  flood: Waves,
  curfew: Lock,
};

export default function WorkerClaims() {
  const [activeStatus, setActiveStatus] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const { data: claimsData, isLoading } = useQuery({
    queryKey: ['my-claims'],
    queryFn:  () => api.get('/claims').then(r => r.data.data),
  });

  const { data: statsData } = useQuery({
    queryKey: ['claim-stats'],
    queryFn:  () => api.get('/claims/stats/summary').then(r => r.data.data),
  });

  const claims = claimsData || [];
  const filtered = activeStatus === 'all' ? claims : claims.filter(c => c.status === activeStatus);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">My Claims</h1>
        <p className="text-sm text-slate-500 mt-0.5">Automatic payouts triggered by verified disruptions</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { l: 'Total Claims',     v: statsData?.total || 0,        cls: 'text-slate-800 dark:text-white' },
          { l: 'Total Received',   v: formatCurrency(statsData?.totalAmount || 0), cls: 'text-emerald-600 dark:text-emerald-400' },
          { l: 'This Month',       v: formatCurrency(statsData?.thisMonth || 0),   cls: 'text-primary-600 dark:text-primary-400' },
          { l: 'Pending',          v: statsData?.pending || 0,      cls: 'text-amber-600 dark:text-amber-400' },
        ].map(({ l, v, cls }) => (
          <div key={l} className="glass-card p-4">
            <p className="text-xs text-slate-400 mb-1">{l}</p>
            <p className={`text-xl font-black ${cls}`}>{v}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-slate-400" />
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setActiveStatus(s)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all capitalize ${
              activeStatus === s
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Claims list */}
      <div className="space-y-3">
        {isLoading && [...Array(3)].map((_, i) => (
          <div key={i} className="skeleton h-24 rounded-2xl" />
        ))}

        {!isLoading && filtered.length === 0 && (
          <div className="glass-card p-12 text-center">
            <CloudRain className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500">No claims found{activeStatus !== 'all' ? ` with status "${activeStatus}"` : ''}.</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {filtered.map((claim, idx) => {
            const Icon = DIS_ICONS[claim.disruptionEvent?.type] || CloudRain;
            const isOpen = expanded === claim._id;
            const { bg, text } = getStatusColor(claim.status);

            return (
              <motion.div
                key={claim._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="glass-card overflow-hidden"
              >
                {/* Header row */}
                <button
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : claim._id)}
                >
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                    <Icon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{claim.claimNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${bg} ${text}`}>
                        {claim.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {claim.disruptionEvent?.type?.replace('_', ' ')} • {formatDate(claim.createdAt)}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(claim.compensationAmount)}
                    </p>
                    <p className="text-xs text-slate-400">payout</p>
                  </div>

                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Expanded timeline */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-slate-200 dark:border-slate-700"
                    >
                      <div className="p-5">
                        {claim.timeline?.length > 0 ? (
                          <ClaimTimeline events={claim.timeline} />
                        ) : (
                          <p className="text-sm text-slate-400">No timeline events.</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
