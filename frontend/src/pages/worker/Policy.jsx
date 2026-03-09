import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, CheckCircle, XCircle, AlertCircle, CloudRain,
  Thermometer, Wind, Waves, Lock, Zap,
} from 'lucide-react';
import api from '@/services/api';
import { formatCurrency, formatDate } from '@/utils/helpers';
import toast from 'react-hot-toast';

const CoverageItem = ({ icon: Icon, label, maxPayout, enabled, color }) => (
  <div className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
    enabled
      ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'
      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60'
  }`}>
    <div className={`p-2 rounded-lg ${enabled ? 'bg-emerald-100 dark:bg-emerald-900/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
      <Icon className={`w-4 h-4 ${enabled ? color : 'text-slate-400'}`} />
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</p>
      <p className="text-xs text-slate-500">Max {formatCurrency(maxPayout)}</p>
    </div>
    {enabled
      ? <CheckCircle className="w-4 h-4 text-emerald-500" />
      : <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
    }
  </div>
);

export default function WorkerPolicy() {
  const qc = useQueryClient();
  const [activating, setActivating] = useState(false);

  const { data: policyData, isLoading } = useQuery({
    queryKey: ['my-policy'],
    queryFn:  () => api.get('/policy').then(r => r.data.data),
  });

  const { data: riskData } = useQuery({
    queryKey: ['risk-score'],
    queryFn:  () => api.get('/worker/risk-score').then(r => r.data.data),
  });

  const activateMutation = useMutation({
    mutationFn: () => api.post('/policy/activate', { paymentMethod: 'upi' }),
    onSuccess: () => {
      toast.success('Policy activated! You are now covered.');
      qc.invalidateQueries({ queryKey: ['my-policy'] });
      qc.invalidateQueries({ queryKey: ['worker-dashboard'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Activation failed'),
  });

  const cancelMutation = useMutation({
    mutationFn: () => api.put(`/policy/${policyData?._id}/cancel`),
    onSuccess: () => {
      toast.success('Policy cancelled.');
      qc.invalidateQueries({ queryKey: ['my-policy'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Cancel failed'),
  });

  const policy = policyData;
  const risk   = riskData;
  const isActive = policy?.status === 'active';

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Insurance Policy</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your parametric income protection</p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Policy status card */}
          <div className="glass-card p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white text-lg">Policy Status</h2>
                {policy?.policyNumber && (
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{policy.policyNumber}</p>
                )}
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${isActive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-300'}`} />
                {policy?.status || 'Inactive'}
              </div>
            </div>

            {isActive ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { l: 'Weekly Premium', v: formatCurrency(policy.weeklyPremium) },
                    { l: 'Max Cover', v: formatCurrency(policy.maxCompensation) },
                    { l: 'Start Date', v: formatDate(policy.startDate) },
                    { l: 'Renews', v: formatDate(policy.renewalDate) },
                  ].map(({ l, v }) => (
                    <div key={l} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <p className="text-xs text-slate-400">{l}</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mt-0.5">{v}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Cancel your active policy?')) cancelMutation.mutate();
                  }}
                  disabled={cancelMutation.isPending}
                  className="w-full py-2.5 rounded-xl text-sm font-medium text-red-500 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors disabled:opacity-60"
                >
                  {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Policy'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                      You have no active coverage. Disruptions won't trigger payouts until you activate a policy.
                    </p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => activateMutation.mutate()}
                  disabled={activateMutation.isPending}
                  className="btn-primary w-full py-3 disabled:opacity-60"
                >
                  {activateMutation.isPending ? (
                    <span className="flex items-center gap-2 justify-center">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Activating...
                    </span>
                  ) : (
                    <><Shield className="w-4 h-4" /> Activate Coverage — {formatCurrency(risk?.weeklyPremium || 20)}/week</>
                  )}
                </motion.button>
              </div>
            )}
          </div>

          {/* Premium breakdown */}
          <div className="glass-card p-6">
            <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-4">Premium Breakdown</h2>
            {risk?.premiumBreakdown ? (
              <div className="space-y-3">
                {[
                  { l: 'Base Premium',  v: risk.premiumBreakdown.base,        icon: Shield,      color: 'text-primary-500' },
                  { l: 'Rain Risk',     v: risk.premiumBreakdown.rainRisk,     icon: CloudRain,   color: 'text-blue-500' },
                  { l: 'Heat Risk',     v: risk.premiumBreakdown.heatRisk,     icon: Thermometer, color: 'text-orange-500' },
                  { l: 'AQI Risk',      v: risk.premiumBreakdown.aqiRisk,      icon: Wind,        color: 'text-slate-500' },
                  { l: 'Platform Fee',  v: risk.premiumBreakdown.platformFee,  icon: Zap,         color: 'text-purple-500' },
                ].map(({ l, v, icon: Icon, color }) => (
                  <div key={l} className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${color} shrink-0`} />
                    <span className="text-sm text-slate-600 dark:text-slate-400 flex-1">{l}</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(v)}</span>
                  </div>
                ))}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">Weekly Total</span>
                  <span className="text-xl font-black text-primary-600 dark:text-primary-400">
                    {formatCurrency(risk.premiumBreakdown.total)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-8 rounded-lg" />)}
              </div>
            )}
          </div>

          {/* Coverage details */}
          {isActive && policy?.coverageConfig && (
            <div className="glass-card p-6 md:col-span-2">
              <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-4">Coverage Details</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <CoverageItem icon={CloudRain}   label="Heavy Rain"    maxPayout={policy.coverageConfig.rain?.maxPayout}   enabled={policy.coverageConfig.rain?.enabled}   color="text-blue-500" />
                <CoverageItem icon={Thermometer} label="Extreme Heat"  maxPayout={policy.coverageConfig.heat?.maxPayout}   enabled={policy.coverageConfig.heat?.enabled}   color="text-orange-500" />
                <CoverageItem icon={Wind}        label="Air Quality"   maxPayout={policy.coverageConfig.aqi?.maxPayout}    enabled={policy.coverageConfig.aqi?.enabled}    color="text-slate-500" />
                <CoverageItem icon={Waves}       label="Flood Alert"   maxPayout={policy.coverageConfig.flood?.maxPayout}  enabled={policy.coverageConfig.flood?.enabled}  color="text-cyan-500" />
                <CoverageItem icon={Lock}        label="Curfew/Lockdown" maxPayout={policy.coverageConfig.curfew?.maxPayout} enabled={policy.coverageConfig.curfew?.enabled} color="text-red-500" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
