
import React, { useEffect, useState, useRef } from 'react';
import { 
  Shield, 
  Zap, 
  AlertTriangle, 
  Activity, 
  Wifi, 
  Signal, 
  RadarIcon, 
  Radiation, 
  Hexagon, 
  Blocks, 
  Focus, 
  Scan, 
  Atom,
  Crosshair
} from 'lucide-react';

interface ScanAnimationProps {
  isScanning: boolean;
  threatLevel: "low" | "medium" | "high";
  onThreatFound: () => void;
}

const ScanAnimation: React.FC<ScanAnimationProps> = ({ isScanning, threatLevel, onThreatFound }) => {
  const [rotation, setRotation] = useState(0);
  const [pulseSize, setPulseSize] = useState(1);
  const [dataPoints, setDataPoints] = useState<any[]>([]);
  const [threatDetections, setThreatDetections] = useState<any[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const animationRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const radarRef = useRef<HTMLCanvasElement | null>(null);
  const glitchTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Create initial data points when scanning starts
  useEffect(() => {
    if (isScanning) {
      // Create more data points for enhanced visualization
      const points = [];
      for (let i = 0; i < 50; i++) {
        points.push({
          x: Math.random() * 300,
          y: Math.random() * 300,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 2 + 0.5,
          color: Math.random() > 0.85 ? '#ff4757' : 
                 Math.random() > 0.7 ? '#ffa502' : '#2ed573',
          pulse: Math.random() > 0.6,
          opacity: Math.random() * 0.5 + 0.5,
          blinking: Math.random() > 0.8
        });
      }
      setDataPoints(points);
      setThreatDetections([]);
      setScanProgress(0);
      
      // Setup periodic glitch effect for cybersecurity aesthetic
      glitchTimerRef.current = setInterval(() => {
        setGlitchEffect(true);
        setTimeout(() => setGlitchEffect(false), 150);
      }, 5000);
    } else {
      setDataPoints([]);
      setThreatDetections([]);
      setScanProgress(0);
      if (glitchTimerRef.current) {
        clearInterval(glitchTimerRef.current);
      }
    }
    
    return () => {
      if (glitchTimerRef.current) {
        clearInterval(glitchTimerRef.current);
      }
    };
  }, [isScanning]);
  
  // Handle rotation, pulse animations and scan progress
  useEffect(() => {
    if (!isScanning) return;
    
    let animationFrameId: number;
    let threatTimer: NodeJS.Timeout | undefined;
    
    const animate = () => {
      setRotation(prev => (prev + 0.7) % 360);
      setPulseSize(prev => {
        const newSize = prev + 0.02 * (prev < 1.3 ? 1 : -1);
        return newSize <= 1 ? 1 : newSize >= 1.3 ? 1.3 : newSize;
      });
      
      // Update scan progress
      setScanProgress(prev => {
        const newProgress = prev + 0.05;
        return newProgress >= 100 ? 0 : newProgress;
      });
      
      // Random chance to find a threat with more variety in threat types
      if (Math.random() > 0.985) {
        onThreatFound();
        
        // Add a threat visualization point with enhanced visuals
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 80 + 20;
        const threatTypes = ['malware', 'injection', 'xss', 'dos', 'backdoor'];
        const threatType = threatTypes[Math.floor(Math.random() * threatTypes.length)];
        
        setThreatDetections(prev => [
          ...prev, 
          {
            x: 150 + Math.cos(angle) * distance,
            y: 150 + Math.sin(angle) * distance,
            size: Math.random() * 6 + 4,
            created: Date.now(),
            opacity: 1,
            color: threatLevel === 'high' ? '#ff4757' : 
                  threatLevel === 'medium' ? '#ffa502' : '#2ed573',
            type: threatType,
            pulse: true
          }
        ].slice(-10)); // Keep only the most recent 10 threats
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (threatTimer) clearTimeout(threatTimer);
    };
  }, [isScanning, onThreatFound, threatLevel]);
  
  // Canvas rendering for data visualization with enhanced effects
  useEffect(() => {
    if (!canvasRef.current || !isScanning) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    const drawFrame = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Draw grid with perspective effect
      ctx.strokeStyle = 'rgba(66, 103, 178, 0.12)';
      ctx.lineWidth = 0.5;
      
      // Draw perspective grid lines
      const centerX = width / 2;
      const centerY = height / 2;
      const gridSize = 20;
      const perspective = 0.0015;
      
      for (let i = 0; i < width; i += gridSize) {
        const distFromCenter = Math.abs(i - centerX);
        const lineOpacity = Math.max(0.05, 0.12 - distFromCenter * perspective);
        
        ctx.strokeStyle = `rgba(66, 103, 178, ${lineOpacity})`;
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      
      for (let i = 0; i < height; i += gridSize) {
        const distFromCenter = Math.abs(i - centerY);
        const lineOpacity = Math.max(0.05, 0.12 - distFromCenter * perspective);
        
        ctx.strokeStyle = `rgba(66, 103, 178, ${lineOpacity})`;
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }
      
      // Draw radial grid with pulse effect
      for (let radius = 30; radius <= 150; radius += 30) {
        const pulseOffset = Math.sin(Date.now() / 1000 + radius / 30) * 3;
        const actualRadius = radius + pulseOffset;
        const opacity = 0.1 + (pulseOffset + 3) / 20;
        
        ctx.strokeStyle = `rgba(66, 103, 178, ${opacity})`;
        ctx.beginPath();
        ctx.arc(centerX, centerY, actualRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Draw data points with enhanced effects
      dataPoints.forEach((point, index) => {
        // Calculate movement using noise-like pattern
        const time = Date.now() / 1000;
        const xMovement = Math.sin(time * point.speed + index) * 5;
        const yMovement = Math.cos(time * point.speed + index * 0.7) * 5;
        
        // Draw connection lines with gradient effect
        if (index % 3 === 0 && dataPoints[index + 1]) {
          const nextPoint = dataPoints[index + 1];
          const gradient = ctx.createLinearGradient(
            point.x + xMovement, 
            point.y + yMovement,
            nextPoint.x + Math.sin(time * nextPoint.speed + index + 1) * 5, 
            nextPoint.y + Math.cos(time * nextPoint.speed + (index + 1) * 0.7) * 5
          );
          
          gradient.addColorStop(0, `rgba(86, 173, 238, ${point.opacity * 0.5})`);
          gradient.addColorStop(1, `rgba(66, 103, 178, ${nextPoint.opacity * 0.5})`);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(point.x + xMovement, point.y + yMovement);
          ctx.lineTo(
            nextPoint.x + Math.sin(time * nextPoint.speed + index + 1) * 5, 
            nextPoint.y + Math.cos(time * nextPoint.speed + (index + 1) * 0.7) * 5
          );
          ctx.stroke();
        }
        
        // Add blinking effect for some points
        const blinkOpacity = point.blinking 
          ? Math.abs(Math.sin(time * 3)) 
          : 1;
        
        // Draw point with pulse effect for some points
        ctx.fillStyle = point.color;
        const size = point.pulse 
          ? point.size + Math.sin(time * 3) * 0.8 
          : point.size;
        
        ctx.globalAlpha = point.opacity * blinkOpacity;
        ctx.beginPath();
        ctx.arc(
          point.x + xMovement,
          point.y + yMovement,
          size,
          0,
          Math.PI * 2
        );
        ctx.fill();
        
        // Add glow effect to some points
        if (point.pulse) {
          const glow = ctx.createRadialGradient(
            point.x + xMovement,
            point.y + yMovement,
            size * 0.5,
            point.x + xMovement,
            point.y + yMovement,
            size * 2
          );
          
          glow.addColorStop(0, point.color.replace(')', ', 0.4)').replace('rgb', 'rgba'));
          glow.addColorStop(1, point.color.replace(')', ', 0)').replace('rgb', 'rgba'));
          
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(
            point.x + xMovement,
            point.y + yMovement,
            size * 2,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
        
        ctx.globalAlpha = 1;
      });
      
      // Draw threat detections with enhanced visualization
      threatDetections.forEach((threat) => {
        const age = Date.now() - threat.created;
        const opacity = Math.max(0, 1 - age / 3000); // Fade out over 3 seconds
        
        if (opacity > 0) {
          // Pulsating outer glow
          const pulseSize = 1 + Math.sin(Date.now() / 200) * 0.2;
          const gradient = ctx.createRadialGradient(
            threat.x, threat.y, 0,
            threat.x, threat.y, threat.size * 3 * pulseSize
          );
          gradient.addColorStop(0, `${threat.color}99`);
          gradient.addColorStop(1, `${threat.color}00`);
          
          ctx.globalAlpha = opacity * 0.7;
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(threat.x, threat.y, threat.size * 3 * pulseSize, 0, Math.PI * 2);
          ctx.fill();
          
          // Expanding ring effect
          const ringSize = ((Date.now() - threat.created) % 2000) / 2000 * threat.size * 5;
          ctx.strokeStyle = threat.color;
          ctx.lineWidth = 0.5;
          ctx.globalAlpha = opacity * (1 - ringSize / (threat.size * 5));
          ctx.beginPath();
          ctx.arc(threat.x, threat.y, ringSize, 0, Math.PI * 2);
          ctx.stroke();
          
          // Center point with threat type indicator
          ctx.globalAlpha = opacity;
          ctx.fillStyle = threat.color;
          ctx.beginPath();
          ctx.arc(threat.x, threat.y, threat.size * (1 + Math.sin(Date.now() / 200) * 0.2), 0, Math.PI * 2);
          ctx.fill();
          
          // Add a symbol based on threat type
          ctx.fillStyle = '#fff';
          ctx.font = `${threat.size}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          let symbol = '!';
          switch(threat.type) {
            case 'malware': symbol = '⚠'; break;
            case 'injection': symbol = '↯'; break;
            case 'xss': symbol = '⟪⟫'; break;
            case 'dos': symbol = '∅'; break;
            case 'backdoor': symbol = '⚿'; break;
          }
          
          ctx.fillText(symbol, threat.x, threat.y);
          ctx.globalAlpha = 1;
        }
      });
      
      animationRef.current = requestAnimationFrame(drawFrame);
    };
    
    animationRef.current = requestAnimationFrame(drawFrame);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isScanning, dataPoints, threatDetections]);
  
  // Enhanced radar sweep effect - fixed to avoid createConicalGradient which isn't supported in all browsers
  useEffect(() => {
    if (!radarRef.current || !isScanning) return;
    
    const canvas = radarRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let angle = 0;
    
    const drawRadar = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw radar background with subtle gridlines
      ctx.strokeStyle = 'rgba(46, 213, 115, 0.1)';
      ctx.lineWidth = 0.5;
      
      // Draw circular grid
      for (let r = 20; r <= 110; r += 30) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Draw axis lines
      ctx.beginPath();
      ctx.moveTo(centerX - 110, centerY);
      ctx.lineTo(centerX + 110, centerY);
      ctx.moveTo(centerX, centerY - 110);
      ctx.lineTo(centerX, centerY + 110);
      ctx.stroke();
      
      // Draw radar sweep with gradient - using standard methods instead of conicalGradient
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, 110, angle - 0.1, angle + 0.5);
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = 'rgba(46, 213, 115, 0.3)';
      ctx.fill();
      ctx.restore();
      
      // Draw sweep line with enhanced visual
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      
      // Multi-layered sweep line for better visual
      const sweepGradient = ctx.createLinearGradient(0, 0, 110, 0);
      sweepGradient.addColorStop(0, 'rgba(46, 213, 115, 0.9)');
      sweepGradient.addColorStop(0.7, 'rgba(46, 213, 115, 0.5)');
      sweepGradient.addColorStop(1, 'rgba(46, 213, 115, 0)');
      
      ctx.strokeStyle = sweepGradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(110, 0);
      ctx.stroke();
      
      // Secondary thinner line for detail
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(110, 0);
      ctx.stroke();
      
      // Draw an indicator at tip of sweep line
      ctx.fillStyle = 'rgba(46, 213, 115, 0.8)';
      ctx.beginPath();
      ctx.arc(110, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Add a secondary pulsing indicator
      const pulseSize = 1 + Math.sin(Date.now() / 200) * 0.3;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(110, 0, 2 * pulseSize, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
      
      // Draw subtle targets/blips
      const blips = [
        { distance: Math.random() * 90 + 10, angle: Math.random() * Math.PI * 2, size: Math.random() * 2 + 1 },
        { distance: Math.random() * 90 + 10, angle: Math.random() * Math.PI * 2, size: Math.random() * 2 + 1 },
        { distance: Math.random() * 90 + 10, angle: Math.random() * Math.PI * 2, size: Math.random() * 2 + 1 }
      ];
      
      // Only show blips near the sweep line
      blips.forEach(blip => {
        const angleDiff = Math.abs((angle % (Math.PI * 2)) - blip.angle);
        const isInSweep = angleDiff < 0.2 || angleDiff > Math.PI * 2 - 0.2;
        
        if (isInSweep) {
          const blipX = centerX + Math.cos(blip.angle) * blip.distance;
          const blipY = centerY + Math.sin(blip.angle) * blip.distance;
          
          // Draw blip with glow
          const blipGradient = ctx.createRadialGradient(blipX, blipY, 0, blipX, blipY, blip.size * 3);
          blipGradient.addColorStop(0, 'rgba(46, 213, 115, 0.8)');
          blipGradient.addColorStop(1, 'rgba(46, 213, 115, 0)');
          
          ctx.fillStyle = blipGradient;
          ctx.beginPath();
          ctx.arc(blipX, blipY, blip.size * 3, 0, Math.PI * 2);
          ctx.fill();
          
          // Draw center of blip
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.beginPath();
          ctx.arc(blipX, blipY, blip.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      // Update angle for next frame
      angle = (angle + 0.03) % (Math.PI * 2);
      
      if (isScanning) {
        requestAnimationFrame(drawRadar);
      }
    };
    
    const radarAnimation = requestAnimationFrame(drawRadar);
    
    return () => {
      cancelAnimationFrame(radarAnimation);
    };
  }, [isScanning]);
  
  // Determine the appropriate icon based on threat level
  const getThreatIcon = () => {
    switch(threatLevel) {
      case 'low': return <Shield className="h-14 w-14 text-green-500 drop-shadow-[0_0_5px_rgba(16,185,129,0.7)] animate-pulse" />;
      case 'medium': return <Zap className="h-14 w-14 text-yellow-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.7)] animate-pulse" />;
      case 'high': return <AlertTriangle className="h-14 w-14 text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.7)] animate-pulse" />;
    }
  };
  
  // Apply glitch effect to the entire component
  const glitchClass = glitchEffect ? 'animate-[glitch_0.2s_ease_forwards]' : '';
  
  return (
    <div className={`relative w-full h-[300px] overflow-hidden rounded-lg border border-border frost-panel shadow-[0_0_15px_rgba(46,213,115,0.15)] ${glitchClass}`}>
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={300} 
        className="w-full h-full absolute top-0 left-0 z-10"
      />
      
      <canvas 
        ref={radarRef} 
        width={300} 
        height={300} 
        className="w-full h-full absolute top-0 left-0 z-0 opacity-60"
      />
      
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="relative w-[220px] h-[220px]">
          {/* Outer circle with pulse effect */}
          <div 
            className="absolute inset-0 border-2 border-fuzzer-primary/30 rounded-full"
            style={{ transform: `scale(${pulseSize})` }}
          ></div>
          
          {/* Progress ring */}
          <div className="absolute inset-0 z-0">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="rgba(46, 213, 115, 0.1)"
                strokeWidth="1"
              />
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="rgba(46, 213, 115, 0.7)"
                strokeWidth="1"
                strokeDasharray="302"
                strokeDashoffset={302 - (302 * scanProgress / 100)}
                transform="rotate(-90 50 50)"
                className="transition-all duration-200"
              />
            </svg>
          </div>
          
          {/* Middle circle with gradient */}
          <div className="absolute inset-[30px] rounded-full border border-fuzzer-primary/50 overflow-hidden backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-fuzzer-primary/10 to-transparent"></div>
          </div>
          
          {/* Scanning line that rotates */}
          <div 
            className="absolute inset-0 z-30"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <div className="absolute top-0 left-1/2 h-1/2 w-[2px] bg-gradient-to-b from-fuzzer-primary to-transparent origin-bottom" 
                 style={{ transform: 'translateX(-50%)' }}>
            </div>
            <Scan className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-fuzzer-primary drop-shadow-[0_0_5px_rgba(46,213,115,0.8)]" />
          </div>
          
          {/* Inner glow */}
          <div className="absolute inset-[60px] rounded-full bg-gradient-to-tr from-fuzzer-primary/20 to-transparent animate-pulse"></div>
          
          {/* Threat indicator in the center */}
          <div className="absolute inset-0 flex items-center justify-center z-40">
            {getThreatIcon()}
          </div>
          
          {/* Decorative elements with enhanced positioning and animations */}
          <div className="absolute inset-0">
            <Hexagon className="absolute top-[-15px] right-[50%] h-5 w-5 text-fuzzer-primary/70 animate-spin-slow" />
            <Atom className="absolute bottom-[-15px] left-[50%] h-5 w-5 text-fuzzer-primary/70 animate-pulse" />
            <Crosshair className="absolute top-[50%] right-[-15px] h-5 w-5 text-fuzzer-primary/70 animate-ping" style={{animationDuration: '3s'}} />
            <Blocks className="absolute bottom-[50%] left-[-15px] h-5 w-5 text-fuzzer-primary/70 animate-bounce" style={{animationDuration: '2s'}} />
            
            <div className="absolute top-[-10px] right-[-10px]">
              <Signal className="h-4 w-4 text-fuzzer-primary/70" />
            </div>
            <div className="absolute bottom-[-10px] left-[-10px]">
              <Wifi className="h-4 w-4 text-fuzzer-primary/70" />
            </div>
            <div className="absolute bottom-[-10px] right-[-10px]">
              <Activity className="h-4 w-4 text-fuzzer-primary/70" />
            </div>
            <div className="absolute top-[-10px] left-[-10px]">
              <RadarIcon className="h-4 w-4 text-fuzzer-primary/70" />
            </div>
            
            {/* Add animated symbols around the circle */}
            <div className="absolute inset-0">
              {[...Array(8)].map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const x = 110 + Math.cos(angle) * 120;
                const y = 110 + Math.sin(angle) * 120;
                return (
                  <div 
                    key={i}
                    className="absolute w-2 h-2 bg-fuzzer-primary/50 rounded-full"
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  ></div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Status indicators with enhanced visuals */}
      {isScanning ? (
        <>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-mono text-fuzzer-primary flex items-center gap-2 shadow-[0_0_10px_rgba(46,213,115,0.3)]">
              <Radiation className="h-3 w-3 animate-pulse" />
              <span className="animate-pulse">ADVANCED SCAN IN PROGRESS</span>
              <span className="font-bold">{Math.round(scanProgress)}%</span>
            </div>
          </div>
          
          <div className="absolute top-4 left-4 flex items-center gap-2 text-xs text-fuzzer-primary/80 font-mono z-40">
            <div className="w-2 h-2 bg-fuzzer-primary rounded-full animate-pulse"></div>
            SYSTEM ACTIVE
          </div>
          
          {/* Add scan statistics */}
          <div className="absolute top-4 right-4 flex flex-col items-end gap-1 text-xs font-mono z-40">
            <div className="flex items-center gap-1 text-fuzzer-primary/80">
              <Focus className="h-3 w-3" />
              <span>Endpoints: {Math.floor(scanProgress / 10) + 1}/10</span>
            </div>
            <div className="flex items-center gap-1 text-fuzzer-primary/80">
              <Scan className="h-3 w-3" />
              <span>Packets: {Math.floor(scanProgress * 5.7)}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center bg-black/40 z-50">
          <div className="text-lg font-medium flex flex-col items-center gap-3">
            <RadarIcon className="h-10 w-10 text-muted-foreground/70" />
            Scanner Ready
            <div className="text-sm text-muted-foreground/70">Click Start Security Scan to activate</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanAnimation;
