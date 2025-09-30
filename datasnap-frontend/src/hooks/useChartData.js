import { useState, useMemo } from 'react';

export const useChartData = (csvData, selectedColumns, chartType) => {
  const [processedData, setProcessedData] = useState(null);

  const chartData = useMemo(() => {
    if (!csvData || !selectedColumns[0]) return null;

    if (chartType === 'bar') {
      const labels = csvData.map((row, index) => 
        row[selectedColumns[0]] || `Row ${index + 1}`
      ).slice(0, 20);
      
      const data = csvData.map(row => {
        const value = row[selectedColumns[0]];
        return typeof value === 'number' ? value : parseFloat(value) || 0;
      }).slice(0, 20);

      return {
        labels,
        datasets: [{
          label: selectedColumns[0],
          data,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2
        }]
      };
    }

    if (chartType === 'pie' && selectedColumns[1]) {
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
        .slice(0, 10);

      return {
        labels: sortedEntries.map(entry => entry[0]),
        datasets: [{
          data: sortedEntries.map(entry => entry[1]),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
          ]
        }]
      };
    }

    return null;
  }, [csvData, selectedColumns, chartType]);

  return { chartData, processedData, setProcessedData };
};
