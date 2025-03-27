
import React, { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

interface DataMatrixProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number;
  cols?: number;
  cellSize?: number;
  activeColor?: string;
  inactiveColor?: string;
  speed?: number;
  density?: number;
}

const DataMatrix = ({ 
  rows = 12,
  cols = 20,
  cellSize = 10,
  activeColor = '#8B5CF6',
  inactiveColor = '#1F2937',
  speed = 200,
  density = 0.1,
  className,
  ...props 
}: DataMatrixProps) => {
  const matrixRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Create matrix data
    const cells = matrixRef.current?.querySelectorAll('.matrix-cell');
    if (!cells) return;
    
    // Initial state - random cells active
    cells.forEach(cell => {
      if (Math.random() < density) {
        cell.classList.add('active');
      }
    });
    
    // Animation interval
    const interval = setInterval(() => {
      cells.forEach(cell => {
        // Random chance to toggle state
        if (Math.random() < 0.05) {
          cell.classList.toggle('active');
        }
      });
    }, speed);
    
    return () => clearInterval(interval);
  }, [density, speed]);
  
  return (
    <div 
      ref={matrixRef}
      className={cn("border border-border rounded-md p-2 bg-black/50", className)} 
      {...props}
    >
      <div 
        className="grid" 
        style={{ 
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          gap: '2px'
        }}
      >
        {Array.from({ length: rows * cols }).map((_, i) => (
          <div 
            key={i}
            className="matrix-cell transition-colors duration-300 rounded-sm"
            style={{ 
              width: `${cellSize}px`, 
              height: `${cellSize}px`, 
              backgroundColor: inactiveColor
            }}
          ></div>
        ))}
      </div>
      <style>
        {`.matrix-cell.active {
          background-color: ${activeColor} !important;
        }`}
      </style>
    </div>
  );
};

export { DataMatrix };
