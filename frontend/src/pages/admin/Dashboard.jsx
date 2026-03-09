import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Users, FileCheck, AlertTriangle, TrendingUp,
  CloudRain, ArrowRight, CheckCircle, Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import { formatCurrency, formatDate, getStatusColor } from '@/utils/helpers';
import StatCard from '@/components/StatCard';
import AlertCard from '@/components/AlertCard';

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn:  () => api.get('/admin/dashboard').then(r => r.data.data),
    refetchInterval: 60_000,
  });

  const { data: disruptions } = useQuery({
    queryKey: ['admin-disruptions'],
    queryFn:  () => api.get('/admin/disruptions').then(r => r.data.data),
  });

  const { data: claimsData } = useQuery({
    queryKey: ['admin-claims-recent'],
    queryFn:  () => api.get('/admin/claims?limit=5').then(r => r.data.data),
  });

  const stats = data || {};
  const recentClaims = claimsData?.claims || [];
  const activeDisruptions = (disruptions || []).filter(d => d.isTriggered).slice(0, 4);

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Platform overview — updated every minute</p>
      </div>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Workers"
          value={isLoading ? null : stats.totalWorkers}
          icon={Users}
          iconColor="bg-primary-50 dark:bg-primary-900/20 text-primary-600"
          loading={isLoading}
        />
        <StatCard
          title="Active Policies"
          value={isLoading ? null : stats.activePolicies}
          icon={FileCheck}
          iconColor="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600"
          loading={isLoading}
        />
        <StatCard
          title="Pending Claims"
          value={isLoading ? null : stats.pendingClaims}
          icon={Clock}
          iconColor="bg-amber-50 dark:bg-amber-900/20 text-amber-600"
          loading={isLoading}
        />
        <StatCard
          title="Open Fraud Flags"
          value={isLoading ? null : stats.openFraudFlags}
          icon={AlertTriangle}
          iconColor="bg-rose-50 dark:bg-rose-900/20 text-rose-600"
          loading={isLoading}
        />
        <StatCard
          title="Monthly Payouts"
          value={isLoading ? null : formatCurrency(stats.monthlyPayouts || 0)}
          icon={TrendingUp}
          iconColor="bg-purple-50 dark:bg-purple-900/20 text-purple-600"
          loading={isLoading}
        />
        <StatCard
          title="Claims This Month"
          value={isLoading ? null : stats.monthlyClaimsCount}
          icon={CheckCircle}
          iconColor="bg-teal-50 dark:bg-teal-900/20 text-teal-600"
          loading={isLoading}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active disruptions */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 dark:text-white">Active Disruptions</h2>
            <Link to="/admin/disruptions" className="text-xs text-primary-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {activeDisruptions.length === 0 ? (
            <div className="py-8 text-center">
              <CloudRain className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No active disruptions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeDisruptions.map(d => (
                <AlertCard key={d._id} alert={d} />
              ))}
            </div>
          )}
        </div>

        {/* Recent claims */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 dark:text-white">Recent Claims</h2>
            <Link to="/admin/claims" className="text-xs text-primary-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentClaims.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-6">No claims yet.</p>
            )}
            {recentClaims.map((claim, i) => {
              const { bg, text } = getStatusColor(claim.status);
              return (
                <motion.div
                  key={claim._id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                      {claim.worker?.name || 'Worker'} — {claim.claimNumber}
                    </p>
                    <p className="text-xs text-slate-400">{formatDate(claim.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {formatCurrency(claim.compensationAmount)}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${bg} ${text}`}>
                      {claim.status}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
