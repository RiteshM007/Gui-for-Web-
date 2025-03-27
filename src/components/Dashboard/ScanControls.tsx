
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Pause, 
  RotateCw, 
  Zap, 
  Cpu,
  Shield,
} from 'lucide-react';

const ScanControls = ({ 
  isScanning, 
  onStartScan, 
  onPauseScan, 
  onResumeScan, 
  onStopScan,
  scanMode,
  onChangeScanMode
}) => {
  return (
    <div className="rounded-lg border border-border frost-panel p-4 space-y-4">
      <h3 className="font-medium mb-2">Scan Controls</h3>
      
      <div className="grid grid-cols-2 gap-2">
        {!isScanning ? (
          <>
            <Button 
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
              onClick={() => onStartScan(scanMode)}
            >
              <Play className="h-4 w-4 mr-2" />
              Start Scan
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onStopScan()}
              disabled={!isScanning}
            >
              <RotateCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onPauseScan()}
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
            
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={() => onStopScan()}
            >
              <Shield className="h-4 w-4 mr-2" />
              Stop
            </Button>
          </>
        )}
      </div>
      
      <div className="pt-2 border-t border-border/50">
        <h4 className="text-sm font-medium mb-2">Scan Mode</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant={scanMode === 'quick' ? 'default' : 'outline'} 
            className={`w-full ${scanMode === 'quick' ? 'bg-fuzzer-primary text-primary-foreground' : ''}`}
            onClick={() => onChangeScanMode('quick')}
            disabled={isScanning}
          >
            <Zap className="h-4 w-4 mr-2" />
            Quick Scan
          </Button>
          
          <Button 
            variant={scanMode === 'deep' ? 'default' : 'outline'} 
            className={`w-full ${scanMode === 'deep' ? 'bg-fuzzer-primary text-primary-foreground' : ''}`}
            onClick={() => onChangeScanMode('deep')}
            disabled={isScanning}
          >
            <Cpu className="h-4 w-4 mr-2" />
            Deep Scan
          </Button>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground mt-2">
        {scanMode === 'quick' ? (
          <p>Quick scan tests common vulnerabilities and performs surface-level checks.</p>
        ) : (
          <p>Deep scan performs thorough analysis with AI-based anomaly detection.</p>
        )}
      </div>
    </div>
  );
};

export default ScanControls;
