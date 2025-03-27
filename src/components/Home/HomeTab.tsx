
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bug, 
  Activity, 
  Shield, 
  Clock, 
  FileWarning, 
  ArrowRight, 
  BarChart4, 
  ScanLine,
  Database,
  Sparkles,
  Cpu,
  Gauge
} from 'lucide-react';
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { TechnicalLoader } from "@/components/ui/technical-loader";

interface HomeTabProps {
  onStartScan: () => void;
  onTabChange: (tab: string) => void;
  recentTargets?: string[];
  recentVulnerabilities?: {
    id: number;
    type: string;
    endpoint: string;
    severity: string;
  }[];
}

const HomeTab: React.FC<HomeTabProps> = ({ 
  onStartScan, 
  onTabChange, 
  recentTargets = ['https://example.com/api', 'https://testapp.io/login', 'https://demo-site.com'],
  recentVulnerabilities = [
    {id: 1, type: 'XSS', endpoint: '/api/search', severity: 'High'},
    {id: 2, type: 'SQL Injection', endpoint: '/api/users', severity: 'Critical'},
  ]
}) => {
  const getSeverityColor = (severity: string) => {
    const colors = {
      'Low': 'bg-blue-500/20 text-blue-500',
      'Medium': 'bg-yellow-500/20 text-yellow-500',
      'High': 'bg-orange-500/20 text-orange-500',
      'Critical': 'bg-red-500/20 text-red-500'
    };
    return colors[severity] || 'bg-gray-500/20 text-gray-500';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1 border-fuzzer-primary/20 bg-card/30 neo-blur hover-scale-sm transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl font-bold">
              <Shield className="mr-2 h-6 w-6 text-fuzzer-primary" />
              Welcome to FuzzifyWeb
            </CardTitle>
            <CardDescription>
              Your comprehensive web security testing platform
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-muted-foreground mb-4">
              FuzzifyWeb helps you identify vulnerabilities in your web applications
              through automated scanning and intelligent fuzzing techniques.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              <div className="bg-background/40 p-2 rounded flex flex-col items-center justify-center text-center">
                <Bug className="h-5 w-5 text-fuzzer-primary mb-1" />
                <span className="text-xs font-medium">Advanced Fuzzing</span>
              </div>
              <div className="bg-background/40 p-2 rounded flex flex-col items-center justify-center text-center">
                <Activity className="h-5 w-5 text-fuzzer-primary mb-1" />
                <span className="text-xs font-medium">Real-time Analysis</span>
              </div>
              <div className="bg-background/40 p-2 rounded flex flex-col items-center justify-center text-center">
                <BarChart4 className="h-5 w-5 text-fuzzer-primary mb-1" />
                <span className="text-xs font-medium">Detailed Reports</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button 
              className="w-full bg-fuzzer-primary hover:bg-fuzzer-secondary flex items-center gap-2"
              onClick={() => {
                toast.success("Starting security scan", {
                  description: "Initializing fuzzing process"
                });
                onStartScan();
                onTabChange('fuzzer');
              }}
            >
              <ScanLine className="h-4 w-4" />
              Start New Security Scan
            </Button>
            
            <Link to="/enhanced-dashboard" className="w-full">
              <Button
                variant="outline"
                className="w-full flex items-center gap-2 border-fuzzer-primary/50 hover:bg-fuzzer-primary/10 hover:text-fuzzer-primary hover:border-fuzzer-primary transition-all"
              >
                <Sparkles className="h-4 w-4" />
                Enhanced Dashboard
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex-1 border-fuzzer-primary/20 bg-card/30 neo-blur hover-scale-sm transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl font-bold">
              <Clock className="mr-2 h-6 w-6 text-fuzzer-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest security scans and findings
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-0">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Recent Targets</h3>
                <div className="space-y-2">
                  {recentTargets.map((target, index) => (
                    <div 
                      key={index} 
                      className="p-2 bg-background/40 rounded-md text-xs font-mono truncate cursor-pointer hover:bg-background/60 transition-all"
                      onClick={() => {
                        toast.info("Target selected", {
                          description: `Target set to ${target}`
                        });
                        onTabChange('fuzzer');
                      }}
                    >
                      {target}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Latest Vulnerabilities</h3>
                <div className="space-y-2">
                  {recentVulnerabilities.map((vuln) => (
                    <div 
                      key={vuln.id} 
                      className="p-2 bg-background/40 rounded-md hover:bg-background/60 transition-all cursor-pointer"
                      onClick={() => onTabChange('vulnerabilities')}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium">{vuln.type}</span>
                        <Badge className={getSeverityColor(vuln.severity)}>
                          {vuln.severity}
                        </Badge>
                      </div>
                      <div className="text-xs font-mono truncate mt-1 text-muted-foreground">
                        {vuln.endpoint}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2"
              onClick={() => onTabChange('vulnerabilities')}
            >
              <FileWarning className="h-4 w-4" />
              View All Vulnerabilities
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="border-fuzzer-primary/20 bg-card/30 neo-blur hover-scale-sm transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-xl font-bold">
            <Database className="mr-2 h-6 w-6 text-fuzzer-primary" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common security testing operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Scan API Endpoints', icon: ScanLine, tab: 'api-endpoints' },
              { name: 'Manage Payloads', icon: Database, tab: 'payload-library' },
              { name: 'View Scan History', icon: Clock, tab: 'history' },
              { name: 'Generate Reports', icon: BarChart4, tab: 'reports' }
            ].map((action, index) => (
              <Button 
                key={index} 
                variant="outline" 
                className="h-auto py-6 flex flex-col items-center text-center gap-2 hover-scale-sm backdrop-blur-sm bg-background/10 border-fuzzer-primary/30 hover:bg-fuzzer-primary/10 hover:border-fuzzer-primary/50 transition-all"
                onClick={() => {
                  toast.info(`Navigating to ${action.name}`);
                  onTabChange(action.tab);
                }}
              >
                <action.icon className="h-6 w-6 text-fuzzer-primary" />
                <span className="text-sm">{action.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-fuzzer-primary/20 bg-card/30 neo-blur hover-scale-sm transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl font-bold">
              <Cpu className="mr-2 h-6 w-6 text-fuzzer-primary" />
              System Status
            </CardTitle>
            <CardDescription>
              Real-time monitoring dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center justify-center">
              <TechnicalLoader size="lg" className="my-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background/40 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">CPU Usage</div>
                <div className="text-lg font-bold">{Math.floor(Math.random() * 30) + 40}%</div>
                <div className="h-1.5 w-full bg-secondary relative overflow-hidden rounded-full mt-1">
                  <div 
                    className="absolute top-0 left-0 h-full bg-fuzzer-primary"
                    style={{ width: `${Math.floor(Math.random() * 30) + 40}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-background/40 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Memory</div>
                <div className="text-lg font-bold">{Math.floor(Math.random() * 20) + 30}%</div>
                <div className="h-1.5 w-full bg-secondary relative overflow-hidden rounded-full mt-1">
                  <div 
                    className="absolute top-0 left-0 h-full bg-green-500"
                    style={{ width: `${Math.floor(Math.random() * 20) + 30}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-fuzzer-primary/20 bg-card/30 neo-blur hover-scale-sm transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl font-bold">
              <Gauge className="mr-2 h-6 w-6 text-fuzzer-primary" />
              Security Metrics
            </CardTitle>
            <CardDescription>
              Your current security posture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">A+</div>
                <div className="text-xs text-muted-foreground">Overall Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{Math.floor(Math.random() * 20) + 80}%</div>
                <div className="text-xs text-muted-foreground">Protection Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-500">{Math.floor(Math.random() * 6) + 3}</div>
                <div className="text-xs text-muted-foreground">Detected Risks</div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full bg-background/10"
              onClick={() => {
                toast.info("Generating security report");
                onTabChange('reports');
              }}
            >
              Run Comprehensive Analysis
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomeTab;
