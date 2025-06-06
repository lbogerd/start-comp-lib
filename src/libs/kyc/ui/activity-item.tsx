import React from 'react';
import { cn } from '~/logic/shared/cn';

export interface Activity {
  text: string;
  color: string;
}

interface ActivityItemProps {
  activity: Activity;
  className?: string;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ 
  activity, 
  className 
}) => {
  return (
    <div className={cn(
      "bg-slate-800/50 backdrop-blur border-l-4 rounded-r-xl p-4 text-slate-200 font-medium hover:bg-slate-700/50 transition-all",
      activity.color,
      className
    )}>
      {activity.text}
    </div>
  );
}; 