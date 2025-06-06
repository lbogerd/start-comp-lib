import React from 'react';
import { cn } from '~/logic/shared/cn';

type BadgeVariant = 'verified' | 'online' | 'away' | 'offline' | 'legendary' | 'epic' | 'rare' | 'common';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  variant = 'verified', 
  children, 
  className 
}) => {
  const baseClasses = "px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1";
  
  const variantClasses = {
    verified: "bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-blue-400/30",
    online: "bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-green-400/30",
    away: "bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-yellow-400/30",
    offline: "bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-gray-400/30",
    legendary: "bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 text-white shadow-yellow-400/30",
    epic: "bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-white shadow-purple-400/30",
    rare: "bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 text-white shadow-blue-400/30",
    common: "bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-gray-400/30"
  };

  return (
    <span className={cn(baseClasses, variantClasses[variant], className)}>
      {children}
    </span>
  );
};

interface StatusDotProps {
  status: 'online' | 'away' | 'offline';
  className?: string;
}

export const StatusDot: React.FC<StatusDotProps> = ({ status, className }) => {
  const statusClasses = {
    online: "bg-green-400 shadow-green-400/50",
    away: "bg-yellow-400 shadow-yellow-400/50",
    offline: "bg-gray-400 shadow-gray-400/50"
  };

  return (
    <div className={cn("w-8 h-8 rounded-full border-4 border-slate-800 shadow-lg", statusClasses[status], className)} />
  );
}; 