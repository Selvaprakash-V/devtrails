import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { motion } from 'framer-motion';

const chartDefaults = {
  cartesianGrid: { strokeDasharray: '3 3', stroke: '#e2e8f0', strokeOpacity: 0.6 },
  tooltip: {
    contentStyle: {
      backgroundColor: 'var(--tw-bg-opacity, #fff)',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      fontSize: '13px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    },
  },
};

// Earnings vs Compensation area chart
export const EarningsChart = ({ data = [], loading }) => {
  if (loading) return <div className="skeleton h-64 rounded-xl" />;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"   stopColor="#6366f1" stopOpacity={0.2} />
              <stop offset="95%"  stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"   stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%"  stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid {...chartDefaults.cartesianGrid} />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} />
          <Tooltip {...chartDefaults.tooltip} formatter={(v, n) => [`₹${v}`, n === 'income' ? 'Income' : 'Compensation']} />
          <Legend iconType="circle" iconSize={8} />
          <Area type="monotone" dataKey="income"       stroke="#6366f1" fill="url(#incomeGrad)" strokeWidth={2} name="income" />
          <Area type="monotone" dataKey="compensation" stroke="#10b981" fill="url(#compGrad)"  strokeWidth={2} name="compensation" />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// Claims bar chart
export const ClaimsBarChart = ({ data = [], loading }) => {
  if (loading) return <div className="skeleton h-56 rounded-xl" />;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }} barSize={28} barCategoryGap="30%">
          <CartesianGrid {...chartDefaults.cartesianGrid} vertical={false} />
          <XAxis dataKey="_id" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip {...chartDefaults.tooltip} formatter={(v, n) => [n === 'count' ? v : `₹${v}`, n === 'count' ? 'Claims' : 'Payout']} />
          <Legend iconType="circle" iconSize={8} />
          <Bar dataKey="count"       fill="#6366f1" radius={[6,6,0,0]} name="count" />
          <Bar dataKey="totalPayout" fill="#10b981" radius={[6,6,0,0]} name="totalPayout" />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// Daily payouts line chart
export const DailyPayoutsChart = ({ data = [], loading }) => {
  if (loading) return <div className="skeleton h-56 rounded-xl" />;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid {...chartDefaults.cartesianGrid} />
          <XAxis dataKey="_id" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} />
          <Tooltip {...chartDefaults.tooltip} formatter={(v) => [`₹${v}`, 'Payout']} />
          <Line type="monotone" dataKey="amount" stroke="#f97316" strokeWidth={2.5} dot={{ fill: '#f97316', r: 3 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default { EarningsChart, ClaimsBarChart, DailyPayoutsChart };
