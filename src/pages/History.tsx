
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  History as HistoryIcon, 
  Search, 
  MoreVertical, 
  FileText, 
  Trash, 
  Clock,
  Calendar,
  ArrowDownUp,
  Filter,
  ChevronRight,
  Target,
  ShieldAlert,
  Download
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

// Mock data for scan history
const mockHistory = [
  { 
    id: 1, 
    targetUrl: 'https://example.com/api', 
    timestamp: '2023-05-15T14:30:00',
    duration: '00:03:45',
    requestCount: 150,
    vulnerabilities: 3,
    status: 'completed'
  },
  { 
    id: 2, 
    targetUrl: 'https://testapp.io/login', 
    timestamp: '2023-05-14T10:15:00',
    duration: '00:05:22',
    requestCount: 225,
    vulnerabilities: 1,
    status: 'completed'
  },
  { 
    id: 3, 
    targetUrl: 'https://demo-site.com/users', 
    timestamp: '2023-05-12T16:40:00',
    duration: '00:02:18',
    requestCount: 98,
    vulnerabilities: 0,
    status: 'completed'
  },
  { 
    id: 4, 
    targetUrl: 'https://example.org/checkout', 
    timestamp: '2023-05-11T09:20:00',
    duration: '00:04:55',
    requestCount: 180,
    vulnerabilities: 2,
    status: 'completed'
  },
  { 
    id: 5, 
    targetUrl: 'https://test-api.com/products', 
    timestamp: '2023-05-10T13:10:00',
    duration: '00:03:05',
    requestCount: 120,
    vulnerabilities: 1,
    status: 'completed'
  },
];

// Chart data for scan activity
const activityData = [
  { date: 'May 10', scans: 3, vulnerabilities: 2 },
  { date: 'May 11', scans: 2, vulnerabilities: 3 },
  { date: 'May 12', scans: 1, vulnerabilities: 0 },
  { date: 'May 13', scans: 0, vulnerabilities: 0 },
  { date: 'May 14', scans: 1, vulnerabilities: 1 },
  { date: 'May 15', scans: 3, vulnerabilities: 4 },
];

