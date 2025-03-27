
import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const PayloadFeed = ({ isScanning, payloads = [] }) => {
  const [displayedPayloads, setDisplayedPayloads] = useState([]);
  const feedRef = useRef(null);
  const [typewriterText, setTypewriterText] = useState('');
  const [currentPayloadIndex, setCurrentPayloadIndex] = useState(0);
  
  const samplePayloads = [
    { text: "' OR 1=1--", status: 'success', type: 'SQL Injection' },
    { text: "<script>alert('XSS')</script>", status: 'failed', type: 'XSS' },
    { text: "../../../../etc/passwd", status: 'warning', type: 'Path Traversal' },
    { text: "admin' --", status: 'success', type: 'SQL Injection' },
    { text: "; DROP TABLE users;--", status: 'failed', type: 'SQL Injection' },
    { text: "<img src=x onerror=alert(1)>", status: 'warning', type: 'XSS' },
    { text: "Mozilla/5.0 () Gecko/20100101 Fuzz/66.0", status: 'success', type: 'User-Agent' },
    { text: "$(cat /etc/passwd)", status: 'failed', type: 'Command Injection' },
    { text: "?debug=true", status: 'warning', type: 'Information Disclosure' },
    { text: "admin:admin", status: 'success', type: 'Brute Force' },
  ];
  
  // Typewriter effect for current payload
  useEffect(() => {
    if (!isScanning) {
      setTypewriterText('');
      return;
    }
    
    const payload = samplePayloads[currentPayloadIndex % samplePayloads.length];
    let currentText = '';
    let charIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (charIndex < payload.text.length) {
        currentText += payload.text.charAt(charIndex);
        setTypewriterText(currentText);
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          // Add payload to displayed list
          setDisplayedPayloads(prev => [payload, ...prev].slice(0, 100));
          
          // Move to next payload
          setCurrentPayloadIndex(prev => prev + 1);
          setTypewriterText('');
        }, 1000);
      }
    }, 50);
    
    return () => clearInterval(typeInterval);
  }, [isScanning, currentPayloadIndex]);
  
  // Auto-scroll feed
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [displayedPayloads]);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-500/20 text-green-500';
      case 'failed': return 'bg-red-500/20 text-red-500';
      case 'warning': return 'bg-amber-500/20 text-amber-500';
      default: return 'bg-blue-500/20 text-blue-500';
    }
  };
  
  return (
    <div className="w-full h-[300px] rounded-lg border border-border frost-panel overflow-hidden">
      <div className="bg-black/40 backdrop-blur-sm p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-fuzzer-primary" />
          <h3 className="font-medium text-sm">Live Payload Injection Feed</h3>
        </div>
        <Badge variant="outline" className={isScanning ? 'animate-pulse text-fuzzer-primary' : ''}>
          {isScanning ? 'LIVE' : 'IDLE'}
        </Badge>
      </div>
      
      {/* Typewriter animation for current payload */}
      {isScanning && (
        <div className="px-4 py-2 border-b border-border/40 bg-background/20">
          <div className="font-mono text-xs flex items-center">
            <span className="text-fuzzer-primary mr-2">&gt;</span>
            <span className="text-foreground">{typewriterText}</span>
            <span className="h-4 w-[2px] bg-fuzzer-primary ml-[2px] animate-pulse" />
          </div>
        </div>
      )}
      
      {/* Payload history feed */}
      <div 
        ref={feedRef}
        className="h-[calc(100%-56px)] overflow-y-auto custom-scrollbar p-1"
      >
        {displayedPayloads.map((payload, index) => (
          <div 
            key={index} 
            className="font-mono text-xs px-3 py-2 hover:bg-background/20 transition-colors border-b border-border/10 flex justify-between"
          >
            <div>
              <span className="text-muted-foreground mr-2">&gt;</span>
              <span>{payload.text}</span>
            </div>
            <Badge className={`${getStatusColor(payload.status)} ml-2`}>
              {payload.type}
            </Badge>
          </div>
        ))}
        
        {/* Sample data when not scanning */}
        {!isScanning && displayedPayloads.length === 0 && samplePayloads.slice(0, 5).map((payload, index) => (
          <div 
            key={index} 
            className="font-mono text-xs px-3 py-2 hover:bg-background/20 transition-colors border-b border-border/10 flex justify-between opacity-60"
          >
            <div>
              <span className="text-muted-foreground mr-2">&gt;</span>
              <span>{payload.text}</span>
            </div>
            <Badge className={`${getStatusColor(payload.status)} ml-2`}>
              {payload.type}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PayloadFeed;
