
import React, { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";
import { Terminal as TerminalIcon } from 'lucide-react';

interface TerminalProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: string[];
  autoType?: boolean;
  typeSpeed?: number;
  initialLines?: number;
}

const Terminal = ({ 
  lines = [], 
  className,
  autoType = true,
  typeSpeed = 40,
  initialLines = 0,
  ...props 
}: TerminalProps) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>(
    autoType ? lines.slice(0, initialLines) : lines
  );
  const [currentLine, setCurrentLine] = useState(initialLines);
  const [currentChar, setCurrentChar] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!autoType || currentLine >= lines.length) return;
    
    const timer = setTimeout(() => {
      if (currentChar < lines[currentLine].length) {
        // Type character by character
        setDisplayedLines(prev => {
          const newLines = [...prev];
          if (newLines.length <= currentLine) {
            newLines.push(lines[currentLine].substring(0, currentChar + 1));
          } else {
            newLines[currentLine] = lines[currentLine].substring(0, currentChar + 1);
          }
          return newLines;
        });
        setCurrentChar(currentChar + 1);
      } else {
        // Move to next line
        setCurrentLine(currentLine + 1);
        setCurrentChar(0);
      }
      
      // Auto scroll to bottom
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, typeSpeed);
    
    return () => clearTimeout(timer);
  }, [autoType, lines, currentLine, currentChar, typeSpeed]);
  
  return (
    <div 
      className={cn(
        "border border-border rounded-md bg-black/90 text-green-400 font-mono text-xs overflow-hidden",
        className
      )} 
      {...props}
    >
      <div className="border-b border-border px-3 py-2 flex items-center gap-2 bg-background/10">
        <TerminalIcon className="h-4 w-4" />
        <span className="font-medium">Terminal</span>
      </div>
      <div 
        ref={terminalRef} 
        className="p-3 max-h-64 overflow-y-auto custom-scrollbar"
      >
        {displayedLines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap break-all">
            {i === currentLine && autoType ? (
              <>
                <span className="text-fuzzer-primary">$ </span>
                {line}<span className="animate-blink">▌</span>
              </>
            ) : (
              <>
                <span className="text-fuzzer-primary">$ </span>
                {line}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export { Terminal };
