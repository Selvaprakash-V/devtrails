import { motion } from 'framer-motion';

const Skeleton = ({ className = '', lines = 1 }) => {
  return Array.from({ length: lines }).map((_, i) => (
    <div
      key={i}
      className={`skeleton rounded-lg h-4 ${className}`}
      style={{ width: i === lines - 1 && lines > 1 ? '60%' : '100%' }}
    />
  ));
};

export const StatCardSkeleton = () => (
  <div className="glass-card p-5 space-y-3">
    <div className="flex justify-between">
      <Skeleton className="w-24 h-4" />
      <Skeleton className="w-8 h-8 rounded-full" />
    </div>
    <Skeleton className="w-32 h-8" />
    <Skeleton className="w-20 h-3" />
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4">
        {Array.from({ length: cols }).map((_, j) => (
          <Skeleton key={j} className={`h-5 ${j === 0 ? 'w-32' : 'flex-1'}`} />
        ))}
      </div>
    ))}
  </div>
);

export default Skeleton;
