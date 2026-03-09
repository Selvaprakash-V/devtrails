import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Moon, Sun, Menu, LogOut, User, Shield } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

const Navbar = ({ onMenuClick }) => {
  const { dark, toggle } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-30 flex items-center px-4 md:px-6 gap-4">
      {/* Mobile menu */}
      <button onClick={onMenuClick} className="lg:hidden text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
        <Menu className="w-5 h-5" />
      </button>

      {/* Page spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggle}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </motion.button>

        {/* Notifications placeholder */}
        <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
        </button>

        {/* User menu */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-none">{user?.name}</p>
            <p className="text-xs text-slate-400 mt-0.5 capitalize">{user?.role}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={logout}
            className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-1"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
