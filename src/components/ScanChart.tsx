
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart as BarChartIcon, PieChart as PieChartIcon, LineChart as LineChartIcon, ScanLine, Activity, Wand2 } from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart as RechartsLineChart, 
  Line, 
  BarChart as RechartsBarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
  Brush
} from 'recharts';
import { Badge } from "@/components/ui/badge";

interface ChartProps {
  requestsData: any[];
  responseCodes: Record<string, number>;
  isScanning: boolean;
}

type ChartType = 'line' | 'bar' | 'pie' | 'heatmap';

// Define interfaces for heatmap data
interface HeatmapPoint {
  x: number;
  y: number;
  z: number;
  endpoint: string;
  color: string;
  statusCode: string;
}

interface EndpointData {
  count: number;
  totalTime: number;
  timePoints: number[];
  statusCodes: Record<string, number>;
  name: string;
  avgTime?: number;
  points?: HeatmapPoint[];
}

interface HeatmapData {
  points: HeatmapPoint[];
  endpoints: EndpointData[];
}

const COLORS = ['#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#14B8A6', '#F97316'];

const ScanChart: React.FC<ChartProps> = ({ 
  requestsData, 
  responseCodes,
  isScanning 
}) => {
  const [chartType, setChartType] = useState<ChartType>('line');
  const [chartData, setChartData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapData>({ points: [], endpoints: [] });
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<HeatmapPoint | null>(null);
  
  // Enhanced color scale for heatmap
  const getHeatmapPointColor = (time: number) => {
    if (time > 500) return '#EF4444'; // Red for very slow
    if (time > 300) return '#F97316'; // Orange for slow
    if (time > 200) return '#F59E0B'; // Amber for medium
    if (time > 100) return '#10B981'; // Green for good
    return '#14B8A6'; // Teal for excellent
  };
  
  // Process data for charts with better sampling and visualization
  useEffect(() => {
    // Create data for time-series charts (line/bar)
    const processedData = [];
    
    // Use adaptive sampling based on data size
    const interval = Math.max(1, Math.floor(requestsData.length / 25)); // Limit to 25 data points
    
    for (let i = 0; i < requestsData.length; i += interval) {
      const chunk = requestsData.slice(i, i + interval);
      
      if (chunk.length === 0) continue;
      
      const avgResponseTime = chunk.reduce((sum, req) => sum + req.responseTime, 0) / chunk.length;
      const maxResponseTime = Math.max(...chunk.map(req => req.responseTime));
      const minResponseTime = Math.min(...chunk.map(req => req.responseTime));
      
      // Count response codes in this chunk
      const codes = { '200': 0, '404': 0, '500': 0, '403': 0, 'other': 0 };
      chunk.forEach(req => {
        const code = req.responseCode.toString();
        const codeKey = ['200', '404', '500', '403'].includes(code) ? code : 'other';
        codes[codeKey]++;
      });
      
      processedData.push({
        name: `Batch ${Math.floor(i/interval) + 1}`,
        avgResponseTime: Math.round(avgResponseTime),
        maxResponseTime: maxResponseTime,
        minResponseTime: minResponseTime,
        requestCount: chunk.length,
        ...codes
      });
    }
    
    setChartData(processedData);
    
    // Create data for pie chart with enhanced information
    const pieChartData = [
      { name: '200 OK', value: responseCodes['200'] || 0, color: '#10B981', description: 'Successful responses' },
      { name: '404 Not Found', value: responseCodes['404'] || 0, color: '#F59E0B', description: 'Resource not found' },
      { name: '500 Server Error', value: responseCodes['500'] || 0, color: '#EF4444', description: 'Internal server errors' },
      { name: '403 Forbidden', value: responseCodes['403'] || 0, color: '#F97316', description: 'Access denied' },
      { name: 'Other Codes', value: responseCodes['other'] || 0, color: '#3B82F6', description: 'Miscellaneous responses' }
    ].filter(item => item.value > 0); // Only include codes with values
    
    setPieData(pieChartData);
    
    // Generate enhanced heatmap data based on response time and frequency
    if (requestsData.length > 0) {
      // Create a detailed grid of endpoint performance
      const endpointMap: Record<string, EndpointData> = {};
      
      requestsData.forEach(req => {
        const endpoint = req.endpoint || 'unknown';
        const responseTime = req.responseTime;
        const responseCode = req.responseCode?.toString() || 'unknown';
        
        if (!endpointMap[endpoint]) {
          endpointMap[endpoint] = {
            count: 0,
            totalTime: 0,
            timePoints: [],
            statusCodes: {},
            name: endpoint
          };
        }
        
        endpointMap[endpoint].count++;
        endpointMap[endpoint].totalTime += responseTime;
        endpointMap[endpoint].timePoints.push(responseTime);
        
        // Track status codes for each endpoint
        if (!endpointMap[endpoint].statusCodes[responseCode]) {
          endpointMap[endpoint].statusCodes[responseCode] = 0;
        }
        endpointMap[endpoint].statusCodes[responseCode]++;
      });
      
      // Convert to enhanced heatmap format with more data points and better distribution
      const heatmapPoints: HeatmapPoint[] = [];
      const endpointList: EndpointData[] = [];
      
      Object.keys(endpointMap).forEach((endpoint, endpointIndex) => {
        const data = endpointMap[endpoint];
        const endpointData: HeatmapPoint[] = [];
        
        // Generate multiple points with strategic jitter for better visualization
        data.timePoints.forEach((time, j) => {
          // Calculate point density
          const pointCount = Math.min(data.timePoints.length, 50); // Cap at 50 points per endpoint
          const pointIndex = j % pointCount;
          
          // Calculate x position with jitter around the endpoint index
          const jitterAmount = 0.4; // Reduce jitter for more organized look
          const jitterX = (Math.random() * jitterAmount * 2 - jitterAmount);
          
          // For common endpoints with many points, create a more defined cluster
          const xPos = data.count > 10 
            ? endpointIndex + jitterX * (data.count > 30 ? 0.5 : 1)
            : endpointIndex + jitterX;
          
          const point: HeatmapPoint = {
            x: xPos,
            y: time,
            z: data.count, // Size represents frequency
            endpoint: endpoint,
            color: getHeatmapPointColor(time),
            statusCode: Array.isArray(requestsData) && j < requestsData.length ? 
              requestsData[j].responseCode.toString() : '200' // Use actual status code if available
          };
          
          // Only include a subset of points for very large datasets to prevent overplotting
          if (j % Math.max(1, Math.floor(data.timePoints.length / 50)) === 0) {
            heatmapPoints.push(point);
            endpointData.push(point);
          }
        });
        
        // Add aggregated endpoint statistics for tooltips
        const endpointInfo = {
          ...data,
          avgTime: data.totalTime / data.count,
          points: endpointData
        };
        
        endpointList.push(endpointInfo);
      });
      
      // Create the properly typed heatmap data
      setHeatmapData({
        points: heatmapPoints,
        endpoints: endpointList
      });
    } else {
      setHeatmapData({ points: [], endpoints: [] });
    }
  }, [requestsData, responseCodes]);
  
  // Animation for chart type change with smoother transitions
  const changeChartType = (type: ChartType) => {
    if (type === chartType) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setChartType(type);
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, 250);
  };
  
  // Enhanced tooltips with more information
  const tooltipFormatter = (value: number, name: string, props: any) => {
    if (name === 'avgResponseTime') return [`${value} ms`, 'Avg Response Time'];
    if (name === 'maxResponseTime') return [`${value} ms`, 'Max Response Time'];
    if (name === 'minResponseTime') return [`${value} ms`, 'Min Response Time'];
    if (name === 'requestCount') return [value, 'Request Count'];
    if (['200', '404', '500', '403', 'other'].includes(name)) {
      return [value, `${name} Responses`];
    }
    return [value, name];
  };
  
  // Custom tooltip for heatmap
  const CustomHeatmapTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black/80 backdrop-blur-md p-3 rounded-md border border-gray-700 shadow-xl text-xs">
          <p className="font-medium text-white mb-1">{data.endpoint}</p>
          <p className="text-gray-300">Response time: <span className="font-medium text-white">{data.y} ms</span></p>
          <p className="text-gray-300">Status code: <span className="font-medium text-white">{data.statusCode}</span></p>
          <p className="text-gray-300">Request frequency: <span className="font-medium text-white">{data.z}</span></p>
        </div>
      );
    }
    return null;
  };
  
  // Custom scatter chart for better heatmap visualization
  const renderCustomHeatmap = () => {
    if (!heatmapData.points || heatmapData.points.length === 0) {
      return (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          No data available for heatmap
        </div>
      );
    }
    
    return (
      <div className="h-full w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Endpoint" 
              tick={{ fill: '#94A3B8' }} 
              stroke="#4B5563" 
              label={{ value: 'Endpoints', position: 'bottom', fill: '#94A3B8' }}
              tickFormatter={(value) => {
                // Try to find the actual endpoint name for this x-value
                const endpoint = heatmapData.endpoints[Math.round(value)];
                return endpoint ? endpoint.name.substring(0, 3) : Math.round(value).toString();
              }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Response Time" 
              tick={{ fill: '#94A3B8' }} 
              stroke="#4B5563"
              label={{ value: 'Response Time (ms)', angle: -90, position: 'left', fill: '#94A3B8' }}
            />
            <ZAxis type="number" dataKey="z" range={[15, 100]} />
            <Tooltip content={<CustomHeatmapTooltip />} />
            <Scatter 
              name="Requests" 
              data={heatmapData.points} 
              fill="#8884d8"
              fillOpacity={0.8}
              animationDuration={1200}
              shape={(props) => {
                // Custom shape renders colored dots based on response time
                const { cx, cy, r, fill, payload } = props;
                return (
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={r} 
                    fill={payload.color || fill}
                    stroke="#fff"
                    strokeWidth={0.5}
                    strokeOpacity={0.5}
                    onMouseEnter={() => setHoveredPoint(payload)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                );
              }}
            />
            <ReferenceLine 
              y={300} 
              stroke="red" 
              strokeDasharray="3 3" 
              label={{ value: 'Slow Response', position: 'right', fill: 'red' }} 
            />
            <Brush 
              dataKey="y" 
              height={20} 
              stroke="#8884d8" 
              startIndex={0} 
              endIndex={Math.min(50, heatmapData.points.length - 1)}
            />
          </ScatterChart>
        </ResponsiveContainer>
        
        {/* Legend for response time colors */}
        <div className="absolute bottom-10 left-4 bg-black/30 backdrop-blur-sm p-2 rounded-md text-xs">
          <div className="font-medium mb-1 text-white">Response Time</div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#14B8A6]"></div>
              <span>&lt;100ms</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
              <span>&lt;200ms</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
              <span>&lt;300ms</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#F97316]"></div>
              <span>&lt;500ms</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
              <span>&gt;500ms</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Enhanced empty state with animation
  const renderEmptyState = () => (
    <div className="h-full flex items-center justify-center flex-col gap-3">
      {isScanning ? (
        <>
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-fuzzer-primary/20 border-t-fuzzer-primary animate-spin-slow"></div>
            <ScanLine className="absolute inset-0 m-auto h-6 w-6 text-fuzzer-primary animate-pulse" />
          </div>
          <div className="text-sm text-muted-foreground animate-slide-in-bottom">
            Collecting scan data...
          </div>
          {/* Add a loading graphic animation */}
          <div className="flex gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="w-2 h-2 rounded-full bg-fuzzer-primary/60"
                style={{
                  animation: 'bounce 1.5s infinite',
                  animationDelay: `${i * 0.15}s`
                }}
              ></div>
            ))}
          </div>
        </>
      ) : (
        <>
          <ScanLine className="h-8 w-8 text-muted-foreground animate-float" />
          <div className="text-sm text-muted-foreground">
            Start a scan to see visualization data
          </div>
          {/* Add suggestive animation */}
          <div className="text-xs text-muted-foreground/60 mt-1 flex items-center gap-1">
            <Wand2 className="h-3 w-3" />
            <span>Real-time analytics will appear here</span>
          </div>
        </>
      )}
    </div>
  );
  
  return (
    <Card className="neo-blur bg-card/30 border-border hover-scale frost-panel shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Activity className="h-5 w-5 text-fuzzer-primary animate-pulse" />
            Scan Visualization
            {isScanning && (
              <Badge className="ml-2 bg-fuzzer-primary/20 text-fuzzer-primary text-xs">Live</Badge>
            )}
          </CardTitle>
          
          <div className="flex bg-secondary/60 rounded-md shadow-md">
            <button 
              className={`p-1.5 rounded-l-md transition-all duration-200 ${chartType === 'line' ? 'bg-fuzzer-primary text-white shadow-inner glow-primary' : 'text-muted-foreground hover:bg-secondary/80'}`}
              onClick={() => changeChartType('line')}
              title="Line Chart"
            >
              <LineChartIcon className="h-4 w-4" />
            </button>
            <button 
              className={`p-1.5 transition-all duration-200 ${chartType === 'bar' ? 'bg-fuzzer-primary text-white shadow-inner glow-primary' : 'text-muted-foreground hover:bg-secondary/80'}`}
              onClick={() => changeChartType('bar')}
              title="Bar Chart"
            >
              <BarChartIcon className="h-4 w-4" />
            </button>
            <button 
              className={`p-1.5 transition-all duration-200 ${chartType === 'pie' ? 'bg-fuzzer-primary text-white shadow-inner glow-primary' : 'text-muted-foreground hover:bg-secondary/80'}`}
              onClick={() => changeChartType('pie')}
              title="Pie Chart"
            >
              <PieChartIcon className="h-4 w-4" />
            </button>
            <button 
              className={`p-1.5 rounded-r-md transition-all duration-200 ${chartType === 'heatmap' ? 'bg-fuzzer-primary text-white shadow-inner glow-primary' : 'text-muted-foreground hover:bg-secondary/80'}`}
              onClick={() => changeChartType('heatmap')}
              title="Heatmap"
            >
              <div className="flex items-center gap-1">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="2" />
                  <rect x="4" y="4" width="4" height="4" fill="currentColor" opacity="0.4" />
                  <rect x="10" y="4" width="4" height="4" fill="currentColor" opacity="0.2" />
                  <rect x="16" y="4" width="4" height="4" fill="currentColor" opacity="0.1" />
                  <rect x="4" y="10" width="4" height="4" fill="currentColor" opacity="0.3" />
                  <rect x="10" y="10" width="4" height="4" fill="currentColor" opacity="0.8" />
                  <rect x="16" y="10" width="4" height="4" fill="currentColor" opacity="0.5" />
                  <rect x="4" y="16" width="4" height="4" fill="currentColor" opacity="0.2" />
                  <rect x="10" y="16" width="4" height="4" fill="currentColor" opacity="0.6" />
                  <rect x="16" y="16" width="4" height="4" fill="currentColor" opacity="0.9" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className={`h-[280px] w-full overflow-hidden ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} transition-all duration-300`}>
          {chartData.length > 0 ? (
            <>
              {chartType === 'line' && (
                <div className="animate-scale-up">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                      <XAxis dataKey="name" tick={{ fill: '#94A3B8' }} stroke="#4B5563" />
                      <YAxis tick={{ fill: '#94A3B8' }} stroke="#4B5563" />
                      <Tooltip 
                        formatter={tooltipFormatter}
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '0.375rem' }}
                        labelStyle={{ color: '#E5E7EB' }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="avgResponseTime" 
                        stroke="#8B5CF6" 
                        activeDot={{ r: 8 }} 
                        name="Response Time (ms)" 
                        strokeWidth={2}
                        dot={{ strokeWidth: 2 }}
                        animationDuration={1500}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="maxResponseTime" 
                        stroke="#EF4444" 
                        strokeDasharray="5 5"
                        name="Max Response Time" 
                        strokeWidth={1.5}
                        dot={{ r: 3 }}
                        animationDuration={1500}
                      />
                      <Line type="monotone" dataKey="200" stroke="#10B981" name="200 OK" strokeWidth={2} animationDuration={1500} />
                      <Line type="monotone" dataKey="404" stroke="#F59E0B" name="404 Not Found" strokeWidth={2} animationDuration={1500} />
                      <Line type="monotone" dataKey="500" stroke="#EF4444" name="500 Server Error" strokeWidth={2} animationDuration={1500} />
                      <ReferenceLine y={300} stroke="red" strokeDasharray="3 3" label={{ value: 'Threshold', position: 'right', fill: 'red' }} />
                      <Brush dataKey="name" height={20} stroke="#8884d8" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              )}
              
              {chartType === 'bar' && (
                <div className="animate-scale-up">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                      <XAxis dataKey="name" tick={{ fill: '#94A3B8' }} stroke="#4B5563" />
                      <YAxis tick={{ fill: '#94A3B8' }} stroke="#4B5563" />
                      <Tooltip 
                        formatter={tooltipFormatter}
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '0.375rem' }}
                        labelStyle={{ color: '#E5E7EB' }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="200" 
                        name="200 OK" 
                        fill="#10B981" 
                        radius={[4, 4, 0, 0]} 
                        animationDuration={1500}
                        fillOpacity={0.8}
                      />
                      <Bar 
                        dataKey="404" 
                        name="404 Not Found" 
                        fill="#F59E0B" 
                        radius={[4, 4, 0, 0]} 
                        animationDuration={1500}
                        fillOpacity={0.8}
                      />
                      <Bar 
                        dataKey="500" 
                        name="500 Server Error" 
                        fill="#EF4444" 
                        radius={[4, 4, 0, 0]} 
                        animationDuration={1500}
                        fillOpacity={0.8}
                      />
                      <Bar 
                        dataKey="403" 
                        name="403 Forbidden" 
                        fill="#F97316" 
                        radius={[4, 4, 0, 0]} 
                        animationDuration={1500}
                        fillOpacity={0.8}
                      />
                      <Bar 
                        dataKey="other" 
                        name="Other" 
                        fill="#3B82F6" 
                        radius={[4, 4, 0, 0]} 
                        animationDuration={1500}
                        fillOpacity={0.8}
                      />
                      <Brush dataKey="name" height={20} stroke="#8884d8" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              )}
              
              {chartType === 'pie' && (
                <div className="animate-scale-up">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => {
                          if (typeof percent === 'number') {
                            return `${name}: ${(percent * 100).toFixed(0)}%`;
                          }
                          return name;
                        }}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                        animationDuration={1500}
                        animationBegin={0}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => {
                          const entry = pieData.find(d => d.name === name);
                          return [`${value} requests`, entry ? entry.description : name];
                        }}
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '0.375rem' }}
                        labelStyle={{ color: '#E5E7EB' }}
                      />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              )}
              
              {chartType === 'heatmap' && (
                <div className="animate-scale-up">
                  {renderCustomHeatmap()}
                </div>
              )}
            </>
          ) : (
            renderEmptyState()
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScanChart;
