
import React, { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Shield, BarChart } from 'lucide-react';

interface ThreatGaugeProps {
  threatLevel?: 'low' | 'medium' | 'high';
  vulnerabilitiesCount?: number;
  isScanning?: boolean;
}

const ThreatGauge: React.FC<ThreatGaugeProps> = ({ 
  threatLevel = 'low', 
  vulnerabilitiesCount = 0, 
  isScanning = false 
}) => {
  const [gaugeValue, setGaugeValue] = useState(0);
  
  useEffect(() => {
    // Convert threat level to value
    let targetValue = 0;
    switch (threatLevel) {
      case 'low':
        targetValue = 25;
        break;
      case 'medium':
        targetValue = 60;
        break;
      case 'high':
        targetValue = 85;
        break;
      default:
        targetValue = 0;
    }
    
    // Add randomness when scanning
    if (isScanning) {
      targetValue += Math.random() * 10 - 5;
      targetValue = Math.min(100, Math.max(0, targetValue));
    }
    
    // Animate to target value
    const step = (target, current) => {
      if (Math.abs(target - current) < 0.5) return target;
      return current + (target - current) * 0.1;
    };
    
    const animationInterval = setInterval(() => {
      setGaugeValue(current => {
        const next = step(targetValue, current);
        if (Math.abs(next - targetValue) < 0.5) {
          clearInterval(animationInterval);
        }
        return next;
      });
    }, 50);
    
    return () => clearInterval(animationInterval);
  }, [threatLevel, isScanning]);
  
  const getGaugeColor = () => {
    if (gaugeValue < 30) {
      return 'bg-gradient-to-r from-green-500 to-green-400';
    } else if (gaugeValue < 70) {
      return 'bg-gradient-to-r from-yellow-500 to-orange-400';
    } else {
      return 'bg-gradient-to-r from-red-500 to-rose-600';
    }
  };
  
  return (
    <div className="rounded-lg border border-border frost-panel p-4">
      <div className="flex items-center gap-2 mb-4">
        {gaugeValue < 30 ? (
          <Shield className="h-5 w-5 text-green-500" />
        ) : gaugeValue < 70 ? (
          <BarChart className="h-5 w-5 text-yellow-500" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-red-500" />
        )}
        <h3 className="font-medium">Threat Level</h3>
      </div>
      
      <div className="space-y-4">
        <div className="relative h-5 overflow-hidden rounded-full">
          <div className="absolute inset-0 flex">
            <div className="w-1/3 bg-green-500/20 h-full"></div>
            <div className="w-1/3 bg-yellow-500/20 h-full"></div>
            <div className="w-1/3 bg-red-500/20 h-full"></div>
          </div>
          
          <Progress 
            value={gaugeValue} 
            className={`h-full ${getGaugeColor()} transition-all duration-300 ease-out glow-success`} 
          />
          
          <div 
            className="absolute top-0 h-full w-1 bg-white shadow-[0_0_5px_rgba(255,255,255,0.7)]" 
            style={{ left: `${gaugeValue}%`, transition: 'left 0.3s ease-out' }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Secure</span>
          <span>Caution</span>
          <span>Critical</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-lg font-medium">
            {gaugeValue < 30 ? (
              <span className="text-green-500">Low Risk</span>
            ) : gaugeValue < 70 ? (
              <span className="text-yellow-500">Medium Risk</span>
            ) : (
              <span className="text-red-500">High Risk</span>
            )}
          </div>
          
          <div className="bg-background/40 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
            <span className="text-sm font-medium">Vulnerabilities:</span>
            <span className={`font-mono text-lg ${vulnerabilitiesCount > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {vulnerabilitiesCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatGauge;
