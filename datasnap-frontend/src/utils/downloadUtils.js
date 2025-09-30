export const downloadChartAsPNG = (chartRef, chartType) => {
  if (!chartRef?.current) {
    throw new Error('Chart reference not available');
  }

  try {
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
    
    return true;
  } catch (error) {
    console.error('Failed to download chart:', error);
    throw new Error('Failed to download chart. Please try again.');
  }
};

export const generateFileName = (chartType, extension = 'png') => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
  return `datasnap-${chartType}-chart-${timestamp}.${extension}`;
};
