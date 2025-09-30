import { useState } from 'react';
import './DownloadButton.css';

const DownloadButton = ({ chartRef, chartType, disabled }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadChart = async () => {
    if (!chartRef?.current || disabled) return;

    setIsDownloading(true);
    
    try {
      // Get the chart canvas element
      const chart = chartRef.current;
      const canvas = chart.canvas;
      
      // Convert canvas to blob
      const imageData = canvas.toDataURL('image/png', 1.0);
      
      // Create download link
      const link = document.createElement('a');
      link.download = `${chartType}-chart-${Date.now()}.png`;
      link.href = imageData;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Failed to download chart:', error);
      alert('Failed to download chart. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={downloadChart}
      disabled={disabled || isDownloading}
      className={`download-button ${disabled ? 'disabled' : ''}`}
      aria-label="Download chart as PNG image"
    >
      {isDownloading ? (
        <>
          <span className="spinner" aria-hidden="true"></span>
          Downloading...
        </>
      ) : (
        <>
          <span className="download-icon" aria-hidden="true">⬇️</span>
          Download Chart (PNG)
        </>
      )}
    </button>
  );
};

export default DownloadButton;
