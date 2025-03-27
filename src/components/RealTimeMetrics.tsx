
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Timer, AlertTriangle, Activity, Clock } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { format } from 'date-fns';

interface MetricsProps {
  metrics: {
    totalRequests: number;
    successRate: number;
    errorRate: number;
    avgResponseTime: number;
    elapsedTime: string;
  };
  isScanning: boolean;
  responseCodes: Record<string, number>;
}

const RealTimeMetrics: React.FC<MetricsProps> = ({ 
  metrics, 
  isScanning,
  responseCodes
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Calculate total response codes
  const totalCodes = Object.values(responseCodes).reduce((a, b) => a + b, 0) || 1;
  
  // Create percentage values for response codes
  const codePercentages = {
    '200': ((responseCodes['200'] || 0) / totalCodes) * 100,
    '404': ((responseCodes['404'] || 0) / totalCodes) * 100,
    '500': ((responseCodes['500'] || 0) / totalCodes) * 100,
    '403': ((responseCodes['403'] || 0) / totalCodes) * 100,
    'other': ((responseCodes['other'] || 0) / totalCodes) * 100
  };
  
  return (
    <Card className="neo-blur frost-panel bg-card/30 border-border hover-scale">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Activity className="h-5 w-5 text-fuzzer-primary animate-pulse-slow" />
          Live Metrics
          <div className="ml-auto text-sm font-mono text-muted-foreground flex items-center">
            <Clock className="h-4 w-4 mr-1 text-fuzzer-primary" />
            {format(currentTime, 'yyyy-MM-dd HH:mm:ss')}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Success Rate */}
          <div className="bg-secondary/40 rounded-lg p-3 shine-effect transition-all duration-300 hover:bg-secondary/50">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-muted-foreground">Success Rate</p>
                <h3 className="text-xl font-bold">{metrics.successRate.toFixed(1)}%</h3>
              </div>
              <div className={`p-1.5 rounded-full ${metrics.successRate > 80 ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
                <ArrowUpRight className={`h-4 w-4 ${metrics.successRate > 80 ? 'text-green-500' : 'text-yellow-500'}`} />
              </div>
            </div>
          </div>
          
          {/* Error Rate */}
          <div className="bg-secondary/40 rounded-lg p-3 shine-effect transition-all duration-300 hover:bg-secondary/50">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-muted-foreground">Error Rate</p>
                <h3 className="text-xl font-bold">{metrics.errorRate.toFixed(1)}%</h3>
              </div>
              <div className={`p-1.5 rounded-full ${metrics.errorRate < 20 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                <ArrowDownRight className={`h-4 w-4 ${metrics.errorRate < 20 ? 'text-green-500' : 'text-red-500'}`} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Response Time */}
        <div className="bg-secondary/40 rounded-lg p-3 transition-all duration-300 hover:bg-secondary/50">
          <div className="flex justify-between items-center mb-1">
            <p className="text-xs text-muted-foreground">Avg. Response Time</p>
            <div className="flex items-center gap-1">
              <Timer className="h-3.5 w-3.5 text-fuzzer-primary animate-pulse-slow" />
              <span className="text-sm font-mono">{metrics.avgResponseTime.toFixed(0)} ms</span>
            </div>
          </div>
          <Progress 
            value={Math.min(metrics.avgResponseTime / 10, 100)} 
            className="h-1.5 overflow-hidden" 
          >
            <div className="h-full w-full progress-gradient"></div>
          </Progress>
        </div>
        
        {/* Response Codes Distribution */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">Response Codes Distribution</p>
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5 text-fuzzer-primary" />
              <span className="text-xs font-mono">{totalCodes} responses</span>
            </div>
          </div>
          
          <div className="flex rounded-md overflow-hidden h-2 shadow-inner">
            <div 
              className="bg-green-500 transition-all duration-1000 ease-out"
              style={{width: `${codePercentages['200']}%`}}
              title="200 OK"
            />
            <div 
              className="bg-yellow-500 transition-all duration-1000 ease-out"
              style={{width: `${codePercentages['404']}%`}}
              title="404 Not Found"
            />
            <div 
              className="bg-red-500 transition-all duration-1000 ease-out"
              style={{width: `${codePercentages['500']}%`}}
              title="500 Server Error"
            />
            <div 
              className="bg-orange-500 transition-all duration-1000 ease-out"
              style={{width: `${codePercentages['403']}%`}}
              title="403 Forbidden"
            />
            <div 
              className="bg-blue-500 transition-all duration-1000 ease-out"
              style={{width: `${codePercentages['other']}%`}}
              title="Other Codes"
            />
          </div>
          
          <div className="flex flex-wrap gap-x-4 text-xs">
            <div className="flex items-center gap-1 transition-all duration-200 hover:text-green-400">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>200: {responseCodes['200'] || 0}</span>
            </div>
            <div className="flex items-center gap-1 transition-all duration-200 hover:text-yellow-400">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span>404: {responseCodes['404'] || 0}</span>
            </div>
            <div className="flex items-center gap-1 transition-all duration-200 hover:text-red-400">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span>500: {responseCodes['500'] || 0}</span>
            </div>
            <div className="flex items-center gap-1 transition-all duration-200 hover:text-orange-400">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span>403: {responseCodes['403'] || 0}</span>
            </div>
            <div className="flex items-center gap-1 transition-all duration-200 hover:text-blue-400">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Other: {responseCodes['other'] || 0}</span>
            </div>
          </div>
        </div>
        
        {isScanning ? (
          <div className="pulse-animation text-center py-2 text-xs text-fuzzer-primary font-mono border border-fuzzer-primary/20 rounded-md bg-fuzzer-primary/5">
            Monitoring real-time metrics • Last updated: {format(currentTime, 'HH:mm:ss')}
          </div>
        ) : (
          <div className="text-center py-2 text-xs text-muted-foreground border border-muted/10 rounded-md">
            Start a scan to see real-time metrics
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeMetrics;
