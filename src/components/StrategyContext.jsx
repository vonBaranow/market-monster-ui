import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const StrategyContext = createContext();

export const useStrategyContext = () => useContext(StrategyContext);

export const StrategyProvider = ({ children }) => {
  const [strategies, setStrategies] = useState([]);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [results, setResults] = useState(null);

  return (
    <StrategyContext.Provider
      value={{
        strategies,
        setStrategies,
        selectedStrategy,
        setSelectedStrategy,
        results,
        setResults,
      }}
    >
      {children}
    </StrategyContext.Provider>
  );
};

StrategyProvider.propTypes = {
  children: PropTypes.node.isRequired,
};