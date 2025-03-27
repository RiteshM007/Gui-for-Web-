
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { 
  Shield, 
  Zap, 
  Cpu, 
  Server, 
  Network, 
  Database, 
  Terminal as TerminalIcon,
  Clock, 
  BarChart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TechnicalLoader } from "@/components/ui/technical-loader";
import { Terminal } from "@/components/ui/terminal";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { DataMatrix } from "@/components/ui/data-matrix";
import { Progress } from "@/components/ui/progress";

const TERMINAL_LINES = [
  "Initializing security scanner...",
  "Loading vulnerability database...",
  "Database loaded successfully.",
  "Starting network reconnaissance...",
  "Scanning target endpoints...",
  "Analyzing response patterns...",
  "Identifying potential injection points...",
  "Testing XSS vulnerabilities...",
  "Testing SQL injection vectors...",
  "Testing CSRF protection mechanisms...",
  "Analyzing authentication flows...",
  "Checking for sensitive data exposure...",
  "Scanning for outdated components...",
  "Performing deep packet inspection...",
  "Generating security report...",
  "Scan complete. Found 7 potential vulnerabilities."
];

const EnhancedDashboard = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [securityScore, setSecurityScore] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [systemStatus, setSystemStatus] = useState({
    cpu: Math.floor(Math.random() * 30) + 40,
    memory: Math.floor(Math.random() * 20) + 30,
    network: Math.floor(Math.random() * 60) + 30,
    storage: Math.floor(Math.random() * 40) + 20
  });
  
  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsScanning(false);
            setSecurityScore(Math.floor(Math.random() * 40) + 60);
            toast.success("Scan completed", {
              description: "Security analysis finished successfully"
            });
            return 100;
          }
          return prev + 1;
        });
        
        // Update system metrics randomly during scan
        setSystemStatus(prev => ({
          cpu: Math.min(95, prev.cpu + (Math.random() * 10) - 5),
          memory: Math.min(95, prev.memory + (Math.random() * 8) - 4),
          network: Math.min(95, prev.network + (Math.random() * 12) - 6),
          storage: prev.storage
        }));
      }, 120);
      
      return () => clearInterval(interval);
    }
  }, [isScanning]);
  
  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    toast.info("Starting comprehensive security scan", {
      description: "This may take a few minutes to complete"
    });
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Security Operations Center</h1>
          <p className="text-muted-foreground">
            Real-time monitoring and analysis platform
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <StatusIndicator status={isScanning ? 'online' : 'offline'} label={isScanning ? 'Scanning' : 'Idle'} />
          
          <Button 
            onClick={handleStartScan} 
            disabled={isScanning}
            className="bg-gradient-to-r from-fuzzer-primary to-purple-600 hover:from-purple-600 hover:to-fuzzer-primary transition-all duration-500"
          >
            {isScanning ? (
              <>
                <Cpu className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Launch Scan
              </>
            )}
          </Button>
        </div>
      </div>
      
      {isScanning && (
        <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 scan-line-animation"
            style={{ width: `${scanProgress}%` }}
          ></div>
          <div className="absolute right-0 top-0 bottom-0 flex items-center pr-2">
            <span className="text-xs font-mono">{scanProgress}%</span>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Overview area */}
        <div className="md:col-span-8 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="neo-blur bg-card/30 border-fuzzer-primary/20 hover-scale-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-fuzzer-primary" />
                  CPU Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{Math.floor(systemStatus.cpu)}%</div>
                <Progress value={systemStatus.cpu} className="h-1 mt-2" />
              </CardContent>
            </Card>
            
            <Card className="neo-blur bg-card/30 border-fuzzer-primary/20 hover-scale-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Server className="h-4 w-4 text-blue-500" />
                  Memory
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{Math.floor(systemStatus.memory)}%</div>
                <Progress value={systemStatus.memory} className="h-1 mt-2" indicatorClassName="bg-blue-500" />
              </CardContent>
            </Card>
            
            <Card className="neo-blur bg-card/30 border-fuzzer-primary/20 hover-scale-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Network className="h-4 w-4 text-green-500" />
                  Network
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{Math.floor(systemStatus.network)}%</div>
                <Progress value={systemStatus.network} className="h-1 mt-2" indicatorClassName="bg-green-500" />
              </CardContent>
            </Card>
            
            <Card className="neo-blur bg-card/30 border-fuzzer-primary/20 hover-scale-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Database className="h-4 w-4 text-amber-500" />
                  Storage
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{Math.floor(systemStatus.storage)}%</div>
                <Progress value={systemStatus.storage} className="h-1 mt-2" indicatorClassName="bg-amber-500" />
              </CardContent>
            </Card>
          </div>
          
          <Card className="neo-blur bg-card/30 border-fuzzer-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-fuzzer-primary" />
                Security Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-background/40 rounded-lg p-4 text-center">
                  <div className="text-muted-foreground text-sm mb-1">Security Score</div>
                  <div className="text-3xl font-bold">{securityScore}/100</div>
                  <Progress 
                    value={securityScore} 
                    className="h-2 mt-2" 
                    indicatorClassName={`${
                      securityScore > 80 ? 'bg-green-500' : 
                      securityScore > 60 ? 'bg-amber-500' : 
                      'bg-red-500'
                    }`} 
                  />
                </div>
                
                <div className="bg-background/40 rounded-lg p-4">
                  <div className="text-muted-foreground text-sm mb-2">Vulnerability Status</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/30">Critical</Badge>
                        <span className="text-xs">Remote Code Execution</span>
                      </div>
                      <span className="text-xs font-mono">2</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/30">High</Badge>
                        <span className="text-xs">SQL Injection</span>
                      </div>
                      <span className="text-xs font-mono">5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30">Medium</Badge>
                        <span className="text-xs">XSS Vulnerability</span>
                      </div>
                      <span className="text-xs font-mono">12</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-background/40 rounded-lg p-4">
                  <div className="text-muted-foreground text-sm mb-2">Recent Activity</div>
                  <div className="text-xs space-y-2">
                    <div className="flex gap-2 items-start">
                      <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5"></div>
                      <div>
                        <div className="font-medium">Firewall Updated</div>
                        <div className="text-muted-foreground">2 minutes ago</div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-start">
                      <div className="h-2 w-2 rounded-full bg-amber-500 mt-1.5"></div>
                      <div>
                        <div className="font-medium">Login Attempt Blocked</div>
                        <div className="text-muted-foreground">15 minutes ago</div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-start">
                      <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5"></div>
                      <div>
                        <div className="font-medium">System Backup Completed</div>
                        <div className="text-muted-foreground">1 hour ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar area */}
        <div className="md:col-span-4 space-y-6">
          <Card className="neo-blur bg-card/30 border-fuzzer-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <TerminalIcon className="h-5 w-5 text-fuzzer-primary" />
                System Terminal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Terminal 
                lines={TERMINAL_LINES} 
                autoType={isScanning}
                initialLines={isScanning ? 0 : TERMINAL_LINES.length}
                className="h-[300px]"
              />
            </CardContent>
          </Card>
          
          <Card className="neo-blur bg-card/30 border-fuzzer-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-fuzzer-primary" />
                Active Subsystems
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <StatusIndicator status="online" pulse={false} />
                    <span className="text-sm">Firewall</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-500">Active</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <StatusIndicator status="online" pulse={false} />
                    <span className="text-sm">IDS/IPS</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-500">Active</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <StatusIndicator status="warning" pulse={false} />
                    <span className="text-sm">Antivirus</span>
                  </div>
                  <Badge className="bg-amber-500/20 text-amber-500">Warning</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <StatusIndicator status="offline" pulse={false} />
                    <span className="text-sm">VPN</span>
                  </div>
                  <Badge className="bg-slate-500/20 text-slate-300">Inactive</Badge>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Data Flow Analysis</span>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <DataMatrix className="w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card className="neo-blur bg-card/30 border-fuzzer-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-fuzzer-primary" />
            Network Traffic
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[100px] w-full relative">
            {Array.from({ length: 50 }).map((_, i) => {
              const height = Math.random() * 70 + 10;
              return (
                <div 
                  key={i}
                  className="absolute bottom-0 bg-fuzzer-primary/70 rounded-t-sm"
                  style={{
                    height: `${height}%`,
                    width: '8px',
                    left: `${i * 2}%`,
                    opacity: 0.2 + Math.random() * 0.8,
                    transition: 'height 1s ease'
                  }}
                ></div>
              );
            })}
            <div className="absolute inset-0 border-b border-l border-border"></div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Total Traffic</div>
              <div className="text-lg font-bold">1.45 GB</div>
            </div>
            
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Packets/sec</div>
              <div className="text-lg font-bold">1,253</div>
            </div>
            
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Active Connections</div>
              <div className="text-lg font-bold">37</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedDashboard;
