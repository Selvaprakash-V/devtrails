import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AlertTriangle, Filter, Eye } from 'lucide-react';
import api from '@/services/api';
import { formatDate } from '@/utils/helpers';
import toast from 'react-hot-toast';

const STATUS_TABS = ['all', 'open', 'investigating', 'resolved'];

const SEVERITY_STYLES = {
  low:      'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  medium:   'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  high:     'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
};

const FLAG_LABELS = {
  gps_mismatch:      'GPS Mismatch',
  duplicate_claim:   'Duplicate Claim',
  excessive_claims:  'Excessive Claims',
  pending_kyc:       'Pending KYC',
};

export default function AdminFraudAlerts() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState('all');

  const { data: flags, isLoading } = useQuery({
    queryKey: ['fraud-flags', activeTab],
    queryFn:  () => api.get(`/admin/fraud-flags?status=${activeTab === 'all' ? '' : activeTab}`).then(r => r.data.data),
  });

  const reviewMutation = useMutation({
    mutationFn: ({ claimId, action }) =>
      api.put(`/admin/claims/${claimId}/review`, { action }),
    onSuccess: () => {
      toast.success('Claim reviewed.');
      qc.invalidateQueries({ queryKey: ['fraud-flags'] });
    },
    onError: err => toast.error(err.response?.data?.message || 'Review failed'),
  });

  const rows = flags || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Fraud Alerts</h1>
        <p className="text-sm text-slate-500 mt-0.5">AI-flagged suspicious claims requiring review</p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-slate-400" />
        {STATUS_TABS.map(s => (
          <button
            key={s}
            onClick={() => setActiveTab(s)}
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
              activeTab === s
                ? 'bg-rose-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="p-5 space-y-2">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}
          </div>
        ) : rows.length === 0 ? (
          <div className="py-14 text-center">
            <AlertTriangle className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No fraud flags found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-xs text-slate-400 uppercase tracking-wider">
                  {['Worker', 'Claim', 'Flag Type', 'Severity', 'Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rows.map((flag, i) => (
                  <motion.tr
                    key={flag._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{flag.worker?.name || '—'}</p>
                      <p className="text-xs text-slate-400">{flag.worker?.email || ''}</p>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{flag.claim?.claimNumber || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
                        {FLAG_LABELS[flag.flagType] || flag.flagType}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${SEVERITY_STYLES[flag.severity] || ''}`}>
                        {flag.severity}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-400">{formatDate(flag.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold capitalize bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {flag.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {flag.status === 'open' && flag.claim?._id && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => reviewMutation.mutate({ claimId: flag.claim._id, action: 'approve' })}
                            disabled={reviewMutation.isPending}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => reviewMutation.mutate({ claimId: flag.claim._id, action: 'reject' })}
                            disabled={reviewMutation.isPending}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
