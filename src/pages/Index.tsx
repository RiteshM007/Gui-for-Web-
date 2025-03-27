
import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import FuzzingControls from "@/components/FuzzingControls";
import FuzzingResults from "@/components/FuzzingResults";
import HomeTab from "@/components/Home/HomeTab";
import { ScrollArea } from "@/components/ui/scroll-area";
import AppMetrics from '@/components/AppMetrics';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  
  // Mock data for the fuzzing results
  const [isScanning, setIsScanning] = useState(false);
  const [scanMetrics, setScanMetrics] = useState({
    totalRequests: 0,
    successRate: 0,
    errorRate: 0,
    avgResponseTime: 0,
    elapsedTime: '00:00:00'
  });
  
  const [responseCodes, setResponseCodes] = useState({
    '200': 0,
    '404': 0,
    '500': 0,
    '403': 0,
    'other': 0
  });
  
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab />;
      case 'fuzzer':
        return (
          <div className="space-y-6 p-6">
            <FuzzingControls 
              isScanning={isScanning} 
              setIsScanning={setIsScanning}
              scanMetrics={scanMetrics}
              setScanMetrics={setScanMetrics}
              responseCodes={responseCodes}
              setResponseCodes={setResponseCodes}
            />
            <FuzzingResults 
              isScanning={isScanning}
              scanMetrics={scanMetrics}
              responseCodes={responseCodes}
            />
          </div>
        );
      case 'metrics':
        return (
          <div className="space-y-6 p-6">
            <AppMetrics isLive={true} />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-6">
              <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
              <p className="text-muted-foreground">
                This feature is currently under development. Please check back later.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen} 
          closeSidebar={() => setSidebarOpen(false)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <ScrollArea className="flex-1">
          <main className="flex-1 mt-14 lg:ml-64">
            {renderActiveTab()}
          </main>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Index;
