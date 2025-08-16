import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081'; // Make sure this matches your backend URL

export const fetchMarketData = async (formData) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/market-data`, {
      params: {
        exchange: formData.exchange,
        symbol: formData.symbol,
        interval: formData.interval,
        startTime: formData.startTime,
        endTime: formData.endTime
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw new Error(error.response ? error.response.data : error.message);
  }
};

// New functions for strategy operations

export const fetchStrategies = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/strategies`);
    return response.data;
  } catch (error) {
    console.error('Error fetching strategies:', error);
    throw new Error(error.response ? error.response.data : error.message);
  }
};

export const fetchStrategyById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/strategies/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching strategy with id ${id}:`, error);
    throw new Error(error.response ? error.response.data : error.message);
  }
};

export const createStrategy = async (strategyData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/strategies`, strategyData);
    return response.data;
  } catch (error) {
    console.error('Error creating strategy:', error);
    throw new Error(error.response ? error.response.data : error.message);
  }
};

export const updateStrategy = async (id, strategyData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/strategies/${id}`, strategyData);
    return response.data;
  } catch (error) {
    console.error(`Error updating strategy with id ${id}:`, error);
    throw new Error(error.response ? error.response.data : error.message);
  }
};

export const deleteStrategy = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/strategies/${id}`);
  } catch (error) {
    console.error(`Error deleting strategy with id ${id}:`, error);
    throw new Error(error.response ? error.response.data : error.message);
  }
};

export const calculateStrategyResults = async (id, params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/strategies/${id}/calculate`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error calculating results for strategy with id ${id}:`, error);
    throw new Error(error.response ? error.response.data : error.message);
  }
};