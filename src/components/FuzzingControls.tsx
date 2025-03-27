
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Pause, 
  StopCircle, 
  FileUp, 
  MousePointerClick, 
  Globe, 
  Shield,
  AlertTriangle,
  Code,
  Server,
  Settings
} from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { fuzzingService, FuzzingParameters } from '@/services/fuzzingService';

interface FuzzingControlsProps {
  onStartScan?: () => void;
}

const FuzzingControls: React.FC<FuzzingControlsProps> = ({ onStartScan }) => {
  const [threadCount, setThreadCount] = useState(5);
  const [delay, setDelay] = useState(100);
  const [attackMode, setAttackMode] = useState<'standard' | 'aggressive'>("standard");
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [targetUrl, setTargetUrl] = useState("example.com/api/users");
  const [protocol, setProtocol] = useState("https");
  const [method, setMethod] = useState("GET");
  const [fuzzType, setFuzzType] = useState("parameter");
  const [payloadType, setPayloadType] = useState("sqlInjection");
  const [headers, setHeaders] = useState(`User-Agent: Mozilla/5.0
Content-Type: application/json
Authorization: Bearer {{token}}`);
  const [payloads, setPayloads] = useState("' OR 1=1--\n' UNION SELECT 1,2,3--\n'; DROP TABLE users--");
  const [followRedirects, setFollowRedirects] = useState(true);
  const [detectErrors, setDetectErrors] = useState(true);
  const [enableAiAnalysis, setEnableAiAnalysis] = useState(true);
  
  const handleStartFuzzing = async () => {
    setIsLoading(true);
    
    // Prepare parameters for the fuzzing operation
    const params: FuzzingParameters = {
      targetUrl,
      protocol,
      method,
      fuzzType,
      payloadType,
      headers,
      payloads,
      followRedirects,
      detectErrors,
      enableAiAnalysis,
      threadCount,
      delay,
      attackMode
    };
    
    try {
      // Call the fuzzing service to start the scan
      const result = await fuzzingService.startScan(params);
      
      if (result.success) {
        toast.success("Fuzzing started", {
          description: result.message || "Scanning target with selected parameters",
        });
        
        // Call the parent callback if provided
        if (onStartScan) {
          onStartScan();
        }
      } else {
        toast.error("Failed to start fuzzing", {
          description: result.message || "An error occurred while starting the scan",
        });
      }
    } catch (error) {
      console.error("Error starting fuzzing:", error);
      toast.error("Error starting fuzzing", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStopFuzzing = async () => {
    setIsLoading(true);
    
    try {
      const stopped = await fuzzingService.stopScan();
      
      if (stopped) {
        toast.success("Fuzzing stopped", {
          description: "The current fuzzing scan has been stopped",
        });
      } else {
        toast.error("Failed to stop fuzzing", {
          description: "Could not stop the current fuzzing scan",
        });
      }
    } catch (error) {
      console.error("Error stopping fuzzing:", error);
      toast.error("Error stopping fuzzing", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setPayloads(content);
      toast.success("File loaded", {
        description: `Loaded ${file.name} with ${content.split('\n').length} payloads`,
      });
    };
    reader.readAsText(file);
  };
  
  return (
    <CardContent className="p-0">
      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid grid-cols-4 w-full mb-4 p-1 neo-blur">
          <TabsTrigger value="manual" className="flex items-center gap-2 data-[state=active]:bg-fuzzer-primary data-[state=active]:text-primary-foreground">
            <MousePointerClick className="h-4 w-4" />
            <span className="hidden sm:inline">Manual Entry</span>
          </TabsTrigger>
          <TabsTrigger value="import" className="flex items-center gap-2 data-[state=active]:bg-fuzzer-primary data-[state=active]:text-primary-foreground">
            <FileUp className="h-4 w-4" />
            <span className="hidden sm:inline">Import Request</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2 data-[state=active]:bg-fuzzer-primary data-[state=active]:text-primary-foreground">
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Advanced</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-fuzzer-primary data-[state=active]:text-primary-foreground">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual" className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="url" className="flex items-center gap-2">
                Target URL
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertTriangle className="h-3.5 w-3.5 text-fuzzer-warning" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Enter the full URL of the target including any specific parameters you want to test</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="flex gap-2">
                <Select 
                  value={protocol}
                  onValueChange={setProtocol}
                  defaultValue="https"
                >
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Protocol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="https">HTTPS</SelectItem>
                    <SelectItem value="http">HTTP</SelectItem>
                    <SelectItem value="ws">WebSocket</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative w-full">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="url" 
                    placeholder="example.com/api/endpoint" 
                    className="pl-10"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="method">HTTP Method</Label>
                <Select 
                  value={method}
                  onValueChange={setMethod}
                  defaultValue="GET"
                >
                  <SelectTrigger id="method" className="hover-scale">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="fuzzType">Fuzzing Type</Label>
                <Select 
                  value={fuzzType}
                  onValueChange={setFuzzType}
                  defaultValue="parameter"
                >
                  <SelectTrigger id="fuzzType" className="hover-scale">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parameter">Parameter Fuzzing</SelectItem>
                    <SelectItem value="path">Path Fuzzing</SelectItem>
                    <SelectItem value="header">Header Fuzzing</SelectItem>
                    <SelectItem value="body">Body Fuzzing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="payloadType">Payload Type</Label>
                <Select 
                  value={payloadType}
                  onValueChange={setPayloadType}
                  defaultValue="sqlInjection"
                >
                  <SelectTrigger id="payloadType" className="hover-scale">
                    <SelectValue placeholder="Select payload" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sqlInjection">SQL Injection</SelectItem>
                    <SelectItem value="xss">XSS</SelectItem>
                    <SelectItem value="command">Command Injection</SelectItem>
                    <SelectItem value="path">Path Traversal</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="headers">HTTP Headers</Label>
                <Badge variant="outline" className="text-xs bg-fuzzer-primary/20">Auto-Detect</Badge>
              </div>
              <Textarea 
                id="headers" 
                placeholder="Enter headers (one per line)" 
                className="font-mono text-sm h-20 resize-none custom-scrollbar"
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="payloads">Fuzzing Payloads</Label>
                <Button variant="outline" size="sm" className="text-xs h-7 px-2">Load Template</Button>
              </div>
              <Textarea 
                id="payloads" 
                placeholder="Enter payloads (one per line)" 
                className="font-mono text-sm h-24 resize-none custom-scrollbar"
                value={payloads}
                onChange={(e) => setPayloads(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Attack Mode</Label>
                  <span className="text-xs text-muted-foreground">{attackMode === "standard" ? "Normal Speed" : "Aggressive"}</span>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant={attackMode === "standard" ? "default" : "outline"} 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setAttackMode("standard")}
                  >
                    Standard
                  </Button>
                  <Button 
                    variant={attackMode === "aggressive" ? "default" : "outline"} 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setAttackMode("aggressive")}
                  >
                    Aggressive
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="followRedirects" 
                      checked={followRedirects}
                      onCheckedChange={setFollowRedirects}
                    />
                    <Label htmlFor="followRedirects">Follow Redirects</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="detectErrors" 
                      checked={detectErrors}
                      onCheckedChange={setDetectErrors}
                    />
                    <Label htmlFor="detectErrors">Auto-detect Errors</Label>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="ai-analysis" 
                    checked={enableAiAnalysis}
                    onCheckedChange={setEnableAiAnalysis}
                  />
                  <Label htmlFor="ai-analysis">Enable AI Analysis</Label>
                  <Badge className="ml-1 bg-fuzzer-primary/20 text-xs px-1.5 py-0">Beta</Badge>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="import" className="space-y-4 py-2">
          <div className="border-2 border-dashed rounded-lg p-8 text-center border-border hover-scale transition-all duration-300">
            <FileUp className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Drag & drop request file or click to browse</p>
            <p className="text-xs text-muted-foreground mb-4">Supports Burp, ZAP, and raw HTTP request files</p>
            <div className="relative">
              <Input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handleFileUpload}
                accept=".txt,.req,.http"
              />
              <Button>Select File</Button>
            </div>
          </div>
          
          <div className="bg-secondary/40 rounded-lg p-4">
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <Server className="h-4 w-4 mr-2" />
              Recent Imports
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50 cursor-pointer">
                <span className="text-sm">login-request.txt</span>
                <Badge variant="outline" className="text-xs">2 hours ago</Badge>
              </div>
              <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50 cursor-pointer">
                <span className="text-sm">api-product-search.txt</span>
                <Badge variant="outline" className="text-xs">Yesterday</Badge>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Connection Timeout (ms)</Label>
                <Input type="number" defaultValue="30000" />
              </div>
              
              <div className="space-y-2">
                <Label>Custom User Agent</Label>
                <Textarea className="h-20 font-mono text-sm" defaultValue="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" />
              </div>
              
              <div className="space-y-2">
                <Label>Proxy Settings</Label>
                <Input placeholder="http://proxy.example.com:8080" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Custom Attack Templates</Label>
                <Select defaultValue="default">
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Authentication Settings</Label>
                <Select defaultValue="none">
                  <SelectTrigger>
                    <SelectValue placeholder="Select auth type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="basic">Basic Auth</SelectItem>
                    <SelectItem value="bearer">Bearer Token</SelectItem>
                    <SelectItem value="oauth">OAuth 2.0</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Payload Encoding</Label>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">URL</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">Base64</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted bg-fuzzer-primary/20">HTML</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">None</Badge>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Performance Settings</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="threads">Threads</Label>
                      <span className="text-sm text-muted-foreground">{threadCount}</span>
                    </div>
                    <Slider 
                      id="threads" 
                      value={[threadCount]} 
                      min={1} 
                      max={20} 
                      step={1}
                      onValueChange={(value) => setThreadCount(value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="delay">Request Delay (ms)</Label>
                      <span className="text-sm text-muted-foreground">{delay}ms</span>
                    </div>
                    <Slider 
                      id="delay" 
                      value={[delay]} 
                      min={0} 
                      max={1000} 
                      step={10}
                      onValueChange={(value) => setDelay(value[0])}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium mb-2">Logging & Reports</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="log-level">Log Level</Label>
                    <Select defaultValue="info">
                      <SelectTrigger className="w-28">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debug">Debug</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="save-reports" defaultChecked={true} />
                    <Label htmlFor="save-reports">Auto-save Reports</Label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Security & Detection</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="browser-emulation" defaultChecked={true} />
                    <Label htmlFor="browser-emulation">Browser Emulation</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="passive-scan" defaultChecked={true} />
                    <Label htmlFor="passive-scan">Passive Analysis</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="pattern-matching" defaultChecked={true} />
                    <Label htmlFor="pattern-matching">Enhanced Pattern Matching</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium mb-2">Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="desktop-notifications" defaultChecked={true} />
                    <Label htmlFor="desktop-notifications">Desktop Notifications</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="sound-alerts" defaultChecked={false} />
                    <Label htmlFor="sound-alerts">Sound Alerts</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Label htmlFor="threads" className="text-xs text-muted-foreground">Concurrency:</Label>
          <Input 
            id="threads" 
            type="number" 
            className="w-16 h-8 text-center"
            value={threadCount}
            onChange={(e) => setThreadCount(Number(e.target.value))}
          />
          
          <Label htmlFor="delay" className="ml-2 text-xs text-muted-foreground">Delay:</Label>
          <Input 
            id="delay" 
            type="number" 
            className="w-20 h-8 text-center"
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
          />
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9"
            disabled={isLoading}
          >
            <Pause className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9"
            onClick={handleStopFuzzing}
            disabled={isLoading}
          >
            <StopCircle className="h-4 w-4" />
          </Button>
          <Button 
            className="bg-fuzzer-primary hover:bg-fuzzer-secondary flex gap-2 h-9"
            onClick={handleStartFuzzing}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Start Fuzzing</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </CardContent>
  );
};

export default FuzzingControls;
