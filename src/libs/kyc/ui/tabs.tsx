import React from 'react';
import { cn } from '~/logic/shared/cn';

interface Tab {
  key: string;
  label: string;
  icon?: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabKey: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  className 
}) => {
  return (
    <div className={cn("flex space-x-2 bg-slate-800/50 rounded-2xl p-2", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={cn(
            "flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all",
            activeTab === tab.key
              ? "bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-lg shadow-orange-400/30"
              : "text-slate-400 hover:text-white hover:bg-slate-700"
          )}
        >
          {tab.icon && `${tab.icon} `}{tab.label}
        </button>
      ))}
    </div>
  );
};

interface TabContentProps {
  value: string;
  activeTab: string;
  children: React.ReactNode;
}

export const TabContent: React.FC<TabContentProps> = ({ 
  value, 
  activeTab, 
  children 
}) => {
  if (value !== activeTab) return null;
  return <div>{children}</div>;
}; 