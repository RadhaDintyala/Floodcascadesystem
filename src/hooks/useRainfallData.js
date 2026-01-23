/** @ts-nocheck */
/**
 * useRainfallData - React hook for fetching real-time rainfall data from Python backend
 * Browser APIs: fetch, console, setInterval, clearInterval
 * @typedef {Object} RainfallData
 * @property {Array} criticalZones - List of critical flood zones
 * @property {Array} riskAnalysis - Detailed risk analysis data
 * @property {Object} impactData - Infrastructure impact metrics
 * @property {Object} metadata - Data metadata
 * @property {Array} alerts - Active alerts
 * @property {boolean} loading - Loading state
 * @property {string|null} error - Error message
 * @property {Function} refetch - Manual refetch function
 */

import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

export const useRainfallData = () => {
  const [data, setData] = useState({
    criticalZones: [],
    riskAnalysis: [],
    impactData: {},
    metadata: {},
    alerts: [],
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch(`${API_BASE_URL}/rainfall-data`);
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      
      const result = await response.json();
      setData({
        criticalZones: result.criticalZones || [],
        riskAnalysis: result.riskAnalysis || [],
        impactData: result.impactData || {},
        metadata: result.metadata || {},
        alerts: result.alerts || [],
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('❌ Error fetching rainfall data:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
    }
  }, []);

  // Fetch on mount and set up interval
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchData]);

  return { ...data, refetch: fetchData };
};

/**
 * useAlerts - React hook for fetching active alerts
 * @returns {Object} Alerts data with refetch function
 */
export const useAlerts = () => {
  const [alerts, setAlerts] = useState({
    data: [],
    loading: true,
    error: null,
  });

  const fetchAlerts = useCallback(async () => {
    try {
      setAlerts(prev => ({ ...prev, loading: true }));
      const response = await fetch(`${API_BASE_URL}/alerts`);
      if (!response.ok) throw new Error('Failed to fetch alerts');
      
      const result = await response.json();
      setAlerts({
        data: result.alerts || [],
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('❌ Error fetching alerts:', error);
      setAlerts(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  return { ...alerts, refetch: fetchAlerts };
};

/**
 * useRiskAnalysis - React hook for fetching detailed risk analysis
 * @returns {Object} Risk analysis data
 */
export const useRiskAnalysis = () => {
  const [analysis, setAnalysis] = useState({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/risk-analysis`);
        if (!response.ok) throw new Error('Failed to fetch risk analysis');
        
        const result = await response.json();
        setAnalysis({
          data: result.analysis || [],
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('❌ Error fetching risk analysis:', error);
        setAnalysis(prev => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
      }
    };

    fetchAnalysis();
    const interval = setInterval(fetchAnalysis, 30000);
    return () => clearInterval(interval);
  }, []);

  return analysis;
};
