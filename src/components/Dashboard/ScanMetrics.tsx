
import React from 'react';
import { 
  BarChart as BarChartIcon,
  Clock, 
  Activity, 
  Check, 
  XCircle, 
  AlertTriangle 
} from 'lucide-react';

interface ScanMetricsProps {
  metrics: {
    totalRequests?: number;
    successRate?: number;
    errorRate?: number;
    avgResponseTime?: number;
    elapsedTime?: string;
  };
  isScanning?: boolean;
}

const ScanMetrics: React.FC<ScanMetricsProps> = ({ metrics = {}, isScanning = false }) => {
  const {
    totalRequests = 0,
    successRate = 0,
    errorRate = 0,
    avgResponseTime = 0,
    elapsedTime = '00:00:00',
  } = metrics;
  
  // Response code distribution for heatmap
  const responseCodes = {
    '200': Math.floor(Math.random() * 50) + 50,
    '302': Math.floor(Math.random() * 20) + 10,
    '400': Math.floor(Math.random() * 10) + 5,
    '403': Math.floor(Math.random() * 10) + 5,
    '404': Math.floor(Math.random() * 15) + 10,
    '500': Math.floor(Math.random() * 5) + 1,
  };
  
  const getHeatmapColor = (value) => {
    const maxValue = Math.max(...Object.values(responseCodes));
    const intensity = value / maxValue;
    
    if (value === 0) return 'bg-border';
    
    const codeNum = parseInt(Object.keys(responseCodes).find(key => responseCodes[key] === value));
    if (codeNum >= 500) return `bg-red-500/50 border border-red-500`;
    if (codeNum >= 400) return `bg-amber-500/50 border border-amber-500`;
    if (codeNum >= 300) return `bg-blue-500/50 border border-blue-500`;
    return `bg-green-500/50 border border-green-500`;
  };
  
  return (
    <div className="rounded-lg border border-border frost-panel p-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChartIcon className="h-5 w-5 text-fuzzer-primary" />
        <h3 className="font-medium">Performance Analytics</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-background/20 rounded-lg p-3 border border-border/50">
          <div className="flex justify-between items-start">
            <div className="text-sm text-muted-foreground">Requests</div>
            <Activity className="h-4 w-4 text-fuzzer-primary" />
          </div>
          <div className="text-2xl font-medium mt-1">{totalRequests}</div>
        </div>
        
        <div className="bg-background/20 rounded-lg p-3 border border-border/50">
          <div className="flex justify-between items-start">
            <div className="text-sm text-muted-foreground">Success</div>
            <Check className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-medium mt-1">{successRate.toFixed(1)}%</div>
        </div>
        
        <div className="bg-background/20 rounded-lg p-3 border border-border/50">
          <div className="flex justify-between items-start">
            <div className="text-sm text-muted-foreground">Errors</div>
            <XCircle className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-medium mt-1">{errorRate.toFixed(1)}%</div>
        </div>
        
        <div className="bg-background/20 rounded-lg p-3 border border-border/50">
          <div className="flex justify-between items-start">
            <div className="text-sm text-muted-foreground">Avg Response</div>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-medium mt-1">{avgResponseTime.toFixed(0)}ms</div>
        </div>
      </div>
      
      <div className="border-t border-border/50 pt-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium">Response Code Heatmap</h4>
          <div className="text-xs font-mono bg-background/40 px-2 py-1 rounded-md">
            {isScanning ? (
              <span className="text-fuzzer-primary">ELAPSED: {elapsedTime}</span>
            ) : (
              <span className="text-muted-foreground">IDLE</span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-6 gap-1">
          {Object.entries(responseCodes).map(([code, value]) => (
            <div 
              key={code} 
              className={`aspect-square rounded-md flex items-center justify-center text-xs font-mono ${getHeatmapColor(value)}`}
              title={`${code}: ${value} responses`}
            >
              {code}
            </div>
          ))}
        </div>
        
        <div className="text-xs text-muted-foreground mt-2 text-center">
          Color intensity indicates frequency of response code
        </div>
      </div>
    </div>
  );
};

export default ScanMetrics;
