
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart, FileText, Download, Share2, Filter } from 'lucide-react';

const Reports = () => {
  const mockReports = [
    {
      id: 1,
      name: "Vulnerability Scan Report",
      date: "2023-10-15",
      type: "Full Scan",
      findings: 12,
      severity: "High"
    },
    {
      id: 2,
      name: "Weekly Security Assessment",
      date: "2023-10-08",
      type: "Incremental",
      findings: 4,
      severity: "Medium"
    },
    {
      id: 3,
      name: "API Endpoint Analysis",
      date: "2023-10-01",
      type: "Targeted",
      findings: 8,
      severity: "Low"
    }
  ];

  return (
    <div className="container py-6 max-w-6xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">View and manage your security scan reports</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button className="gap-1 bg-fuzzer-primary hover:bg-fuzzer-secondary transition-colors duration-200">
            <FileText className="h-4 w-4" />
            <span>Generate Report</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-4 bg-background/50 backdrop-blur-sm">
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="vulnerability">Vulnerability</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {mockReports.map(report => (
            <Card key={report.id} className="overflow-hidden hover-scale neo-blur">
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <div>
                    <CardTitle className="text-xl">{report.name}</CardTitle>
                    <CardDescription>Generated on {report.date}</CardDescription>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    report.severity === "High" ? "bg-red-500/20 text-red-400" :
                    report.severity === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-green-500/20 text-green-400"
                  }`}>
                    {report.severity} Risk
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="text-muted-foreground">Report Type:</span> {report.type}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Findings:</span> {report.findings}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span> <span className="text-green-400">Completed</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border pt-3 flex justify-between">
                <div className="flex items-center text-xs text-muted-foreground">
                  <BarChart className="h-4 w-4 mr-1" />
                  <span>View Details</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-8">
                    <Download className="h-4 w-4 mr-1" />
                    <span>Export</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="vulnerability">
          <div className="h-40 flex items-center justify-center border border-dashed rounded-lg">
            <p className="text-muted-foreground">Vulnerability reports will appear here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="performance">
          <div className="h-40 flex items-center justify-center border border-dashed rounded-lg">
            <p className="text-muted-foreground">Performance reports will appear here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="security">
          <div className="h-40 flex items-center justify-center border border-dashed rounded-lg">
            <p className="text-muted-foreground">Security reports will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
