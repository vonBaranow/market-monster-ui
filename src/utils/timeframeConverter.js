// utils/timeframeConverter.js

// Define a mapping from human-readable values to backend CandlestickInterval values
export const intervalMapping = {
    '1 minute': 'ONE_MINUTE',
    '3 minutes': 'THREE_MINUTES',
    '5 minutes': 'FIVE_MINUTES',
    '15 minutes': 'FIFTEEN_MINUTES',
    '30 minutes': 'HALF_HOURLY',
    '1 hour': 'HOURLY',
    '2 hours': 'TWO_HOURLY',
    '4 hours': 'FOUR_HOURLY',
    '6 hours': 'SIX_HOURLY',
    '8 hours': 'EIGHT_HOURLY',
    '12 hours': 'TWELVE_HOURLY',
    '1 day': 'DAILY',
    '3 days': 'THREE_DAILY',
    '1 week': 'WEEKLY',
    '1 month': 'MONTHLY'
  };
  
  // Utility function to convert human-readable value to CandlestickInterval
  export const convertToCandlestickInterval = (interval) => {
    return intervalMapping[interval] || null;
  };
  