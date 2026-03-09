import { motion } from 'framer-motion';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default:   'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    primary:   'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400',
    success:   'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
    warning:   'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
    danger:    'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    info:      'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
