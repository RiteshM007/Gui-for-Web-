
import React from 'react';
import { cn } from "@/lib/utils";

interface TechnicalLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

const TechnicalLoader = ({ 
  size = 'md', 
  variant = 'primary',
  className,
  ...props 
}: TechnicalLoaderProps) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };
  
  const variantClasses = {
    primary: 'border-t-fuzzer-primary',
    secondary: 'border-t-muted-foreground',
    success: 'border-t-green-500',
    warning: 'border-t-amber-500',
    error: 'border-t-red-500',
  };
  
  return (
    <div className={cn("flex flex-col items-center justify-center", className)} {...props}>
      <div className={cn(
        "border-4 border-secondary rounded-full animate-spin-slow relative",
        sizeClasses[size],
        variantClasses[variant]
      )}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={cn(
            "h-2 w-2 rounded-full bg-fuzzer-primary animate-pulse",
            variant === 'success' && "bg-green-500",
            variant === 'warning' && "bg-amber-500",
            variant === 'error' && "bg-red-500"
          )}></div>
        </div>
      </div>
      <div className="mt-2 flex space-x-1">
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className={cn(
              "h-1 w-1 rounded-full animate-pulse bg-fuzzer-primary",
              variant === 'success' && "bg-green-500",
              variant === 'warning' && "bg-amber-500",
              variant === 'error' && "bg-red-500",
              `animation-delay-${i * 100}`
            )}
            style={{ animationDelay: `${i * 100}ms` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export { TechnicalLoader };
