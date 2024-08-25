import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import PropTypes from 'prop-types';

// Register the necessary components with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MarketChart = ({ data }) => {
  // Prepare data for the chart
  const chartData = {
    labels: data.map((d) => new Date(d.openTime).toLocaleString()), // Convert openTime to readable format
    datasets: [
      {
        label: 'Close Price',
        data: data.map((d) => d.closePrice), // Data for the y-axis
        borderColor: 'rgba(75,192,192,1)', // Line color
        backgroundColor: 'rgba(75,192,192,0.2)', // Fill color under the line
        pointRadius: 0, // Remove point markers for cleaner look
        borderWidth: 2, // Make line thicker
        tension: 0.4, // Smooth line curves
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 20,
          font: {
            size: 14,
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 14,
          },
        },
        grid: {
          color: "rgba(200, 200, 200, 0.2)",
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 16,
          },
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(tooltipItem) {
            return `Close Price: ${tooltipItem.raw.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`;
          }
        }
      },
    },
  };

  // JSX for rendering the chart
  return (
    <div className="chart-container" style={{ height: '500px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

// PropTypes validation
MarketChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      openTime: PropTypes.string.isRequired,
      closePrice: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default MarketChart;