const History = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [history, setHistory] = useState(mockHistory);
  const [searchTerm, setSearchTerm] = useState('');
  const [showScanDetails, setShowScanDetails] = useState(false);
  const [selectedScan, setSelectedScan] = useState<typeof mockHistory[0] | null>(null);

  // Filter history based on search term
  const filteredHistory = history.filter(scan => 
    scan.targetUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to view scan details
  const viewScanDetails = (scan: typeof mockHistory[0]) => {
    setSelectedScan(scan);
    setShowScanDetails(true);
  };

  // Function to delete scan history
  const deleteScanHistory = (id: number) => {
    setHistory(prev => prev.filter(scan => scan.id !== id));
    toast.success("Scan history deleted successfully");
  };

  // Function to export scan report
  const exportScanReport = (id: number) => {
    toast.success(`Scan report #${id} exported successfully`);
  };

  // Function to clear all history
  const clearAllHistory = () => {
    setHistory([]);
    toast.success("All scan history cleared successfully");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
        
        <main className="flex-1 p-4 pt-6 lg:pl-[17rem] overflow-auto">
          <div className="max-w-[1200px] mx-auto space-y-6">
            <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Scan History</h1>
                <p className="text-muted-foreground">
                  View and manage your past fuzzing scan sessions
                </p>
              </div>
              
              <div className="flex gap-2 w-full md:w-auto justify-end">
                <Button 
                  variant="outline"
                  className="gap-2"
                  onClick={clearAllHistory}
                >
                  <Trash className="h-4 w-4" />
                  <span>Clear All</span>
                </Button>
                
                <Button 
                  variant="outline"
                  className="gap-2"
                  onClick={() => exportScanReport(0)}
                >
                  <Download className="h-4 w-4" />
                  <span>Export All</span>
                </Button>
              </div>
            </div>
            
            {/* Activity overview */}
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="text-fuzzer-primary h-5 w-5" />
                  <span>Scan Activity</span>
                </CardTitle>
                <CardDescription>
                  Recent scanning activity and vulnerability trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={activityData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" tick={{ fill: '#94A3B8' }} stroke="#4B5563" />
                      <YAxis tick={{ fill: '#94A3B8' }} stroke="#4B5563" />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '0.375rem' }}
                        labelStyle={{ color: '#E5E7EB' }}
                      />
                      <Bar name="Scans" dataKey="scans" fill="#8B5CF6" />
                      <Bar name="Vulnerabilities" dataKey="vulnerabilities" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Search and filter */}
            <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
              <div className="relative sm:w-[300px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search scans..." 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <ArrowDownUp className="h-4 w-4" />
                  <span>Sort</span>
                </Button>
              </div>
            </div>
            
            {/* History table */}
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center space-x-2">
                  <HistoryIcon className="text-fuzzer-primary h-5 w-5" />
                  <span>Scan History</span>
                </CardTitle>
                <CardDescription>
                  {filteredHistory.length} recorded scan sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Target URL</TableHead>
                        <TableHead className="w-[180px]">Timestamp</TableHead>
                        <TableHead className="w-[120px]">Duration</TableHead>
                        <TableHead className="w-[120px]">Requests</TableHead>
                        <TableHead className="w-[150px]">Vulnerabilities</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHistory.length > 0 ? (
                        filteredHistory.map((scan) => (
                          <TableRow key={scan.id} className="group">
                            <TableCell>
                              <div className="font-medium truncate w-40 md:w-auto">{scan.targetUrl}</div>
                            </TableCell>
                            <TableCell>
                              {new Date(scan.timestamp).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span>{scan.duration}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {scan.requestCount} requests
                            </TableCell>
                            <TableCell>
                              <Badge variant={scan.vulnerabilities > 0 ? 'default' : 'outline'} className={`
                                ${scan.vulnerabilities > 0 ? 'bg-red-500/80' : 'bg-gray-500/10 text-gray-500'}
                              `}>
                                {scan.vulnerabilities}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="size-8"
                                  onClick={() => viewScanDetails(scan)}
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="size-8">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => viewScanDetails(scan)}>
                                      <FileText className="h-4 w-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => exportScanReport(scan.id)}>
                                      <Download className="h-4 w-4 mr-2" />
                                      Export Report
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      className="text-red-500"
                                      onClick={() => deleteScanHistory(scan.id)}
                                    >
                                      <Trash className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            <div className="flex flex-col items-center gap-2">
                              <HistoryIcon className="h-8 w-8 text-muted-foreground/50" />
                              <p>No scan history found</p>
                              {searchTerm && (
                                <p className="text-sm">Try a different search term</p>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            {/* Scan details dialog */}
            <Dialog open={showScanDetails} onOpenChange={setShowScanDetails}>
              <DialogContent className="max-w-[700px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-fuzzer-primary" />
                    Scan Details
                  </DialogTitle>
                  <DialogDescription>
                    Details for scan on {selectedScan?.targetUrl}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Target</h4>
                    <p className="text-sm font-mono bg-secondary/30 p-2 rounded">{selectedScan?.targetUrl}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Timestamp</h4>
                    <p className="text-sm">{selectedScan?.timestamp ? new Date(selectedScan.timestamp).toLocaleString() : ''}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Duration</h4>
                    <p className="text-sm">{selectedScan?.duration}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Requests</h4>
                    <p className="text-sm">{selectedScan?.requestCount} requests sent</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-fuzzer-primary" />
                    Vulnerabilities Found
                  </h4>
                  
                  {selectedScan?.vulnerabilities === 0 ? (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-md p-3 text-sm">
                      No vulnerabilities were detected during this scan.
                    </div>
                  ) : (
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Endpoint</TableHead>
                            <TableHead>Severity</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* Example vulnerabilities */}
                          <TableRow>
                            <TableCell>SQL Injection</TableCell>
                            <TableCell className="font-mono text-xs">/api/users?id=1</TableCell>
                            <TableCell>
                              <Badge className="bg-red-500">High</Badge>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>XSS</TableCell>
                            <TableCell className="font-mono text-xs">/search?q=test</TableCell>
                            <TableCell>
                              <Badge className="bg-yellow-500">Medium</Badge>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowScanDetails(false)}>Close</Button>
                  <Button onClick={() => exportScanReport(selectedScan?.id || 0)}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
};

export default History;
