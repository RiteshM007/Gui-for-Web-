
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Network, 
  Plus, 
  Search, 
  MoreVertical, 
  Check, 
  Edit, 
  Trash, 
  Link,
  ExternalLink,
  Eye,
  Lock,
  Filter
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
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// Mock data for API endpoints
const mockEndpoints = [
  { 
    id: 1, 
    url: 'https://example.com/api/users', 
    method: 'GET', 
    description: 'Get all users', 
    status: 'active',
    lastTested: '2023-05-10T10:30:00',
    vulnerabilities: 2
  },
  { 
    id: 2, 
    url: 'https://example.com/api/users/:id', 
    method: 'GET', 
    description: 'Get user by ID', 
    status: 'active',
    lastTested: '2023-05-12T14:20:00',
    vulnerabilities: 1
  },
  { 
    id: 3, 
    url: 'https://example.com/api/users', 
    method: 'POST', 
    description: 'Create new user', 
    status: 'active',
    lastTested: '2023-05-11T09:15:00',
    vulnerabilities: 0
  },
  { 
    id: 4, 
    url: 'https://example.com/api/users/:id', 
    method: 'PUT', 
    description: 'Update user by ID', 
    status: 'inactive',
    lastTested: '2023-05-09T16:45:00',
    vulnerabilities: 0
  },
  { 
    id: 5, 
    url: 'https://example.com/api/users/:id', 
    method: 'DELETE', 
    description: 'Delete user by ID', 
    status: 'active',
    lastTested: '2023-05-10T11:50:00',
    vulnerabilities: 1
  },
];

