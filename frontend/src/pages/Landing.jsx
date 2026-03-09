import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Shield, CloudRain, Thermometer, Wind, Zap, TrendingUp,
  CheckCircle, ArrowRight, Star, Users, Award, BarChart2,
  ChevronRight, Moon, Sun, Lock, Smartphone, IndianRupee,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const STATS = [
  { label: 'Delivery Workers Protected', value: '50,000+', icon: Users },
  { label: 'Claims Paid Out',            value: '₹2.4Cr+',  icon: Award },
  { label: 'Cities Covered',             value: '7',         icon: BarChart2 },
  { label: 'Avg Response Time',          value: '< 2 min',   icon: Zap },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Register & Set Zone', desc: 'Quick 2-min onboarding with your delivery platform and location.',  icon: Users },
  { step: '02', title: 'Get AI Risk Score',   desc: 'Our AI analyses weather, historical data, and your zone to calculate personalised risk.', icon: BarChart2 },
  { step: '03', title: 'Activate Coverage',   desc: 'Pay ₹20–₹50/week premium and you\'re covered for income disruptions.', icon: Shield },
  { step: '04', title: 'Auto Compensation',   desc: 'When disruption thresholds are breached, compensation lands in your wallet — zero paperwork.', icon: Zap },
];

const DISRUPTIONS = [
  { icon: CloudRain, label: 'Heavy Rain',    threshold: '> 80 mm/hr', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { icon: Thermometer, label: 'Extreme Heat', threshold: '> 42 °C',    color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  { icon: Wind,       label: 'Poor Air Quality', threshold: 'AQI > 300', color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-800' },
  { icon: Shield,     label: 'Curfew / Lockdown', threshold: 'Official alert', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
];

export default function Landing() {
  const { dark, toggle } = useTheme();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, -60]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-white/20 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">DevTrails</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a href="#how" className="hover:text-primary-600 transition-colors">How it Works</a>
            <a href="#coverage" className="hover:text-primary-600 transition-colors">Coverage</a>
            <a href="#stats" className="hover:text-primary-600 transition-colors">Impact</a>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggle} className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link to="/login"    className="btn-secondary text-sm px-4 py-2">Sign In</Link>
            <Link to="/register" className="btn-primary  text-sm px-4 py-2">Get Protected</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-400/20 dark:bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-40 w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-300/10 dark:bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-400 text-sm font-medium mb-8"
          >
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Parametric Insurance · India First
          </motion.div>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible"
            className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6"
          >
            Protect Your Income
            <br />
            <span className="gradient-text">From Any Disruption</span>
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="visible"
            transition={{ delay: 0.15 }}
            className="text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            India's first AI-driven parametric income insurance for Swiggy & Zomato
            delivery workers. Heavy rain? Extreme heat? Get compensated automatically — no forms, no waiting.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" animate="visible"
            transition={{ delay: 0.25 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register" className="btn-primary px-8 py-3.5 text-base font-semibold">
              Get Protected Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="btn-secondary px-8 py-3.5 text-base font-semibold">
              View Demo
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-slate-400"
          >
            {[
              { icon: CheckCircle, text: 'No paperwork' },
              { icon: Zap,          text: 'Auto payouts' },
              { icon: Lock,         text: 'Secure & private' },
              { icon: Smartphone,   text: 'Works on mobile' },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-1.5 font-medium">
                <Icon className="w-3.5 h-3.5" />{text}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Floating cards */}
        <motion.div
          style={{ y: heroY }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 px-4 relative z-10"
        >
          {[
            { Icon: CloudRain,     iconBg: 'bg-blue-100 dark:bg-blue-900/20',    iconColor: 'text-blue-600',    label: 'Rain Alert',  status: 'Triggered',  color: 'text-blue-600' },
            { Icon: IndianRupee,  iconBg: 'bg-emerald-100 dark:bg-emerald-900/20', iconColor: 'text-emerald-600', label: '200 Paid',   status: 'Instant',    color: 'text-emerald-600' },
            { Icon: Shield,       iconBg: 'bg-primary-100 dark:bg-primary-900/20', iconColor: 'text-primary-600', label: 'Coverage',   status: 'Active',     color: 'text-primary-600' },
            { Icon: BarChart2,    iconBg: 'bg-purple-100 dark:bg-purple-900/20',  iconColor: 'text-purple-600', label: 'Risk Score',  status: 'Low — 28',   color: 'text-purple-600' },
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="glass-card p-4 text-center"
            >
              <div className={`inline-flex p-2 rounded-xl ${card.iconBg} mb-2`}>
                <card.Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{card.label}</p>
              <p className={`text-sm font-bold ${card.color}`}>{card.status}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-16 bg-white dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {STATS.map(({ label, value, icon: Icon }) => (
              <motion.div key={label} variants={fadeUp} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <p className="text-3xl font-black text-slate-900 dark:text-white mb-1">{value}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
              How Parametric Insurance Works
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Forget filing claims. When a weather threshold is crossed, you get paid — automatically.
            </p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon }) => (
              <motion.div key={step} variants={fadeUp} whileHover={{ y: -4 }} className="glass-card p-6 group">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl font-black gradient-text opacity-60">{step}</span>
                  <div className="p-2.5 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                    <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Coverage triggers */}
      <section id="coverage" className="py-20 px-4 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
              What We Cover
            </h2>
            <p className="text-slate-500 dark:text-slate-400">Automatic triggers for the most common delivery disruptions</p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {DISRUPTIONS.map(({ icon: Icon, label, threshold, color, bg }) => (
              <motion.div key={label} variants={fadeUp} whileHover={{ y: -2 }}
                className="glass-card p-5 flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${bg}`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{label}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Trigger: {threshold}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-emerald-500 ml-auto" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-purple-600 to-primary-800 p-12 text-center"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Start Protecting Your Income Today
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Join 50,000+ delivery workers who never worry about weather disruptions anymore.
                Setup takes 2 minutes.
              </p>
              <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-primary-700 font-bold text-base hover:bg-slate-50 transition-all shadow-xl hover:shadow-2xl active:scale-[0.98]">
                Get Your Free Risk Assessment
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">DevTrails</span>
          </div>
          <p className="text-sm text-slate-400">© 2026 DevTrails. AI-Powered Parametric Insurance for Gig Workers.</p>
          <div className="flex gap-4 text-sm text-slate-400">
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Privacy</a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
