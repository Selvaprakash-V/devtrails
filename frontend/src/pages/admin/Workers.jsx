import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, Search } from 'lucide-react';
import api from '@/services/api';
import { formatCurrency, getRiskColor } from '@/utils/helpers';

export default function AdminWorkers() {
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-workers'],
    queryFn:  () => api.get('/admin/workers').then(r => r.data.data),
  });

  const workers = (data || []).filter(w => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      w.name?.toLowerCase().includes(q) ||
      w.email?.toLowerCase().includes(q) ||
      w.workerProfile?.city?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Workers</h1>
          <p className="text-sm text-slate-500 mt-0.5">{data?.length || 0} registered workers</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="input-field pl-9 w-64"
            placeholder="Search workers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="p-5 space-y-2">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}
          </div>
        ) : workers.length === 0 ? (
          <div className="py-14 text-center">
            <Users className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm text-slate-400">{search ? 'No workers match your search.' : 'No workers yet.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-xs text-slate-400 uppercase tracking-wider">
                  {['Worker', 'City', 'Platform', 'Risk Level', 'Policy', 'Total Claims', 'Weekly Premium'].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {workers.map((w, i) => {
                  const profile = w.workerProfile || {};
                  const riskLevel = profile.riskLevel || 'low';
                  const { bg, text } = getRiskColor(riskLevel);
                  const policyActive = w.policy?.status === 'active';

                  return (
                    <motion.tr
                      key={w._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {w.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 dark:text-slate-200">{w.name}</p>
                            <p className="text-xs text-slate-400">{w.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">{profile.city || '—'}</td>
                      <td className="px-5 py-3.5 capitalize text-slate-600 dark:text-slate-400">{profile.deliveryPlatform || '—'}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${bg} ${text}`}>
                          {riskLevel}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          policyActive
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                        }`}>
                          {w.policy?.status || 'None'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center text-slate-700 dark:text-slate-300 font-medium">
                        {w.claimsCount ?? 0}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                        {profile.weeklyPremium ? formatCurrency(profile.weeklyPremium) : '—'}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
