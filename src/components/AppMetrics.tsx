import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Cpu, 
  Memory, 
  HardDrive, 
  Activity, 
  Network, 
  Clock,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { DataMatrix } from "@/components/ui/data-matrix";
import { format } from 'date-fns';

interface AppMetricsProps {
  isLive?: boolean;
}

const AppMetrics: React.FC<AppMetricsProps> = ({ isLive = true }) => {
  const [metrics, setMetrics] = useState({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
    requests: 0,
    responseTime: 0,
    successRate: 0,
    errorRate: 0,
    uptime: '0h 0m 0s',
  });
  
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [statusHistory, setStatusHistory] = useState<Array<number>>([]);
  
  // Simulate real metrics data with random fluctuations
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        // Update system metrics with small random changes
        setMetrics(prev => {
          // Create small fluctuations but keep values within reasonable ranges
          const newCpu = Math.max(5, Math.min(95, prev.cpu + (Math.random() * 10 - 5)));
          const newMemory = Math.max(10, Math.min(90, prev.memory + (Math.random() * 8 - 4)));
          const newDisk = Math.max(20, Math.min(85, prev.disk + (Math.random() * 4 - 2)));
          const newNetwork = Math.max(5, Math.min(80, prev.network + (Math.random() * 15 - 7.5)));
          
          // Simulate varying request count (increasing over time)
          const newRequests = prev.requests + Math.floor(Math.random() * 3);
          
          // Response time fluctuations
          const newResponseTime = Math.max(50, Math.min(500, prev.responseTime + (Math.random() * 40 - 20)));
          
          // Success and error rates should add up to 100%
          const newSuccessRate = Math.max(60, Math.min(99, prev.successRate + (Math.random() * 4 - 2)));
          const newErrorRate = 100 - newSuccessRate;
          
          // Calculate uptime
          const uptimeSeconds = Math.floor((new Date().getTime() - performance.timing.navigationStart) / 1000);
          const hours = Math.floor(uptimeSeconds / 3600);
          const minutes = Math.floor((uptimeSeconds % 3600) / 60);
          const seconds = uptimeSeconds % 60;
          const uptime = `${hours}h ${minutes}m ${seconds}s`;
          
          return {
            cpu: Number(newCpu.toFixed(1)),
            memory: Number(newMemory.toFixed(1)),
            disk: Number(newDisk.toFixed(1)),
            network: Number(newNetwork.toFixed(1)),
            requests: newRequests,
            responseTime: Math.floor(newResponseTime),
            successRate: Number(newSuccessRate.toFixed(1)),
            errorRate: Number(newErrorRate.toFixed(1)),
            uptime
          };
        });
        
        // Update current time
        setCurrentTime(new Date());
        
        // Update status history (for the sparkline/data visualization)
        setStatusHistory(prev => {
          const newValue = Math.floor(Math.random() * 100);
          const newHistory = [...prev, newValue];
          if (newHistory.length > 20) {
            return newHistory.slice(-20);
          }
          return newHistory;
        });
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [isLive]);
  
  // Calculate color classes based on metric values
  const getColorClass = (value: number, type: 'bg' | 'text' = 'bg') => {
    if (value > 80) return `${type}-red-500`;
    if (value > 60) return `${type}-amber-500`;
    if (value > 30) return `${type}-green-500`;
    return `${type}-blue-500`;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Activity className="h-5 w-5 text-fuzzer-primary" />
          Application Metrics
        </h3>
        <div className="text-sm font-mono text-muted-foreground">
          <Clock className="h-4 w-4 inline mr-1" />
          {format(currentTime, 'yyyy-MM-dd HH:mm:ss')}
        </div>
      </div>
      
      {/* System Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU Usage */}
        <Card className="neo-blur frost-panel bg-card/30 border-border hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Cpu className="h-4 w-4 text-fuzzer-primary" />
              CPU Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-2xl font-bold">{metrics.cpu}%</span>
              <div className={`p-1 rounded ${metrics.cpu > 70 ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                {metrics.cpu > 70 ? (
                  <ArrowUpRight className="h-4 w-4 text-red-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-green-500" />
                )}
              </div>
            </div>
            <Progress 
              value={metrics.cpu} 
              className="h-1.5" 
            >
              <div className={`h-full w-full ${getColorClass(metrics.cpu)}`}></div>
            </Progress>
          </CardContent>
        </Card>
        
        {/* Memory Usage */}
        <Card className="neo-blur frost-panel bg-card/30 border-border hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Memory className="h-4 w-4 text-fuzzer-primary" />
              Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-2xl font-bold">{metrics.memory}%</span>
              <div className={`p-1 rounded ${metrics.memory > 70 ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                {metrics.memory > 70 ? (
                  <ArrowUpRight className="h-4 w-4 text-red-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-green-500" />
                )}
              </div>
            </div>
            <Progress 
              value={metrics.memory} 
              className="h-1.5" 
            >
              <div className={`h-full w-full ${getColorClass(metrics.memory)}`}></div>
            </Progress>
          </CardContent>
        </Card>
        
        {/* Disk I/O */}
        <Card className="neo-blur frost-panel bg-card/30 border-border hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-fuzzer-primary" />
              Disk I/O
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-2xl font-bold">{metrics.disk}%</span>
              <div className={`p-1 rounded ${metrics.disk > 70 ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                {metrics.disk > 70 ? (
                  <ArrowUpRight className="h-4 w-4 text-red-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-green-500" />
                )}
              </div>
            </div>
            <Progress 
              value={metrics.disk} 
              className="h-1.5" 
            >
              <div className={`h-full w-full ${getColorClass(metrics.disk)}`}></div>
            </Progress>
          </CardContent>
        </Card>
        
        {/* Network */}
        <Card className="neo-blur frost-panel bg-card/30 border-border hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Network className="h-4 w-4 text-fuzzer-primary" />
              Network
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-2xl font-bold">{metrics.network}%</span>
              <div className={`p-1 rounded ${metrics.network > 70 ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                {metrics.network > 70 ? (
                  <ArrowUpRight className="h-4 w-4 text-red-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-green-500" />
                )}
              </div>
            </div>
            <Progress 
              value={metrics.network} 
              className="h-1.5" 
            >
              <div className={`h-full w-full ${getColorClass(metrics.network)}`}></div>
            </Progress>
          </CardContent>
        </Card>
      </div>
      
      {/* Application Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Stats */}
        <Card className="neo-blur frost-panel bg-card/30 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-fuzzer-primary" />
              Performance Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/40 rounded-lg p-3 transition-all duration-300 hover:bg-secondary/50">
                <div className="text-xs text-muted-foreground mb-1">Total Requests</div>
                <div className="text-2xl font-bold">{metrics.requests.toLocaleString()}</div>
              </div>
              
              <div className="bg-secondary/40 rounded-lg p-3 transition-all duration-300 hover:bg-secondary/50">
                <div className="text-xs text-muted-foreground mb-1">Avg Response Time</div>
                <div className="text-2xl font-bold">{metrics.responseTime} ms</div>
              </div>
              
              <div className="bg-secondary/40 rounded-lg p-3 transition-all duration-300 hover:bg-secondary/50">
                <div className="text-xs text-muted-foreground mb-1">Success Rate</div>
                <div className="text-2xl font-bold text-green-500">{metrics.successRate}%</div>
              </div>
              
              <div className="bg-secondary/40 rounded-lg p-3 transition-all duration-300 hover:bg-secondary/50">
                <div className="text-xs text-muted-foreground mb-1">Error Rate</div>
                <div className="text-2xl font-bold text-red-500">{metrics.errorRate}%</div>
              </div>
            </div>
            
            <div className="border-t border-border pt-4">
              <div className="flex justify-between mb-2">
                <div className="text-sm">Application Uptime</div>
                <div className="text-sm font-mono text-fuzzer-primary">{metrics.uptime}</div>
              </div>
              <Progress value={85} className="h-1.5">
                <div className="h-full w-full bg-fuzzer-primary"></div>
              </Progress>
            </div>
          </CardContent>
        </Card>
        
        {/* Data Visualization */}
        <Card className="neo-blur frost-panel bg-card/30 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Activity className="h-5 w-5 text-fuzzer-primary" />
              System Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center">
              <DataMatrix 
                rows={10} 
                cols={16} 
                cellSize={12} 
                activeColor="#8B5CF6" 
                inactiveColor="#1F2937"
                speed={500} 
                density={0.2}
                className="w-full h-full"
              />
            </div>
            <div className="flex justify-between items-center mt-4 text-xs">
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-fuzzer-primary mr-1"></div>
                  <span>Active</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#1F2937] mr-1"></div>
                  <span>Inactive</span>
                </div>
              </div>
              <div className="text-muted-foreground">
                Real-time system activity visualization
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppMetrics;
