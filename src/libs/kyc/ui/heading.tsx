import React from 'react';
import { cn } from '~/logic/shared/cn';

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: 'default' | 'gradient' | 'section';
  icon?: string;
  children: React.ReactNode;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({
  level = 2,
  variant = 'default',
  icon,
  children,
  className
}) => {
  const baseClasses = "font-black text-white flex items-center gap-3";
  
  const sizeClasses = {
    1: "text-5xl",
    2: "text-2xl",
    3: "text-xl",
    4: "text-lg",
    5: "text-base",
    6: "text-sm"
  };

  const variantClasses = {
    default: "",
    gradient: "bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent",
    section: "mb-6"
  };

  const baseProps = {
    className: cn(
      baseClasses,
      sizeClasses[level],
      variantClasses[variant],
      className
    )
  };

  const content = (
    <>
      {icon && <span>{icon}</span>}
      {variant === 'gradient' ? (
        <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
          {children}
        </span>
      ) : (
        children
      )}
    </>
  );

  switch (level) {
    case 1: return <h1 {...baseProps}>{content}</h1>;
    case 2: return <h2 {...baseProps}>{content}</h2>;
    case 3: return <h3 {...baseProps}>{content}</h3>;
    case 4: return <h4 {...baseProps}>{content}</h4>;
    case 5: return <h5 {...baseProps}>{content}</h5>;
    case 6: return <h6 {...baseProps}>{content}</h6>;
    default: return <h2 {...baseProps}>{content}</h2>;
  }
}; 