import { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import './ChartDisplay.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ChartDisplay = ({ 
  csvData, 
  selectedColumns, 
  chartType, 
  onChartReady 
}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current && onChartReady) {
      onChartReady(chartRef.current);
    }
  }, [chartRef.current, onChartReady]);

  const processDataForChart = () => {
    if (!csvData || !selectedColumns[0]) return null;

    if (chartType === 'bar') {
      // Process data for bar chart
      const labels = csvData.map((row, index) => 
        row[selectedColumns[0]] || `Row ${index + 1}`
      ).slice(0, 20); // Limit to 20 items for readability
      
      const data = csvData.map(row => {
        const value = row[selectedColumns[0]];
        return typeof value === 'number' ? value : parseFloat(value) || 0;
      }).slice(0, 20);

      return {
        labels,
        datasets: [{
          label: selectedColumns[0],
          data,
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 205, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 2
        }]
      };
    } else if (chartType === 'pie' && selectedColumns[1]) {
      // Process data for pie chart
      const dataMap = new Map();
      
      csvData.forEach(row => {
        const category = row[selectedColumns[0]]?.toString() || 'Unknown';
        const value = typeof row[selectedColumns[1]] === 'number' 
          ? row[selectedColumns[1]] 
          : parseFloat(row[selectedColumns[1]]) || 0;
        
        if (dataMap.has(category)) {
          dataMap.set(category, dataMap.get(category) + value);
        } else {
          dataMap.set(category, value);
        }
      });

      const sortedEntries = Array.from(dataMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // Limit to top 10 categories

      return {
        labels: sortedEntries.map(entry => entry[0]),
        datasets: [{
          data: sortedEntries.map(entry => entry[1]),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      };
    }

    return null;
  };

  const chartData = processDataForChart();
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      },
      title: {
        display: true,
        text: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`,
        padding: 20,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#fff',
        borderWidth: 1
      }
    },
    ...(chartType === 'bar' && {
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    })
  };

  if (!chartData) {
    return (
      <div className="chart-placeholder" role="status" aria-label="No chart data available">
        <p>Select columns to generate your chart</p>
      </div>
    );
  }

  return (
    <div className="chart-container" role="img" aria-label={`${chartType} chart display`}>
      <div className="chart-wrapper">
        {chartType === 'bar' ? (
          <Bar ref={chartRef} data={chartData} options={options} />
        ) : (
          <Pie ref={chartRef} data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default ChartDisplay;
