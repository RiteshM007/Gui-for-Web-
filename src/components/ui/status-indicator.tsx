
import React from 'react';
import { cn } from "@/lib/utils";
import { 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  Info, 
  XCircle
} from 'lucide-react';

interface StatusIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  status: 'online' | 'offline' | 'warning' | 'error' | 'unknown';
  label?: string;
  showIcon?: boolean;
  pulse?: boolean;
}

const StatusIndicator = ({ 
  status, 
  label,
  showIcon = true,
  pulse = true,
  className,
  ...props 
}: StatusIndicatorProps) => {
  const statusConfig = {
    online: {
      color: "bg-green-500",
      icon: CheckCircle,
      text: "Online"
    },
    offline: {
      color: "bg-slate-500",
      icon: XCircle,
      text: "Offline"
    },
    warning: {
      color: "bg-amber-500",
      icon: AlertTriangle,
      text: "Warning"
    },
    error: {
      color: "bg-red-500",
      icon: XCircle,
      text: "Error"
    },
    unknown: {
      color: "bg-blue-500",
      icon: HelpCircle,
      text: "Unknown"
    }
  };
  
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <div 
      className={cn(
        "flex items-center gap-2",
        className
      )} 
      {...props}
    >
      <div className="flex items-center gap-1.5">
        <div className={cn(
          "h-2.5 w-2.5 rounded-full",
          config.color,
          pulse && "relative"
        )}>
          {pulse && (
            <div className={cn(
              "absolute inset-0 rounded-full animate-ping",
              config.color,
              "opacity-75"
            )} />
          )}
        </div>
        {showIcon && <Icon className="h-4 w-4" />}
        <span className="text-xs font-medium">
          {label || config.text}
        </span>
      </div>
    </div>
  );
};

export { StatusIndicator };
