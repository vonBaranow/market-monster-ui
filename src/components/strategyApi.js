const API_BASE_URL = 'http://localhost:8081'; // Make sure this matches your backend URL

export const fetchStrategies = async () => {
  const response = await fetch(`${API_BASE_URL}/api/strategies`);
  if (!response.ok) {
    throw new Error('Failed to fetch strategies');
  }
  return response.json();
};

export const saveStrategy = async (strategy) => {
  const url = strategy.id
    ? `${API_BASE_URL}/api/strategies/${strategy.id}`
    : `${API_BASE_URL}/api/strategies`;
  const method = strategy.id ? 'PUT' : 'POST';
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(strategy),
  });
  if (!response.ok) {
    throw new Error('Failed to save strategy');
  }
  return response.json();
};

export const deleteStrategy = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/strategies/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete strategy');
  }
};

export const calculateStrategy = async (id, params) => {
  const { symbol, interval, startDate, endDate } = params;
  const queryParams = new URLSearchParams({
    symbol,
    timeframe: interval,
    startDate: new Date(startDate).toISOString(),
    endDate: new Date(endDate).toISOString()
  }).toString();
  
  const url = `${API_BASE_URL}/api/strategies/${id}/calculate?${queryParams}`;
  console.log('Calling URL:', url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error('Full response object:', response);
      let errorMessage = `Failed to calculate strategy results. Status: ${response.status}`;
      try {
        const errorBody = await response.text();
        console.error('Error response body:', errorBody);
        const errorJson = JSON.parse(errorBody);
        if (errorJson.message) {
          errorMessage += ` - ${errorJson.message}`;
        }
      } catch (e) {
        console.error('Error parsing error response:', e);
      }
      throw new Error(errorMessage);
    }
    const data = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('Error calculating strategy:', error);
    throw error;
  }
};