
import React, { useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { AlertTriangle } from 'lucide-react';

const SeverityChart = ({ vulnerabilities = [] }) => {
  const chartRef = useRef(null);
  
  // If no vulnerabilities, use sample data
  const data = vulnerabilities.length > 0 
    ? [
        { name: 'Critical', value: vulnerabilities.filter(v => v.severity === 'critical').length },
        { name: 'High', value: vulnerabilities.filter(v => v.severity === 'high').length },
        { name: 'Medium', value: vulnerabilities.filter(v => v.severity === 'medium').length },
        { name: 'Low', value: vulnerabilities.filter(v => v.severity === 'low').length },
      ]
    : [
        { name: 'Critical', value: 2 },
        { name: 'High', value: 7 },
        { name: 'Medium', value: 12 },
        { name: 'Low', value: 23 },
      ];
  
  // Filter out zero values
  const filteredData = data.filter(item => item.value > 0);
  
  const COLORS = ['#f87171', '#fb923c', '#facc15', '#4ade80'];
  
  const totalVulnerabilities = filteredData.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="rounded-lg border border-border frost-panel p-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-fuzzer-primary" />
        <h3 className="font-medium">Severity Distribution</h3>
      </div>
      
      <div className="h-[200px]">
        {filteredData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart ref={chartRef}>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                animationDuration={1000}
                animationBegin={200}
              >
                {filteredData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke="transparent"
                    className="hover:opacity-80 transition-opacity duration-200"
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(10, 10, 10, 0.8)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(8px)',
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                formatter={(value, entry, index) => (
                  <span className="text-xs text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No vulnerability data available
          </div>
        )}
      </div>
      
      <div className="flex justify-center mt-2">
        <div className="bg-background/40 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
          <span className="text-sm">Total:</span>
          <span className="font-mono text-lg">{totalVulnerabilities}</span>
        </div>
      </div>
    </div>
  );
};

export default SeverityChart;
