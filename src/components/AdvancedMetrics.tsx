
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Cpu, Server, Network, Gauge, Terminal, Shield, Clock, Settings2, Layers, FilterX } from 'lucide-react';
import { toast } from "sonner";

interface AdvancedMetricsProps {
  isScanning: boolean;
  metrics: {
    totalRequests: number;
    successRate: number;
    errorRate: number;
    avgResponseTime: number;
    elapsedTime: string;
  };
}

const AdvancedMetrics: React.FC<AdvancedMetricsProps> = ({ isScanning, metrics }) => {
  const handleSettingChange = (setting: string, value: any) => {
    toast.success(`${setting} updated`, {
      description: `New value: ${value}`,
      duration: 2000
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Performance Metrics */}
        <Card className="neo-blur frost-panel bg-card/30 border-border hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Cpu className="h-5 w-5 text-fuzzer-primary" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">CPU Usage</span>
                <span className="font-medium">{Math.floor(Math.random() * 30) + 40}%</span>
              </div>
              <div className="h-1.5 w-full bg-secondary relative overflow-hidden rounded-full">
                <div 
                  className="absolute top-0 left-0 h-full bg-fuzzer-primary animate-pulse-slow"
                  style={{ width: `${Math.floor(Math.random() * 30) + 40}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Memory Usage</span>
                <span className="font-medium">{Math.floor(Math.random() * 20) + 30}%</span>
              </div>
              <div className="h-1.5 w-full bg-secondary relative overflow-hidden rounded-full">
                <div 
                  className="absolute top-0 left-0 h-full bg-blue-500"
                  style={{ width: `${Math.floor(Math.random() * 20) + 30}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <div className="flex justify-between mb-1">
                <span>Threads:</span>
                <span className="font-mono">{Math.floor(Math.random() * 8) + 8}</span>
              </div>
              <div className="flex justify-between">
                <span>Requests/sec:</span>
                <span className="font-mono">{Math.floor(Math.random() * 200) + 100}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network Metrics */}
        <Card className="neo-blur frost-panel bg-card/30 border-border hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Network className="h-5 w-5 text-fuzzer-primary" />
              Network
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Bandwidth Usage</span>
                <span className="font-medium">{Math.floor(Math.random() * 10) + 2} MB/s</span>
              </div>
              <div className="h-1.5 w-full bg-secondary relative overflow-hidden rounded-full">
                <div 
                  className="absolute top-0 left-0 h-full bg-green-500"
                  style={{ width: `${Math.floor(Math.random() * 60) + 20}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Connection Pool</span>
                <span className="font-medium">{Math.floor(Math.random() * 50) + 150}/{Math.floor(Math.random() * 50) + 250}</span>
              </div>
              <div className="h-1.5 w-full bg-secondary relative overflow-hidden rounded-full">
                <div 
                  className="absolute top-0 left-0 h-full bg-amber-500"
                  style={{ width: `${Math.floor(Math.random() * 40) + 40}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <div className="flex justify-between mb-1">
                <span>Active Connections:</span>
                <span className="font-mono">{Math.floor(Math.random() * 20) + 20}</span>
              </div>
              <div className="flex justify-between">
                <span>DNS Latency:</span>
                <span className="font-mono">{Math.floor(Math.random() * 30) + 10} ms</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Metrics */}
        <Card className="neo-blur frost-panel bg-card/30 border-border hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Server className="h-5 w-5 text-fuzzer-primary" />
              System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Disk I/O</span>
                <span className="font-medium">{Math.floor(Math.random() * 50) + 10} MB/s</span>
              </div>
              <div className="h-1.5 w-full bg-secondary relative overflow-hidden rounded-full">
                <div 
                  className="absolute top-0 left-0 h-full bg-purple-500"
                  style={{ width: `${Math.floor(Math.random() * 30) + 30}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Socket Buffer</span>
                <span className="font-medium">{Math.floor(Math.random() * 20) + 20}%</span>
              </div>
              <div className="h-1.5 w-full bg-secondary relative overflow-hidden rounded-full">
                <div 
                  className="absolute top-0 left-0 h-full bg-blue-600"
                  style={{ width: `${Math.floor(Math.random() * 20) + 20}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <div className="flex justify-between mb-1">
                <span>Uptime:</span>
                <span className="font-mono">{Math.floor(Math.random() * 24) + 1}h {Math.floor(Math.random() * 60)}m</span>
              </div>
              <div className="flex justify-between">
                <span>Worker Processes:</span>
                <span className="font-mono">{Math.floor(Math.random() * 6) + 4}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Settings Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="neo-blur frost-panel bg-card/30 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-fuzzer-primary" />
              Advanced Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="request-throttle">Request Throttling (ms)</Label>
                <div className="flex items-center gap-4">
                  <Slider 
                    id="request-throttle"
                    defaultValue={[100]} 
                    max={500} 
                    step={10}
                    className="flex-grow"
                    onValueChange={(value) => handleSettingChange("Request Throttling", `${value[0]}ms`)}
                    disabled={isScanning}
                  />
                  <span className="text-sm font-mono w-12">100ms</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeout">Request Timeout (ms)</Label>
                <div className="flex items-center gap-4">
                  <Slider 
                    id="timeout"
                    defaultValue={[3000]} 
                    min={500}
                    max={10000} 
                    step={100}
                    className="flex-grow"
                    onValueChange={(value) => handleSettingChange("Request Timeout", `${value[0]}ms`)}
                    disabled={isScanning}
                  />
                  <span className="text-sm font-mono w-16">3000ms</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="concurrency">Concurrency</Label>
                <div className="flex items-center gap-4">
                  <Slider 
                    id="concurrency"
                    defaultValue={[10]} 
                    max={50} 
                    step={1}
                    className="flex-grow"
                    onValueChange={(value) => handleSettingChange("Concurrency", value[0])}
                    disabled={isScanning}
                  />
                  <span className="text-sm font-mono w-8">10</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="protocol">Protocol</Label>
                <Select 
                  defaultValue="http2" 
                  onValueChange={(value) => handleSettingChange("Protocol", value)}
                  disabled={isScanning}
                >
                  <SelectTrigger id="protocol">
                    <SelectValue placeholder="Select protocol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="http1">HTTP/1.1</SelectItem>
                    <SelectItem value="http2">HTTP/2</SelectItem>
                    <SelectItem value="http3">HTTP/3 (QUIC)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logging">Logging Level</Label>
                <Select 
                  defaultValue="info" 
                  onValueChange={(value) => handleSettingChange("Logging Level", value)}
                  disabled={isScanning}
                >
                  <SelectTrigger id="logging">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warn">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                    <SelectItem value="trace">Trace</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="proxy">Proxy URL (optional)</Label>
              <Input 
                id="proxy" 
                placeholder="http://proxy.example.com:8080" 
                className="font-mono text-sm"
                onChange={(e) => e.target.value && handleSettingChange("Proxy URL", e.target.value)}
                disabled={isScanning}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="neo-blur frost-panel bg-card/30 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Terminal className="h-5 w-5 text-fuzzer-primary" />
              Advanced Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-fuzzer-primary" />
                  <Label htmlFor="ssl-validation" className="cursor-pointer">SSL Certificate Validation</Label>
                </div>
                <Switch 
                  id="ssl-validation" 
                  defaultChecked 
                  onCheckedChange={(checked) => handleSettingChange("SSL Validation", checked ? "Enabled" : "Disabled")}
                  disabled={isScanning}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FilterX className="h-4 w-4 text-fuzzer-primary" />
                  <Label htmlFor="payload-filtering" className="cursor-pointer">Advanced Payload Filtering</Label>
                </div>
                <Switch 
                  id="payload-filtering" 
                  defaultChecked 
                  onCheckedChange={(checked) => handleSettingChange("Payload Filtering", checked ? "Enabled" : "Disabled")}
                  disabled={isScanning}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-fuzzer-primary" />
                  <Label htmlFor="rate-limiting" className="cursor-pointer">Rate Limiting Detection</Label>
                </div>
                <Switch 
                  id="rate-limiting" 
                  defaultChecked 
                  onCheckedChange={(checked) => handleSettingChange("Rate Limiting Detection", checked ? "Enabled" : "Disabled")}
                  disabled={isScanning}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Layers className="h-4 w-4 text-fuzzer-primary" />
                  <Label htmlFor="recursive-scanning" className="cursor-pointer">Recursive Scanning</Label>
                </div>
                <Switch 
                  id="recursive-scanning" 
                  onCheckedChange={(checked) => handleSettingChange("Recursive Scanning", checked ? "Enabled" : "Disabled")}
                  disabled={isScanning}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Gauge className="h-4 w-4 text-fuzzer-primary" />
                  <Label htmlFor="performance-profiling" className="cursor-pointer">Performance Profiling</Label>
                </div>
                <Switch 
                  id="performance-profiling" 
                  onCheckedChange={(checked) => handleSettingChange("Performance Profiling", checked ? "Enabled" : "Disabled")}
                  disabled={isScanning}
                />
              </div>
              
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    toast.success("Settings reset to defaults", {
                      description: "All advanced settings have been reset"
                    });
                  }}
                  disabled={isScanning}
                >
                  Reset to Defaults
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedMetrics;