const ApiEndpoints = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [endpoints, setEndpoints] = useState(mockEndpoints);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedEndpoint, setSelectedEndpoint] = useState<number | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newEndpoint, setNewEndpoint] = useState({
    url: '',
    method: 'GET',
    description: ''
  });

  // Filter endpoints based on search term
  const filteredEndpoints = endpoints.filter(endpoint => 
    endpoint.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.method.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to handle the scan button click
  const handleScan = (endpointId?: number) => {
    setIsScanning(true);
    setScanProgress(0);

    if (endpointId) {
      setSelectedEndpoint(endpointId);
      toast.info(`Scanning endpoint ${endpoints.find(e => e.id === endpointId)?.url}`);
    } else {
      toast.info(`Scanning all endpoints`);
    }

    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          
          if (endpointId) {
            toast.success(`Scan completed for endpoint #${endpointId}`);
          } else {
            toast.success(`Scan completed for all endpoints`);
          }
          
          // Update endpoints with new last tested date
          setEndpoints(prev => prev.map(endpoint => 
            endpointId ? (endpoint.id === endpointId ? {...endpoint, lastTested: new Date().toISOString()} : endpoint)
            : {...endpoint, lastTested: new Date().toISOString()}
          ));
          
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  // Function to handle adding a new endpoint
  const handleAddEndpoint = () => {
    const id = Math.max(...endpoints.map(e => e.id)) + 1;
    const newEndpointData = {
      id,
      ...newEndpoint,
      status: 'active',
      lastTested: '-',
      vulnerabilities: 0
    };
    
    setEndpoints([...endpoints, newEndpointData]);
    setShowAddDialog(false);
    setNewEndpoint({ url: '', method: 'GET', description: '' });
    toast.success("Endpoint added successfully");
  };

  // Function to toggle endpoint status
  const toggleEndpointStatus = (id: number) => {
    setEndpoints(prev => prev.map(endpoint => 
      endpoint.id === id 
        ? {...endpoint, status: endpoint.status === 'active' ? 'inactive' : 'active'} 
        : endpoint
    ));
    
    const status = endpoints.find(e => e.id === id)?.status === 'active' ? 'inactive' : 'active';
    toast.success(`Endpoint status changed to ${status}`);
  };

  // Function to delete endpoint
  const deleteEndpoint = (id: number) => {
    setEndpoints(prev => prev.filter(endpoint => endpoint.id !== id));
    toast.success("Endpoint deleted successfully");
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
                <h1 className="text-2xl font-bold tracking-tight">API Endpoints</h1>
                <p className="text-muted-foreground">
                  Manage and test your API endpoints for vulnerabilities
                </p>
              </div>
              
              <div className="flex gap-2 w-full md:w-auto justify-end">
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-fuzzer-primary hover:bg-fuzzer-secondary flex gap-2">
                      <Plus className="h-4 w-4" />
                      <span>Add Endpoint</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Endpoint</DialogTitle>
                      <DialogDescription>
                        Enter the details of the API endpoint you want to add.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label htmlFor="url">URL</label>
                        <Input 
                          id="url" 
                          value={newEndpoint.url} 
                          onChange={(e) => setNewEndpoint({...newEndpoint, url: e.target.value})}
                          placeholder="https://example.com/api/endpoint"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="method">HTTP Method</label>
                        <select 
                          id="method"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={newEndpoint.method}
                          onChange={(e) => setNewEndpoint({...newEndpoint, method: e.target.value})}
                        >
                          <option value="GET">GET</option>
                          <option value="POST">POST</option>
                          <option value="PUT">PUT</option>
                          <option value="DELETE">DELETE</option>
                          <option value="PATCH">PATCH</option>
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="description">Description</label>
                        <Input 
                          id="description" 
                          value={newEndpoint.description} 
                          onChange={(e) => setNewEndpoint({...newEndpoint, description: e.target.value})}
                          placeholder="Describe what this endpoint does"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                      <Button onClick={handleAddEndpoint}>Add Endpoint</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="outline"
                  className="gap-2"
                  onClick={() => handleScan()}
                  disabled={isScanning}
                >
                  <Network className="h-4 w-4" />
                  <span>Scan All</span>
                </Button>
              </div>
            </div>
            
            {/* Search and filter */}
            <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
              <div className="relative sm:w-[300px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search endpoints..." 
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
            
            {/* Scan progress if scanning */}
            {isScanning && (
              <div className="bg-secondary/40 neo-blur p-3 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Scanning {selectedEndpoint ? `Endpoint #${selectedEndpoint}` : 'All Endpoints'}</span>
                  <span className="text-sm font-mono">{Math.floor(scanProgress)}%</span>
                </div>
                <Progress value={scanProgress} className="h-2" />
              </div>
            )}
            
            {/* Endpoints table */}
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center space-x-2">
                  <Network className="text-fuzzer-primary h-5 w-5" />
                  <span>API Endpoints</span>
                </CardTitle>
                <CardDescription>
                  {filteredEndpoints.length} endpoints configured
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">Method</TableHead>
                        <TableHead>URL / Description</TableHead>
                        <TableHead className="w-[120px]">Status</TableHead>
                        <TableHead className="w-[150px]">Last Tested</TableHead>
                        <TableHead className="w-[120px]">Vulnerabilities</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEndpoints.map((endpoint) => (
                        <TableRow key={endpoint.id} className="group">
                          <TableCell>
                            <Badge variant={endpoint.method === 'GET' ? 'outline' : 'default'} className={`
                              ${endpoint.method === 'GET' ? 'bg-blue-500/10 text-blue-500' : ''}
                              ${endpoint.method === 'POST' ? 'bg-green-500/80 text-white' : ''}
                              ${endpoint.method === 'PUT' ? 'bg-yellow-500/80 text-white' : ''}
                              ${endpoint.method === 'DELETE' ? 'bg-red-500/80 text-white' : ''}
                            `}>
                              {endpoint.method}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium truncate w-40 md:w-auto">{endpoint.url}</div>
                            <div className="text-muted-foreground text-xs truncate w-40 md:w-auto">{endpoint.description}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`
                              ${endpoint.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}
                            `}>
                              {endpoint.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {endpoint.lastTested === '-' ? '-' : new Date(endpoint.lastTested).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={endpoint.vulnerabilities > 0 ? 'default' : 'outline'} className={`
                              ${endpoint.vulnerabilities > 0 ? 'bg-red-500/80' : 'bg-gray-500/10 text-gray-500'}
                            `}>
                              {endpoint.vulnerabilities}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="size-8"
                                onClick={() => handleScan(endpoint.id)}
                                disabled={isScanning}
                              >
                                <Network className="h-4 w-4" />
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
                                  <DropdownMenuItem onClick={() => window.open(endpoint.url, '_blank')}>
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Open URL
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => toggleEndpointStatus(endpoint.id)}>
                                    {endpoint.status === 'active' ? (
                                      <>
                                        <Lock className="h-4 w-4 mr-2" />
                                        Disable
                                      </>
                                    ) : (
                                      <>
                                        <Check className="h-4 w-4 mr-2" />
                                        Enable
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-red-500"
                                    onClick={() => deleteEndpoint(endpoint.id)}
                                  >
                                    <Trash className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApiEndpoints;
