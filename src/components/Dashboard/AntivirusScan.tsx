import React, { useEffect, useState, useRef } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Bug, // Replacing Virus with Bug
  Zap, 
  FileWarning, 
  Search, 
  Radiation, 
  Activity, 
  ShieldCheck, 
  Lock,
  FileText,
  FileSearch,
  Fingerprint,
  Radar,
  Cpu,
  Code
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface AntivirusScanProps {
  isScanning: boolean;
  threatLevel: "low" | "medium" | "high";
  onThreatFound: () => void;
}

const AntivirusScan: React.FC<AntivirusScanProps> = ({ 
  isScanning, 
  threatLevel, 
  onThreatFound 
}) => {
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStage, setScanStage] = useState(0);
  const [scanStatus, setScanStatus] = useState('Initializing...');
  const [threatStats, setThreatStats] = useState({
    scanned: 0,
    threats: 0,
    critical: 0,
    neutralized: 0
  });
  const [currentFile, setCurrentFile] = useState('');
  const [recentThreats, setRecentThreats] = useState<string[]>([]);
  const [pulseStrength, setPulseStrength] = useState(1);
  const [scanAreas, setScanAreas] = useState<string[]>([]);
  
  const threatLevelColors = {
    low: 'text-green-500',
    medium: 'text-yellow-500',
    high: 'text-red-500'
  };
  
  const heatmapRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Set up the scan animation
  useEffect(() => {
    if (isScanning) {
      // Initial scan areas
      setScanAreas([
        'Request headers',
        'URL parameters',
        'Cookie values',
        'Form fields',
        'API endpoints',
        'Response content',
        'Javascript execution',
        'DOM structure'
      ]);
      
      let progress = 0;
      let stage = 0;
      let threatCount = 0;
      let filesScanned = 0;
      
      const stages = [
        'Initializing system scan...',
        'Scanning HTTP requests...',
        'Analyzing JavaScript context...',
        'Checking DOM integrity...',
        'Verifying API endpoints...',
        'Testing input validation...',
        'Probing response handling...',
        'Running deep packet inspection...',
        'Applying heuristic analysis...',
        'Validating content security...'
      ];
      
      const fileTypes = [
        'HTTP GET request', 
        'HTTP POST request',
        'API endpoint', 
        'DOM element',
        'JavaScript context',
        'Input field',
        'Cookie value',
        'Local storage',
        'WebSocket connection',
        'AJAX request'
      ];
      
      const threatTypes = [
        'XSS injection vulnerability',
        'SQL injection vector',
        'CSRF weakness',
        'Input validation bypass',
        'Authentication bypass',
        'Authorization exploit',
        'Command injection',
        'Path traversal',
        'Server-side template injection',
        'Local file inclusion'
      ];
      
      intervalRef.current = setInterval(() => {
        // Update progress
        progress += Math.random() * 0.8;
        if (progress >= 100) progress = 100;
        setScanProgress(progress);
        
        // Randomly update stage
        if (progress > (stage + 1) * 10 && stage < stages.length - 1) {
          stage++;
          setScanStage(stage);
          setScanStatus(stages[stage]);
        }
        
        // Update files being scanned
        filesScanned += Math.floor(Math.random() * 3) + 1;
        const randomFileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
        setCurrentFile(`${randomFileType} #${filesScanned.toString().padStart(5, '0')}`);
        
        // Randomly find threats based on threat level
        const threatThreshold = threatLevel === 'high' ? 0.92 : 
                              threatLevel === 'medium' ? 0.95 : 0.98;
        
        if (Math.random() > threatThreshold) {
          threatCount++;
          onThreatFound();
          
          // Add to recent threats list
          const newThreat = threatTypes[Math.floor(Math.random() * threatTypes.length)];
          setRecentThreats(prev => [newThreat, ...prev].slice(0, 5));
          
          // Determine if it's critical
          const isCritical = Math.random() > 0.7;
          const neutralized = Math.random() > 0.2;
          
          // Update threat stats
          setThreatStats(prev => ({
            scanned: filesScanned,
            threats: prev.threats + 1,
            critical: prev.critical + (isCritical ? 1 : 0),
            neutralized: prev.neutralized + (neutralized ? 1 : 0)
          }));
        } else {
          // Just update scanned count
          setThreatStats(prev => ({
            ...prev,
            scanned: filesScanned
          }));
        }
        
        // Randomly pulse the scan intensity
        setPulseStrength(0.8 + Math.random() * 0.4);
        
        // Stop when done
        if (progress >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setScanStatus('Scan completed');
        }
      }, 200);
      
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    } else {
      // Reset everything when not scanning
      setScanProgress(0);
      setScanStage(0);
      setScanStatus('Ready to scan');
      setCurrentFile('');
      setRecentThreats([]);
      setPulseStrength(1);
      setThreatStats({
        scanned: 0,
        threats: 0,
        critical: 0,
        neutralized: 0
      });
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isScanning, threatLevel, onThreatFound]);
  
  // Draw threat heatmap visualization
  useEffect(() => {
    if (!heatmapRef.current || !isScanning) return;
    
    const canvas = heatmapRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const drawHeatmap = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 0.5;
      
      const cellSize = 20;
      for (let x = 0; x < canvas.width; x += cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Draw heatmap based on threat level and scan progress
      const numPoints = threatLevel === 'high' ? 30 : 
                       threatLevel === 'medium' ? 20 : 10;
      
      const threatColor = threatLevel === 'high' ? 'rgba(239, 68, 68,' : 
                         threatLevel === 'medium' ? 'rgba(245, 158, 11,' :
                         'rgba(16, 185, 129,';
      
      // Draw heatmap points
      for (let i = 0; i < numPoints; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = 20 + Math.random() * 30;
        const intensity = Math.random() * 0.5 + 0.1;
        
        // Create radial gradient
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `${threatColor} ${intensity})`);
        gradient.addColorStop(1, `${threatColor} 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Add scan line effect
      const scanLineY = (scanProgress / 100) * canvas.height;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(0, scanLineY - 1, canvas.width, 2);
      
      // Highlight threats
      recentThreats.forEach((_, index) => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = 5 + Math.random() * 5;
        
        ctx.fillStyle = index === 0 ? '#ef4444' : '#f97316';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add pulsing effect around new threats
        if (index < 2) {
          const pulseSize = 1 + Math.sin(Date.now() / 200) * 0.3;
          ctx.strokeStyle = index === 0 ? '#ef4444' : '#f97316';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(x, y, size * 2 * pulseSize, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
    };
    
    const animationId = requestAnimationFrame(function animate() {
      drawHeatmap();
      if (isScanning) {
        requestAnimationFrame(animate);
      }
    });
    
    return () => cancelAnimationFrame(animationId);
  }, [isScanning, scanProgress, threatLevel, recentThreats]);
  
  return (
    <div className="border border-border rounded-lg backdrop-blur-md bg-card/30 p-4 space-y-4 relative overflow-hidden">
      {/* Background visualization */}
      <canvas 
        ref={heatmapRef} 
        width={600} 
        height={230} 
        className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
      />
      
      {/* Header section */}
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center">
          {isScanning ? (
            <div className="flex items-center">
              <Radar className="h-5 w-5 text-fuzzer-primary mr-2 animate-spin-slow" />
              <span className="font-bold text-lg">Security Scan in Progress</span>
            </div>
          ) : (
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="font-bold text-lg">Security Scan</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-xs font-mono bg-background/50 py-1 px-2 rounded-md">
            Threat Level: 
            <span className={`ml-1 font-bold ${threatLevelColors[threatLevel]}`}>
              {threatLevel.toUpperCase()}
            </span>
          </div>
          
          {isScanning && (
            <div className="flex items-center text-xs bg-background/50 py-1 px-2 rounded-md animate-pulse">
              <Activity className="h-3 w-3 mr-1" />
              ACTIVE
            </div>
          )}
        </div>
      </div>
      
      {/* Progress section */}
      {isScanning && (
        <div className="space-y-2 relative z-10">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{scanStatus}</span>
            <span>{Math.round(scanProgress)}%</span>
          </div>
          
          <Progress value={scanProgress} className="h-2">
            <div 
              className="h-full bg-gradient-to-r from-fuzzer-primary to-blue-500 transition-all"
              style={{ 
                transform: `translateX(-${100 - scanProgress}%)`,
                opacity: pulseStrength 
              }} 
            />
          </Progress>
          
          <div className="flex justify-between text-xs font-mono mt-1">
            <div className="text-muted-foreground/70">
              Current: <span className="text-foreground">{currentFile}</span>
            </div>
            <div className="text-muted-foreground/70">
              Stage: <span className="text-foreground">{scanStage + 1}/10</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Main grid layout */}
      <div className="grid grid-cols-12 gap-4 relative z-10">
        {/* Scan statistics */}
        <div className="col-span-4 space-y-4">
          <div className="bg-background/30 backdrop-blur-sm rounded p-3 border border-border/50">
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <FileSearch className="h-4 w-4 mr-1 text-fuzzer-primary" />
              Scan Statistics
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Elements Scanned:</span>
                <span className="font-mono">{threatStats.scanned.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Threats Detected:</span>
                <span className="font-mono text-amber-500">{threatStats.threats}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Critical Threats:</span>
                <span className="font-mono text-red-500">{threatStats.critical}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Threats Neutralized:</span>
                <span className="font-mono text-green-500">{threatStats.neutralized}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-background/30 backdrop-blur-sm rounded p-3 border border-border/50">
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <Bug className="h-4 w-4 mr-1 text-fuzzer-primary" />
              Threat Indicators
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-1 bg-background/50 p-1.5 rounded text-xs">
                <div className={`h-2 w-2 rounded-full ${threatStats.threats > 0 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                <span>Injection</span>
              </div>
              
              <div className="flex items-center space-x-1 bg-background/50 p-1.5 rounded text-xs">
                <div className={`h-2 w-2 rounded-full ${threatStats.threats > 2 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                <span>Authentication</span>
              </div>
              
              <div className="flex items-center space-x-1 bg-background/50 p-1.5 rounded text-xs">
                <div className={`h-2 w-2 rounded-full ${threatStats.threats > 1 ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                <span>Validation</span>
              </div>
              
              <div className="flex items-center space-x-1 bg-background/50 p-1.5 rounded text-xs">
                <div className={`h-2 w-2 rounded-full ${threatStats.critical > 0 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                <span>Encoding</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Middle section */}
        <div className="col-span-4 flex flex-col space-y-4">
          <div className="bg-background/30 backdrop-blur-sm rounded p-3 border border-border/50 flex-1">
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <FileWarning className="h-4 w-4 mr-1 text-fuzzer-primary" />
              Recent Threats
            </h3>
            
            <div className="space-y-2">
              {recentThreats.length > 0 ? (
                recentThreats.map((threat, index) => (
                  <div 
                    key={index} 
                    className={`text-xs p-2 rounded flex items-start space-x-2 ${
                      index === 0 ? 'bg-red-500/20 border border-red-500/30 animate-pulse' : 'bg-background/50'
                    }`}
                  >
                    {index === 0 ? (
                      <AlertTriangle className="h-3.5 w-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Bug className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    )}
                    <span>{threat}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-muted-foreground italic p-2">
                  No threats detected yet
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-background/30 backdrop-blur-sm rounded p-3 border border-border/50">
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <Cpu className="h-4 w-4 mr-1 text-fuzzer-primary" />
              System Status
            </h3>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-background/50 p-2 rounded">
                <div className="text-muted-foreground mb-1">Memory</div>
                <div className="flex items-center space-x-2">
                  <Progress value={65} className="h-1.5 flex-1" />
                  <span className="font-mono">65%</span>
                </div>
              </div>
              
              <div className="bg-background/50 p-2 rounded">
                <div className="text-muted-foreground mb-1">CPU</div>
                <div className="flex items-center space-x-2">
                  <Progress value={43} className="h-1.5 flex-1" />
                  <span className="font-mono">43%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right section */}
        <div className="col-span-4 space-y-4">
          <div className="bg-background/30 backdrop-blur-sm rounded p-3 border border-border/50">
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <Search className="h-4 w-4 mr-1 text-fuzzer-primary" />
              Scan Areas
            </h3>
            
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {scanAreas.map((area, index) => (
                <div key={index} className="flex items-center space-x-1.5">
                  <div 
                    className={`h-1.5 w-1.5 rounded-full ${
                      scanProgress > (index + 1) * (100 / scanAreas.length) ? 'bg-green-500' : 'bg-muted'
                    }`}
                  ></div>
                  <span className={scanProgress > (index + 1) * (100 / scanAreas.length) ? 'text-foreground' : 'text-muted-foreground'}>
                    {area}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-background/30 backdrop-blur-sm rounded p-3 border border-border/50">
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <Code className="h-4 w-4 mr-1 text-fuzzer-primary" />
              Protection Status
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center">
                  <ShieldCheck className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                  <span>Web Firewall</span>
                </div>
                <span className="bg-green-500/20 text-green-500 py-0.5 px-1.5 rounded text-[10px]">ACTIVE</span>
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center">
                  <Lock className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                  <span>Input Sanitization</span>
                </div>
                <span className="bg-green-500/20 text-green-500 py-0.5 px-1.5 rounded text-[10px]">ACTIVE</span>
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center">
                  <Fingerprint className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
                  <span>Behavior Analysis</span>
                </div>
                <span className="bg-amber-500/20 text-amber-500 py-0.5 px-1.5 rounded text-[10px]">LEARNING</span>
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center">
                  <FileText className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                  <span>Vulnerability Database</span>
                </div>
                <span className="text-xs text-muted-foreground">Updated 2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Status indicators at bottom */}
      <div className="flex justify-between items-center text-xs text-muted-foreground relative z-10">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <div className={`h-1.5 w-1.5 rounded-full mr-1 ${isScanning ? 'bg-green-500 animate-pulse' : 'bg-muted'}`}></div>
            Scanner
          </div>
          
          <div className="flex items-center">
            <div className={`h-1.5 w-1.5 rounded-full mr-1 ${threatStats.threats > 0 ? 'bg-amber-500' : 'bg-green-500'}`}></div>
            Security
          </div>
        </div>
        
        <div className="font-mono">
          {isScanning 
            ? `SCANNING: ${Math.floor(Date.now() / 1000)}`
            : 'READY'
          }
        </div>
      </div>
      
      {/* Overlay when not scanning */}
      {!isScanning && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex flex-col items-center justify-center z-20">
          <Shield className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <div className="text-lg font-medium">Security Scanner Ready</div>
          <div className="text-sm text-muted-foreground mt-1 mb-4">
            Start a security scan to identify potential vulnerabilities
          </div>
        </div>
      )}
    </div>
  );
};

export default AntivirusScan;
