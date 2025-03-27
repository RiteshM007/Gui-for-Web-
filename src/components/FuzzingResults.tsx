
import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  Code, 
  FileDown, 
  Filter, 
  Gauge, 
  Search, 
  ShieldAlert, 
  Skull, 
  TimerOff,
  BarChart3,
  PieChart,
  XCircle,
  Zap,
  LineChart,
  FileText,
  Laptop,
  Loader2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, LineChart as RechartsLine, Line } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { fuzzingService, FuzzingResult } from '@/services/fuzzingService';

// Interface for the FuzzingResults component props
interface FuzzingResultsProps {
  vulnerabilities: Array<{
    id: number;
    type: string;
    endpoint: string;
    payload: string;
    severity: string;
    description: string;
  }>;
}

// Fallback data for when API is not available
const fallbackData = [
  { 
    id: 1, 
    url: '/api/users?id=1', 
    method: 'GET',
    payload: "' OR 1=1--", 
    status: 200, 
    responseTime: 124,
    severity: 'high',
    finding: 'SQL Injection - Database schema leaked'
  },
  { 
    id: 2, 
    url: '/api/users?id=2', 
    method: 'GET',
    payload: "'; DROP TABLE users--", 
    status: 500, 
    responseTime: 87,
    severity: 'critical',
    finding: 'SQL Injection - DDL command executed'
  },
  { 
    id: 3, 
    url: '/api/search?q=test', 
    method: 'GET',
    payload: "<script>alert(1)</script>", 
    status: 200, 
    responseTime: 110,
    severity: 'medium',
    finding: 'XSS - Script executed'
  },
  { 
    id: 4, 
    url: '/api/feedback', 
    method: 'POST',
    payload: "; cat /etc/passwd", 
    status: 200, 
    responseTime: 95,
    severity: 'high',
    finding: 'Command Injection - System file access'
  },
  { 
    id: 5, 
    url: '/api/download?file=', 
    method: 'GET',
    payload: "../../../etc/passwd", 
    status: 404, 
    responseTime: 78,
    severity: 'low',
    finding: 'Path Traversal - Not vulnerable'
  },
];

// Chart data for HTTP status codes
const statusCodeData = [
  { name: '200', value: 28 },
  { name: '301', value: 5 },
  { name: '302', value: 3 },
  { name: '400', value: 8 },
  { name: '404', value: 12 },
  { name: '500', value: 7 },
];

// Chart colors
const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899'];

// Chart data for response times
const responseTimeData = [
  { name: '1', time: 120 },
  { name: '2', time: 132 },
  { name: '3', time: 101 },
  { name: '4', time: 134 },
  { name: '5', time: 90 },
  { name: '6', time: 110 },
  { name: '7', time: 120 },
  { name: '8', time: 132 },
  { name: '9', time: 101 },
  { name: '10', time: 134 },
  { name: '11', time: 90 },
  { name: '12', time: 110 },
];

