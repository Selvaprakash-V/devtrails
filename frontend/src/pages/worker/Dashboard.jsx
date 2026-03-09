import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, TrendingUp, IndianRupee, AlertTriangle,
  CheckCircle, RefreshCw, Zap, CloudRain, Thermometer, Wind,
} from 'lucide-react';
import api from '@/services/api';
import StatCard from '@/components/StatCard';
import RiskMeter from '@/components/RiskMeter';
import AlertCard from '@/components/AlertCard';
import { EarningsChart } from '@/components/charts/Charts';
import { formatCurrency, formatDate, getStatusColor } from '@/utils/helpers';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

const MOCK_ALERTS = [
  { type: 'rain',  city: 'Mumbai',    severity: 'high',   measuredValue: 92, unit: 'mm/hr', detectedAt: new Date() },
  { type: 'aqi',   city: 'Delhi',     severity: 'extreme',measuredValue: 340, unit: 'AQI',  detectedAt: new Date() },
];

export default function WorkerDashboard() {
  const { user } = useAuth();

  const { data: dashData, isLoading } = useQuery({
    queryKey: ['worker-dashboard'],
    queryFn:  () => api.get('/worker/dashboard').then(r => r.data.data),
    refetchInterval: 60_000,
  });

  const { data: riskData, refetch: refetchRisk, isFetching: riskLoading } = useQuery({
    queryKey:  ['risk-score'],
    queryFn:   () => api.get('/worker/risk-score').then(r => r.data.data),
    staleTime: 5 * 60_000,
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['earnings-chart'],
    queryFn:  () => api.get('/worker/earnings-chart').then(r => r.data.data),
  });

  const { data: disruptions } = useQuery({
    queryKey: ['my-disruptions'],
    queryFn:  () => api.get('/disruptions?active=true').then(r => r.data.data).catch(() => MOCK_ALERTS),
    initialData: MOCK_ALERTS,
  });

  const profile = dashData?.profile;
  const policy  = dashData?.policy;
  const monthly = dashData?.monthlyStats;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Good morning, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {formatDate(new Date(), { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        {!policy && (
          <Link to="/dashboard/policy" className="btn-primary text-sm">
            <Shield className="w-4 h-4" />
            Activate Coverage
          </Link>
        )}
      </div>

      {/* Policy banner */}
      {policy ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-purple-700 p-5 text-white"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center justify-between flex-wrap gap-4 relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-bold">Coverage Active</span>
                  <span className="flex items-center gap-1 text-xs bg-white/20 rounded-full px-2 py-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    {policy.status}
                  </span>
                </div>
                <p className="text-white/70 text-xs">{policy.policyNumber} · Renews {formatDate(policy.renewalDate)}</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-right">
                <p className="text-white/60 text-xs">Weekly Premium</p>
                <p className="font-bold">{formatCurrency(policy.weeklyPremium)}</p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-xs">Max Cover</p>
                <p className="font-bold">{formatCurrency(policy.maxCompensation)}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-2xl border-2 border-dashed border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10 p-5 flex items-center gap-4"
        >
          <AlertTriangle className="w-8 h-8 text-amber-500 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-amber-800 dark:text-amber-300">No active insurance policy</p>
            <p className="text-sm text-amber-600 dark:text-amber-400">You're unprotected. Activate coverage for as low as ₹20/week.</p>
          </div>
          <Link to="/dashboard/policy" className="btn-primary text-sm shrink-0">Activate Now</Link>
        </motion.div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Protected"
          value={formatCurrency(profile?.totalEarningsProtected)}
          icon={IndianRupee}
          trend={12}
          loading={isLoading}
          gradient="bg-emerald-50 dark:bg-emerald-900/20"
        />
        <StatCard
          title="Claims Received"
          value={profile?.totalClaimsReceived || 0}
          icon={CheckCircle}
          loading={isLoading}
          gradient="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatCard
          title="This Month"
          value={formatCurrency(monthly?.totalPaid)}
          icon={TrendingUp}
          subtitle={`${monthly?.count || 0} claims paid`}
          loading={isLoading}
          gradient="bg-primary-50 dark:bg-primary-900/20"
        />
        <StatCard
          title="Weekly Premium"
          value={formatCurrency(profile?.weeklyPremium || 20)}
          icon={Shield}
          loading={isLoading}
          gradient="bg-purple-50 dark:bg-purple-900/20"
        />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Risk score */}
        <div className="glass-card p-6 flex flex-col items-center gap-4">
          <div className="flex items-center justify-between w-full">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Risk Score</h3>
            <button onClick={() => refetchRisk()} disabled={riskLoading}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50">
              <RefreshCw className={`w-3.5 h-3.5 ${riskLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <RiskMeter
            score={riskData?.score || profile?.riskScore || 0}
            level={riskData?.level || profile?.riskLevel || 'low'}
            size="lg"
          />
          <div className="w-full space-y-2">
            {['Rain Risk', 'Heat Risk', 'AQI Risk'].map((label, i) => {
              const vals = [
                (riskData?.factors?.rainFactor || 0) * 100,
                (riskData?.factors?.heatFactor || 0) * 100,
                (riskData?.factors?.aqiFactor  || 0) * 100,
              ];
              const colors = ['bg-blue-500', 'bg-orange-500', 'bg-slate-400'];
              return (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-medium">{Math.round(vals[i])}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${colors[i]} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${vals[i]}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.15 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active alerts */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Active Alerts</h3>
            <span className="text-xs text-slate-400">Your zone</span>
          </div>
          <div className="space-y-3">
            <AnimatePresence>
              {disruptions?.length > 0 ? disruptions.slice(0, 3).map((d, i) => (
                <AlertCard key={i} disruption={d} />
              )) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">No active disruptions</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Recent claims */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Recent Claims</h3>
            <Link to="/dashboard/claims" className="text-xs text-primary-600 dark:text-primary-400 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {isLoading ? (
              [...Array(3)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)
            ) : dashData?.recentClaims?.length > 0 ? (
              dashData.recentClaims.slice(0, 4).map(claim => (
                <div key={claim._id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  {(() => { const M = { rain: CloudRain, heat: Thermometer, aqi: Wind }; const DI = M[claim.type] || Wind; return <div className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0"><DI className="w-4 h-4 text-slate-600 dark:text-slate-300" /></div>; })()}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate capitalize">{claim.type} Disruption</p>
                    <p className="text-xs text-slate-400">{formatDate(claim.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-600">{formatCurrency(claim.amount)}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${getStatusColor(claim.status)}`}>{claim.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-6">No claims yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Earnings chart */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Income vs Compensation</h3>
            <p className="text-xs text-slate-400 mt-0.5">Last 8 weeks</p>
          </div>
          <Zap className="w-4 h-4 text-primary-400" />
        </div>
        <EarningsChart data={chartData || []} loading={chartLoading} />
      </div>
    </div>
  );
}
