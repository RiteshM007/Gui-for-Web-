
import { toast } from "sonner";

// Types for the fuzzing operations
export interface FuzzingParameters {
  targetUrl: string;
  protocol: string;
  method: string;
  fuzzType: string;
  payloadType: string;
  headers: string;
  payloads: string;
  followRedirects: boolean;
  detectErrors: boolean;
  enableAiAnalysis: boolean;
  threadCount: number;
  delay: number;
  attackMode: 'standard' | 'aggressive';
}

export interface FuzzingResult {
  id: number;
  url: string;
  method: string;
  payload: string;
  status: number;
  responseTime: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  finding: string;
  alertDetected?: boolean;
  errorDetected?: boolean;
  bodyWordCountChanged?: boolean;
}

// Base URL for the Python backend (adjust as needed)
const API_BASE_URL = "http://localhost:5000";

export const fuzzingService = {
  // Start a fuzzing scan with the provided parameters
  startScan: async (params: FuzzingParameters): Promise<{ success: boolean, message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/start-fuzzing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to start fuzzing scan');
      }
      
      return { success: true, message: data.message || 'Fuzzing scan started successfully' };
    } catch (error) {
      console.error('Error starting fuzzing scan:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
  },

  // Get current fuzzing results
  getResults: async (): Promise<FuzzingResult[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/fuzzing-results`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch fuzzing results');
      }
      
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching fuzzing results:', error);
      toast.error("Failed to fetch fuzzing results", {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      return [];
    }
  },

  // Stop an ongoing fuzzing scan
  stopScan: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stop-fuzzing`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to stop fuzzing scan');
      }
      
      return true;
    } catch (error) {
      console.error('Error stopping fuzzing scan:', error);
      toast.error("Failed to stop fuzzing scan", {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      return false;
    }
  },

  // Get ML analysis of current results
  getAnomalyAnalysis: async (): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/anomaly-analysis`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch anomaly analysis');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching anomaly analysis:', error);
      return null;
    }
  }
};
