import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import PropTypes from 'prop-types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MarketDataChart = ({ marketData, strategyResults }) => {
  const parseTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    if (!isNaN(date.getTime())) {
      return date;
    }
    console.error('Invalid date:', timestamp);
    return null;
  };

  const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleString();
  };

  const chartData = {
    labels: marketData.map(candle => formatDate(parseTimestamp(candle.openTime))),
    datasets: [
      {
        label: 'Asset Price',
        data: marketData.map(candle => ({
          x: formatDate(parseTimestamp(candle.openTime)),
          y: parseFloat(candle.closePrice)
        })),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        yAxisID: 'y'
      }
    ]
  };

  if (strategyResults && strategyResults.equity && strategyResults.timestamps) {
    chartData.datasets.push({
      label: 'Strategy Equity',
      data: strategyResults.equity.map((value, index) => ({
        x: formatDate(parseTimestamp(strategyResults.timestamps[index])),
        y: value
      })),
      borderColor: 'rgb(255, 99, 132)',
      tension: 0.1,
      yAxisID: 'y1'
    });
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Market Data and Strategy Performance'
      }
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Asset Price'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Strategy Equity'
        },
        grid: {
          drawOnChartArea: false,
        },
      }
    }
  };

  return <Line data={chartData} options={options} />;
};

MarketDataChart.propTypes = {
  marketData: PropTypes.arrayOf(
    PropTypes.shape({
      openTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      closePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
  strategyResults: PropTypes.shape({
    equity: PropTypes.arrayOf(PropTypes.number),
    timestamps: PropTypes.arrayOf(PropTypes.string)
  })
};

export default MarketDataChart;