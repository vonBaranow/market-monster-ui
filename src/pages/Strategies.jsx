import StrategiesComponent from '../components/StrategiesComponent';
import { StrategyProvider } from '../components/StrategyContext';

const Strategies = () => {
  return (
    <div style={styles.container}>
      <StrategyProvider>
        <StrategiesComponent />
      </StrategyProvider>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
};

export default Strategies;