import StrategiesComponent from '../components/StrategiesComponent';

const Strategies = () => {
  return (
    <div style={styles.container}>
      <StrategiesComponent />
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