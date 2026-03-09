import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Shield, FileText, Zap,          // worker
  BarChart2, AlertTriangle, Users, Activity,        // admin
  X, User, Settings,
} from 'lucide-react';

const workerLinks = [
  { to: '/dashboard',          icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/policy',   icon: Shield,          label: 'My Policy' },
  { to: '/dashboard/claims',   icon: FileText,        label: 'Claims' },
  { to: '/dashboard/triggers', icon: Zap,             label: 'Claim Triggers' },
];

const adminLinks = [
  { to: '/admin',              icon: LayoutDashboard, label: 'Overview' },
  { to: '/admin/analytics',    icon: BarChart2,       label: 'Analytics' },
  { to: '/admin/fraud',        icon: AlertTriangle,   label: 'Fraud Alerts' },
  { to: '/admin/workers',      icon: Users,           label: 'Workers' },
];

const Sidebar = ({ role = 'worker', open, onClose }) => {
  const { pathname } = useLocation();
  const links = role === 'admin' ? adminLinks : workerLinks;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : '-100%' }}
        className={`
          fixed top-0 left-0 h-full w-64 z-50 lg:relative lg:translate-x-0 lg:z-auto
          flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
          transition-transform lg:!transform-none
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white tracking-tight">DevTrails</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            role === 'admin'
              ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
              : 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
          }`}>
            <span className="flex items-center gap-1.5">
              {role === 'admin'
                ? <><Settings className="w-3 h-3" />Admin Panel</>
                : <><User className="w-3 h-3" />Worker Portal</>}
            </span>
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {links.map(({ to, icon: Icon, label }) => {
            const active = pathname === to || (to !== '/' && pathname.startsWith(to) && to.split('/').length >= pathname.split('/').length);
            return (
              <Link key={to} to={to} onClick={onClose}
                className={`sidebar-link ${active ? 'active' : ''}`}>
                <Icon className="w-4 h-4 shrink-0" />
                {label}
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom branding */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-400">© 2026 DevTrails</p>
          <p className="text-xs text-slate-400">v1.0 · AI-Powered Insurance</p>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
