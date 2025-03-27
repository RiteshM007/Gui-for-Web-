
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileWarning, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ThreatLog = ({ threats = [] }) => {
  const [expanded, setExpanded] = useState(true);
  const [selectedThreat, setSelectedThreat] = useState(null);
  
  const sampleThreats = [
    {
      id: 1,
      type: 'SQL Injection',
      endpoint: '/api/user/login',
      payload: "admin' OR '1'='1",
      severity: 'high',
      description: 'Authentication bypass through SQL Injection',
      timestamp: new Date().getTime() - 1000000,
      recommendation: 'Use prepared statements and parameterized queries',
      details: 'The application is vulnerable to SQL Injection attacks that can bypass authentication. This could allow unauthorized access to sensitive data and functionality.',
    },
    {
      id: 2,
      type: 'XSS',
      endpoint: '/api/feedback',
      payload: "<script>alert('XSS')</script>",
      severity: 'medium',
      description: 'Cross-site scripting in feedback form',
      timestamp: new Date().getTime() - 2000000,
      recommendation: 'Implement proper input validation and output encoding',
      details: 'The application does not properly sanitize user input, allowing attackers to inject malicious scripts that execute in users\' browsers.',
    },
    {
      id: 3,
      type: 'Information Disclosure',
      endpoint: '/api/config',
      payload: '?debug=true',
      severity: 'low',
      description: 'Sensitive information exposed in debug mode',
      timestamp: new Date().getTime() - 3000000,
      recommendation: 'Disable debug features in production',
      details: 'The application exposes sensitive configuration information when debug mode is enabled, which could provide attackers with valuable intelligence.',
    },
  ];
  
  const displayThreats = threats.length > 0 ? threats : sampleThreats;
  
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };
  
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/20 text-red-500';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'low':
        return 'bg-blue-500/20 text-blue-500';
      default:
        return 'bg-green-500/20 text-green-500';
    }
  };
  
  return (
    <div className="rounded-lg border border-border frost-panel overflow-hidden">
      <div 
        className="bg-black/40 backdrop-blur-sm p-3 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <FileWarning className="h-4 w-4 text-fuzzer-primary" />
          <h3 className="font-medium text-sm">Threat Log</h3>
          <Badge className="ml-1">{displayThreats.length}</Badge>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </div>
      
      <div className={`transition-all duration-300 overflow-hidden ${expanded ? 'max-h-[500px]' : 'max-h-0'}`}>
        <div className="p-1 max-h-[500px] overflow-y-auto custom-scrollbar">
          {displayThreats.map((threat) => (
            <div 
              key={threat.id}
              className={`
                p-3 border-b border-border/10 cursor-pointer
                hover:bg-background/20 transition-colors
                ${selectedThreat?.id === threat.id ? 'bg-background/40' : ''}
              `}
              onClick={() => setSelectedThreat(selectedThreat?.id === threat.id ? null : threat)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1">
                    {getSeverityIcon(threat.severity)}
                    <span className="font-medium">{threat.type}</span>
                    <Badge className={`ml-2 ${getSeverityColor(threat.severity)}`}>
                      {threat.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{threat.description}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(threat.timestamp).toLocaleTimeString()}
                </div>
              </div>
              
              {selectedThreat?.id === threat.id && (
                <div className="mt-3 pt-3 border-t border-border/10 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <p className="text-muted-foreground mb-1">Endpoint</p>
                      <p className="font-mono bg-background/20 p-1 rounded text-xs break-all">{threat.endpoint}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Payload</p>
                      <p className="font-mono bg-background/20 p-1 rounded text-xs break-all">{threat.payload}</p>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-muted-foreground mb-1">Details</p>
                    <p className="text-xs">{threat.details}</p>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-muted-foreground mb-1">Recommendation</p>
                    <p className="text-xs">{threat.recommendation}</p>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="w-full">
                      Mark as Fixed
                    </Button>
                    <Button size="sm" className="w-full bg-fuzzer-primary text-white">
                      View Full Details
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {displayThreats.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">
              No threats detected yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreatLog;
