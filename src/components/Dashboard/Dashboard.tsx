import React, { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { fuzzingService, FuzzingResult } from "@/services/fuzzingService";
import ScanAnimation from './ScanAnimation';
import PayloadFeed from './PayloadFeed';
import ThreatGauge from './ThreatGauge';
import ScanControls from './ScanControls';
import ThreatLog from './ThreatLog';
import ScanMetrics from './ScanMetrics';
import SeverityChart from './SeverityChart';
import FuzzingControls from '../FuzzingControls';
import AntivirusScan from './AntivirusScan';
import { Shield, Zap } from 'lucide-react';

const Dashboard = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [scanMode, setScanMode] = useState('quick');
  const [threatLevel, setThreatLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [metrics, setMetrics] = useState({
    totalRequests: 0,
    successRate: 0,
    errorRate: 0,
    avgResponseTime: 0,
    startTime: null,
    elapsedTime: '00:00:00',
  });
  
  useEffect(() => {
    if (!isScanning || isPaused) return;
    
    let scanInterval;
    let updateInterval;
    let timerInterval;
    
    const startTime = metrics.startTime || new Date();
    
    timerInterval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - startTime.getTime();
      
      const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
      
      setMetrics(prev => ({
        ...prev,
        elapsedTime: `${hours}:${minutes}:${seconds}`
      }));
    }, 1000);
    
    scanInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        const levels: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
        const currentIndex = levels.indexOf(threatLevel);
        let newIndex;
        
        if (currentIndex === 0) {
          newIndex = Math.random() > 0.7 ? 1 : 0;
        } else if (currentIndex === 1) {
          newIndex = Math.random() > 0.5 ? 0 : 2;
        } else {
          newIndex = Math.random() > 0.7 ? 1 : 2;
        }
        
        setThreatLevel(levels[newIndex]);
      }
      
      if (Math.random() > 0.85) {
        const vulnTypes = ['SQL Injection', 'XSS', 'CSRF', 'Path Traversal', 'Command Injection'];
        const severities = ['low', 'medium', 'high', 'critical'];
        
        const newVuln = {
          id: Date.now(),
          type: vulnTypes[Math.floor(Math.random() * vulnTypes.length)],
          endpoint: `/api/endpoint${Math.floor(Math.random() * 10)}`,
          payload: `payload_${Math.floor(Math.random() * 100)}`,
          severity: severities[Math.floor(Math.random() * severities.length)],
          description: 'Potential vulnerability detected in response',
          timestamp: Date.now(),
          recommendation: 'Implement proper input validation and sanitization',
          details: 'The application appears vulnerable to injection attacks that could lead to unauthorized access or data leakage.',
        };
        
        setVulnerabilities(prev => [...prev, newVuln]);
        
        if (newVuln.severity === 'critical' || newVuln.severity === 'high') {
          toast(
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-500" />
              <span className="font-medium">High Risk Vulnerability Detected!</span>
            </div>,
            {
              description: `${newVuln.type} found at ${newVuln.endpoint}`,
              duration: 4000,
            }
          );
        }
      }
    }, 3000);
    
    updateInterval = setInterval(() => {
      setMetrics(prev => {
        const rateChange = (Math.random() * 4) - 2;
        const newSuccessRate = Math.max(0, Math.min(100, prev.successRate + (rateChange * 0.5)));
        const newErrorRate = 100 - newSuccessRate;
        
        return {
          ...prev,
          totalRequests: prev.totalRequests + Math.floor(Math.random() * 5) + 1,
          successRate: newSuccessRate,
          errorRate: newErrorRate,
          avgResponseTime: Math.max(50, Math.min(500, prev.avgResponseTime + ((Math.random() * 60) - 30))),
          startTime,
        };
      });
    }, 1000);
    
    return () => {
      clearInterval(scanInterval);
      clearInterval(updateInterval);
      clearInterval(timerInterval);
    };
  }, [isScanning, isPaused, threatLevel, metrics.startTime]);
  
  const handleStartScan = (mode) => {
    setIsScanning(true);
    setIsPaused(false);
    setScanMode(mode);
    setMetrics({
      totalRequests: 0,
      successRate: Math.random() * 20 + 70,
      errorRate: Math.random() * 20 + 10,
      avgResponseTime: Math.random() * 100 + 150,
      startTime: new Date(),
      elapsedTime: '00:00:00',
    });
    
    toast(
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-fuzzer-primary" />
        <span className="font-medium">Scan Started</span>
      </div>,
      {
        description: `Initiated ${mode === 'quick' ? 'Quick' : 'Deep'} scan mode`,
        duration: 3000,
      }
    );
    
    toast(
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-fuzzer-primary" />
        <span className="font-medium">Fuzzing Enabled</span>
      </div>,
      {
        description: "Target will be fuzzed during scanning",
        duration: 3000,
      }
    );
  };
  
  const handlePauseScan = () => {
    setIsPaused(true);
    toast("Scan paused", {
      description: "You can resume the scan at any time",
    });
  };
  
  const handleResumeScan = () => {
    setIsPaused(false);
    toast("Scan resumed", {
      description: "Continuing scan operation",
    });
  };
  
  const handleStopScan = () => {
    setIsScanning(false);
    setIsPaused(false);
    toast("Scan stopped", {
      description: "Scan has been terminated",
    });
  };
  
  const handleThreatFound = () => {
    if (Math.random() > 0.5 && isScanning) {
      if (threatLevel === 'low') {
        setThreatLevel('medium');
      } else if (threatLevel === 'medium' && Math.random() > 0.7) {
        setThreatLevel('high');
      }
    }
  };
  
  const handleChangeScanMode = (mode) => {
    setScanMode(mode);
    toast(`Scan mode changed to ${mode === 'quick' ? 'Quick Scan' : 'Deep Scan'}`);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold tracking-tight">Security Scanner & Fuzzer</h1>
      <p className="text-muted-foreground">
        Real-time monitoring and analysis of web application security testing
      </p>
      
      <div className="border border-border rounded-lg overflow-hidden frost-panel">
        <FuzzingControls onStartScan={() => handleStartScan(scanMode)} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ScanAnimation 
            isScanning={isScanning && !isPaused} 
            threatLevel={threatLevel}
            onThreatFound={handleThreatFound}
          />
        </div>
        
        <div>
          <PayloadFeed isScanning={isScanning && !isPaused} />
        </div>
        
        <div>
          <ThreatGauge 
            threatLevel={threatLevel} 
            vulnerabilitiesCount={vulnerabilities.length}
            isScanning={isScanning && !isPaused}
          />
        </div>
        
        <div>
          <ScanControls 
            isScanning={isScanning} 
            onStartScan={handleStartScan}
            onPauseScan={handlePauseScan}
            onResumeScan={handleResumeScan}
            onStopScan={handleStopScan}
            scanMode={scanMode}
            onChangeScanMode={handleChangeScanMode}
          />
        </div>
        
        <div>
          <SeverityChart vulnerabilities={vulnerabilities} />
        </div>
        
        <div className="lg:col-span-3">
          <ScanMetrics 
            metrics={metrics}
            isScanning={isScanning && !isPaused}
          />
        </div>
        
        {isScanning && (
          <div className="lg:col-span-3 border border-border rounded-lg p-4 frost-panel">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-fuzzer-primary" />
              Active Fuzzing Targets
            </h3>
            
            <div className="space-y-3">
              <div className="border border-border/50 rounded-md p-3 bg-background/20">
                <div className="flex justify-between items-center">
                  <div className="font-medium">example.com/api/users</div>
                  <div className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">In Progress</div>
                </div>
                <div className="text-sm text-muted-foreground mt-1">Parameter Fuzzing • SQL Injection • GET</div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="text-xs bg-background/40 px-2 py-1 rounded">Payloads: 42/100</div>
                  <div className="text-xs bg-background/40 px-2 py-1 rounded">Found: 3 issues</div>
                </div>
              </div>
              
              <div className="border border-border/50 rounded-md p-3 bg-background/20">
                <div className="flex justify-between items-center">
                  <div className="font-medium">example.com/api/products</div>
                  <div className="text-xs bg-amber-500/20 text-amber-500 px-2 py-1 rounded">Queued</div>
                </div>
                <div className="text-sm text-muted-foreground mt-1">Path Fuzzing • XSS • POST</div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="text-xs bg-background/40 px-2 py-1 rounded">Payloads: 0/85</div>
                  <div className="text-xs bg-background/40 px-2 py-1 rounded">Found: 0 issues</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="lg:col-span-3">
          <ThreatLog threats={vulnerabilities} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