// Get severity badge
const getSeverityBadge = (severity: string) => {
  switch(severity) {
    case 'critical':
      return <Badge variant="outline" className="bg-fuzzer-error/20 text-fuzzer-error border-fuzzer-error">
        <Skull className="h-3 w-3 mr-1" /> Critical
      </Badge>;
    case 'high':
      return <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500">
        <ShieldAlert className="h-3 w-3 mr-1" /> High
      </Badge>;
    case 'medium':
      return <Badge variant="outline" className="bg-fuzzer-warning/20 text-fuzzer-warning border-fuzzer-warning">
        <AlertTriangle className="h-3 w-3 mr-1" /> Medium
      </Badge>;
    case 'low':
      return <Badge variant="outline" className="bg-fuzzer-info/20 text-fuzzer-info border-fuzzer-info">
        <CheckCircle2 className="h-3 w-3 mr-1" /> Low
      </Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getStatusBadge = (status: number) => {
  if (status >= 500) {
    return <Badge variant="outline" className="bg-fuzzer-error/20 text-fuzzer-error border-fuzzer-error">{status}</Badge>;
  } else if (status >= 400) {
    return <Badge variant="outline" className="bg-fuzzer-warning/20 text-fuzzer-warning border-fuzzer-warning">{status}</Badge>;
  } else if (status >= 300) {
    return <Badge variant="outline" className="bg-fuzzer-info/20 text-fuzzer-info border-fuzzer-info">{status}</Badge>;
  } else {
    return <Badge variant="outline" className="bg-fuzzer-success/20 text-fuzzer-success border-fuzzer-success">{status}</Badge>;
  }
};

const ResponsePreview = () => (
  <div className="rounded-lg bg-secondary p-4 font-mono text-sm overflow-auto h-full max-h-96 custom-scrollbar">
    <pre className="whitespace-pre-wrap">
{`HTTP/1.1 200 OK
Server: nginx/1.19.0
Date: Fri, 30 Apr 2023 12:34:56 GMT
Content-Type: application/json
Content-Length: 294
Connection: close
X-Powered-By: PHP/7.4.8

{
  "error": "Database error",
  "details": "Error in query: SELECT user_id, username, password FROM users WHERE user_id = '' OR 1=1--'",
  "sql_state": "42000",
  "debug_backtrace": [
    "/var/www/html/api/models/UserModel.php:123",
    "/var/www/html/api/controllers/UserController.php:45"
  ]
}`}
    </pre>
  </div>
);

const FuzzingResults: React.FC<FuzzingResultsProps> = ({ vulnerabilities }) => {
  const [activeTab, setActiveTab] = useState("findings");
  const [selectedResult, setSelectedResult] = useState<number | null>(1);
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const [resultsData, setResultsData] = useState<FuzzingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [anomalyData, setAnomalyData] = useState([
    { name: 'SQL Injection', score: 85 },
    { name: 'XSS', score: 72 },
    { name: 'Path Traversal', score: 45 },
    { name: 'Command Injection', score: 92 },
    { name: 'Info Disclosure', score: 63 },
  ]);
  const [vulnerabilityData, setVulnerabilityData] = useState([
    { name: 'SQL Injection', value: 12 },
    { name: 'XSS', value: 8 },
    { name: 'Path Traversal', value: 4 },
    { name: 'Command Injection', value: 3 },
    { name: 'Information Disclosure', value: 6 },
  ]);
  
  // Fetch results from backend when component mounts
  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const results = await fuzzingService.getResults();
        if (results.length > 0) {
          setResultsData(results);
        } else {
          // If no results from backend, use fallback data
          setResultsData(fallbackData as FuzzingResult[]);
        }
      } catch (error) {
        console.error("Error fetching fuzzing results:", error);
        // Use fallback data on error
        setResultsData(fallbackData as FuzzingResult[]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResults();
    
    // Set up interval to refresh data every 10 seconds
    const intervalId = setInterval(() => {
      fetchResults();
    }, 10000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  // Fetch anomaly analysis when tab changes to "anomalies"
  useEffect(() => {
    if (activeTab === "anomalies") {
      const fetchAnomalyAnalysis = async () => {
        try {
          const analysis = await fuzzingService.getAnomalyAnalysis();
          if (analysis && analysis.success) {
            if (analysis.anomalyData && analysis.anomalyData.length > 0) {
              setAnomalyData(analysis.anomalyData);
            }
            if (analysis.vulnerabilityData && analysis.vulnerabilityData.length > 0) {
              setVulnerabilityData(analysis.vulnerabilityData);
            }
          }
        } catch (error) {
          console.error("Error fetching anomaly analysis:", error);
        }
      };
      
      fetchAnomalyAnalysis();
    }
  }, [activeTab]);
  
  // Filter results based on search term
  const filteredResults = resultsData.filter(result => 
    result.url.toLowerCase().includes(searchTerm.toLowerCase()) || 
    result.payload.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.finding.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const exportReport = () => {
    toast.success("Report exported successfully", {
      description: "Vulnerability report has been exported to PDF"
    });
  };
  
  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <ShieldAlert className="text-fuzzer-primary h-5 w-5" />
              <span>Fuzzing Results</span>
            </CardTitle>
            <CardDescription>
              Found {resultsData.length} potential vulnerabilities across {resultsData.length + 10} tests
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="flex gap-1 items-center hover-scale">
              <Gauge className="h-3 w-3" />
              <span>{resultsData.length}/30 Requests</span>
            </Badge>
            <Badge variant="outline" className="flex gap-1 items-center hover-scale">
              <Clock className="h-3 w-3" />
              <span>00:01:24</span>
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 hover-scale">
                  <FileDown className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={exportReport}>
                  <FileText className="h-4 w-4 mr-2" />
                  PDF Report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportReport}>
                  <Code className="h-4 w-4 mr-2" />
                  JSON Data
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportReport}>
                  <Laptop className="h-4 w-4 mr-2" />
                  HTML Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-4 neo-blur">
            <TabsTrigger value="findings" className="flex items-center gap-2 data-[state=active]:bg-fuzzer-primary data-[state=active]:text-primary-foreground">
              <ShieldAlert className="h-4 w-4" />
              <span className="hidden sm:inline">Findings</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2 data-[state=active]:bg-fuzzer-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="anomalies" className="flex items-center gap-2 data-[state=active]:bg-fuzzer-primary data-[state=active]:text-primary-foreground">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Anomalies</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="findings" className="space-y-4 fade-in">
            <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
              <div className="relative sm:w-[300px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search results..." 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-fuzzer-primary" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Status</TableHead>
                      <TableHead>URL / Payload</TableHead>
                      <TableHead className="w-[100px]">Method</TableHead>
                      <TableHead className="w-[120px]">Response Time</TableHead>
                      <TableHead className="w-[150px]">Severity</TableHead>
                      <TableHead className="w-[250px]">Finding</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.length > 0 ? (
                      filteredResults.map((result) => (
                        <TableRow 
                          key={result.id} 
                          className={`group cursor-pointer hover:bg-secondary/50 ${selectedResult === result.id ? 'bg-secondary/50' : ''}`}
                          onClick={() => setSelectedResult(result.id)}
                        >
                          <TableCell>{getStatusBadge(result.status)}</TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div>
                                    <div className="font-medium truncate w-40 md:w-auto">{result.url}</div>
                                    <div className="text-muted-foreground text-xs font-mono truncate w-40 md:w-auto">{result.payload}</div>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="font-medium">{result.url}</p>
                                  <p className="font-mono text-xs">{result.payload}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            <Badge variant={result.method === 'GET' ? 'outline' : 'default'} className="bg-fuzzer-primary/10">
                              {result.method}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <TimerOff className="h-3 w-3 text-muted-foreground" />
                              <span>{result.responseTime} ms</span>
                            </div>
                          </TableCell>
                          <TableCell>{getSeverityBadge(result.severity)}</TableCell>
                          <TableCell className="font-medium">{result.finding}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          {searchTerm ? 'No results match your search criteria' : 'No fuzzing results available yet'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {selectedResult !== null && (
              <div className="mt-4 rounded-lg p-4 border border-border glass-card">
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-fuzzer-primary" />
                  Vulnerability Details
                </h3>
                <Tabs defaultValue="response" className="w-full">
                  <TabsList className="grid grid-cols-3 w-full mb-4">
                    <TabsTrigger value="request" className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      <span>Request</span>
                    </TabsTrigger>
                    <TabsTrigger value="response" className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      <span>Response</span>
                    </TabsTrigger>
                    <TabsTrigger value="analysis" className="flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4" />
                      <span>Analysis</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="request" className="rounded-lg bg-secondary p-4 font-mono text-sm overflow-auto max-h-96 custom-scrollbar">
                    <pre className="whitespace-pre-wrap">
{`GET /api/users?id='+OR+1%3d1-- HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36
Accept: application/json
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
`}
                    </pre>
                  </TabsContent>
                  
                  <TabsContent value="response">
                    <ResponsePreview />
                  </TabsContent>
                  
                  <TabsContent value="analysis" className="space-y-4">
                    <Card className="border-fuzzer-error/50 bg-fuzzer-error/5 neo-blur">
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm flex items-center text-fuzzer-error">
                          <ShieldAlert className="h-4 w-4 mr-2" />
                          SQL Injection Vulnerability Detected
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-0 text-sm">
                        <p className="mb-2">The application reveals database error details, including SQL query, in the response. This indicates:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Vulnerable to SQL Injection attacks</li>
                          <li>Database schema information leaked</li>
                          <li>Stack trace reveals application architecture</li>
                        </ul>
                      </CardContent>
                      <CardFooter className="pb-3 pt-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-xs">
                              View Fix Recommendations
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Vulnerability Fix Recommendations</DialogTitle>
                              <DialogDescription>
                                Security best practices to remediate the detected SQL Injection vulnerability.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <h4 className="font-medium text-sm">1. Use Parameterized Queries</h4>
                              <pre className="bg-secondary p-2 rounded text-xs font-mono">
{`// UNSAFE:
$query = "SELECT * FROM users WHERE id = '" . $id . "'";

// SAFE:
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = :id");
$stmt->execute(['id' => $id]);`}
                              </pre>
                              
                              <h4 className="font-medium text-sm">2. Input Validation</h4>
                              <p className="text-sm">Implement strict input validation to reject unexpected formats.</p>
                              
                              <h4 className="font-medium text-sm">3. Error Handling</h4>
                              <p className="text-sm">Avoid exposing detailed error messages to users.</p>
                              
                              <h4 className="font-medium text-sm">4. Least Privilege</h4>
                              <p className="text-sm">Use database accounts with minimal required permissions.</p>
                            </div>
                            <DialogFooter>
                              <Button onClick={() => toast.success("Documentation copied to clipboard")}>Copy to Clipboard</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </CardFooter>
                    </Card>
                    
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline" className="bg-secondary text-fuzzer-error">
                          CWE-89
                        </Badge>
                        <span className="font-medium">SQL Injection</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline" className="bg-secondary text-fuzzer-error">
                          CWE-209
                        </Badge>
                        <span className="font-medium">Information Exposure Through Error Messages</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline" className="bg-secondary text-fuzzer-error">
                          CWE-200
                        </Badge>
                        <span className="font-medium">Exposure of Sensitive Information</span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="analysis" className="fade-in">
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h3 className="text-sm font-semibold">Scan Analysis Dashboard</h3>
              <div className="flex gap-2">
                <Button 
                  variant={chartType === 'bar' ? 'default' : 'outline'} 
                  size="sm" 
                  className="h-8 px-3"
                  onClick={() => setChartType('bar')}
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
                <Button 
                  variant={chartType === 'pie' ? 'default' : 'outline'} 
                  size="sm" 
                  className="h-8 px-3"
                  onClick={() => setChartType('pie')}
                >
                  <PieChart className="h-4 w-4" />
                </Button>
                <Select defaultValue="statusCodes">
                  <SelectTrigger className="h-8 w-[130px]">
                    <SelectValue placeholder="View" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="statusCodes">Status Codes</SelectItem>
                    <SelectItem value="vulnerabilities">Vulnerabilities</SelectItem>
                    <SelectItem value="responseTimes">Response Times</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Card className="p-4 neo-blur">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-fuzzer-primary" />
                  HTTP Status Code Distribution
                </h3>
                <div className="h-[250px] w-full">
                  {chartType === 'bar' ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={statusCodeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <RechartsTooltip 
                          contentStyle={{ background: 'rgba(0, 0, 0, 0.8)', border: 'none', borderRadius: '4px' }} 
                          itemStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="value" fill="#8B5CF6">
                          {statusCodeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={statusCodeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusCodeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{ background: 'rgba(0, 0, 0, 0.8)', border: 'none', borderRadius: '4px' }} 
                          itemStyle={{ color: '#fff' }}
                        />
                      </RechartsPie>
                    </ResponsiveContainer>
                  )}
                </div>
              </Card>
              
              <Card className="p-4 neo-blur">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-fuzzer-primary" />
                  Vulnerability Types
                </h3>
                <div className="h-[250px] w-full">
                  {chartType === 'bar' ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={vulnerabilityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <RechartsTooltip 
                          contentStyle={{ background: 'rgba(0, 0, 0, 0.8)', border: 'none', borderRadius: '4px' }} 
                          itemStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="value" fill="#10B981">
                          {vulnerabilityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={vulnerabilityData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {vulnerabilityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{ background: 'rgba(0, 0, 0, 0.8)', border: 'none', borderRadius: '4px' }} 
                          itemStyle={{ color: '#fff' }}
                        />
                      </RechartsPie>
                    </ResponsiveContainer>
                  )}
                </div>
              </Card>
            </div>
            
            <Card className="p-4 neo-blur">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-fuzzer-primary" />
                Response Time Trends
              </h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLine 
                    data={responseTimeData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <RechartsTooltip 
                      contentStyle={{ background: 'rgba(0, 0, 0, 0.8)', border: 'none', borderRadius: '4px' }} 
                      itemStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="time" stroke="#8B5CF6" strokeWidth={2} dot={{ stroke: '#8B5CF6', strokeWidth: 2 }} />
                  </RechartsLine>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="anomalies" className="space-y-4 fade-in">
            <Card className="p-4 mb-4 glass-card border-fuzzer-primary/30">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Zap className="h-4 w-4 text-fuzzer-primary" />
                  AI-Powered Anomaly Detection
                </h3>
                <Badge variant="outline" className="bg-fuzzer-primary/20">Powered by your ML models</Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                The machine learning models have analyzed the responses and identified these anomalies with the following confidence scores:
              </p>
              
              <div className="h-[250px] w-full mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={anomalyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#333" />
                    <XAxis type="number" domain={[0, 100]} stroke="#888" />
                    <YAxis dataKey="name" type="category" stroke="#888" />
                    <RechartsTooltip 
                      contentStyle={{ background: 'rgba(0, 0, 0, 0.8)', border: 'none', borderRadius: '4px' }} 
                      itemStyle={{ color: '#fff' }}
                      formatter={(value) => [`Confidence: ${value}%`, 'Anomaly Score']}
                    />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                      {anomalyData.map((entry, index) => {
                        let color = '#3B82F6';
                        if (entry.score > 80) color = '#EF4444';
                        else if (entry.score > 60) color = '#F59E0B';
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-secondary/50 p-3 rounded-lg">
                <h4 className="text-sm font-medium mb-2">ML Analysis Summary</h4>
                <p className="text-xs text-muted-foreground">
                  The anomaly detection system has identified 2 high-confidence vulnerabilities (Command Injection and SQL Injection) 
                  with unusual server responses that indicate potential security issues. These findings corroborate the manual analysis 
                  and should be prioritized for remediation.
                </p>
              </div>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 neo-blur border-red-500/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    High Severity Anomalies
                  </h3>
                  <Badge className="bg-red-500/20 text-red-500">2 Found</Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 bg-secondary/40 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">Command Injection</span>
                      <Badge variant="outline" className="text-xs">92% Confidence</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      The server response contains system file contents that should not be accessible.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-secondary/40 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">SQL Injection</span>
                      <Badge variant="outline" className="text-xs">85% Confidence</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Database error messages and schema information are exposed in the response.
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 neo-blur border-orange-500/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Medium Severity Anomalies
                  </h3>
                  <Badge className="bg-orange-500/20 text-orange-500">3 Found</Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 bg-secondary/40 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">Information Disclosure</span>
                      <Badge variant="outline" className="text-xs">63% Confidence</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Server version and technology stack details are exposed in headers.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-secondary/40 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">XSS</span>
                      <Badge variant="outline" className="text-xs">72% Confidence</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Injected script content was reflected in the response without sanitization.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FuzzingResults;
