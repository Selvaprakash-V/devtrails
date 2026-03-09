import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '@/services/api';
import { formatCurrency } from '@/utils/helpers';
import { ClaimsBarChart, DailyPayoutsChart } from '@/components/charts/Charts';

export default function AdminAnalytics() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn:  () => api.get('/admin/analytics/claims').then(r => r.data.data),
  });

  const analytics = data || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-slate-500 mt-0.5">Claims, payouts, and disruption statistics</p>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { l: 'Total Payouts',       v: formatCurrency(analytics.totalPayouts || 0),    cls: 'text-emerald-600 dark:text-emerald-400' },
          { l: 'Total Claims',        v: analytics.totalClaims || 0,                     cls: 'text-slate-900 dark:text-white' },
          { l: 'Avg Claim Amount',    v: formatCurrency(analytics.avgClaimAmount || 0),  cls: 'text-primary-600 dark:text-primary-400' },
        ].map(({ l, v, cls }) => (
          <div key={l} className="glass-card p-5">
            <p className="text-xs text-slate-400 mb-1">{l}</p>
            <p className={`text-2xl font-black ${cls}`}>{v}</p>
          </div>
        ))}
      </div>

      {/* Daily payouts chart */}
      <div className="glass-card p-5">
        <h2 className="font-bold text-slate-800 dark:text-white mb-4">Daily Payouts (30 days)</h2>
        {isLoading
          ? <div className="skeleton h-56 rounded-xl" />
          : <DailyPayoutsChart data={analytics.dailyPayouts || []} />
        }
      </div>

      {/* Two bar charts side by side */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h2 className="font-bold text-slate-800 dark:text-white mb-4">Claims by City</h2>
          {isLoading
            ? <div className="skeleton h-48 rounded-xl" />
            : <ClaimsBarChart data={analytics.claimsByCity || []} />
          }
        </div>
        <div className="glass-card p-5">
          <h2 className="font-bold text-slate-800 dark:text-white mb-4">Claims by Disruption Type</h2>
          {isLoading
            ? <div className="skeleton h-48 rounded-xl" />
            : <ClaimsBarChart data={(analytics.claimsByType || []).map(d => ({ name: d._id?.replace('_', ' '), count: d.count }))} />
          }
        </div>
      </div>
    </div>
  );
}
