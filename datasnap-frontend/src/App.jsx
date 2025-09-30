import { useState, useRef, useEffect } from 'react';
import ErrorBoundary from './Components/ErrorBoundary';
import FileUpload from './Components/FileUpload';
import ColumnSelector from './Components/ColumnSelector';
import ChartTypeSelector from './Components/ChartTypeSelector';
import ChartDisplay from './Components/ChartDisplay';
import DownloadButton from './Components/DownloadButton';
import { useCSVParser } from './hooks/useCSVParser';
import './App.css';

function App() {
  const {
    csvData,
    columns,
    error,
    handleFileUpload,
    handleError,
    reset
  } = useCSVParser();

  const [selectedColumns, setSelectedColumns] = useState(['', '']);
  const [chartType, setChartType] = useState('bar');
  const [currentStep, setCurrentStep] = useState(1);
  const chartRef = useRef(null);

  
  useEffect(() => {
    if (currentStep === 1 && csvData) setCurrentStep(2);
  }, [csvData]);

  const handleStepProgression = () => {
    if (currentStep === 2 && selectedColumns[0]) setCurrentStep(3);
  };

  const handleReset = () => {
    reset();
    setSelectedColumns(['', '']);
    setCurrentStep(1);
    setChartType('bar');
  };

  const isChartReady = () => {
    return csvData && selectedColumns[0] && (chartType === 'bar' || (chartType === 'pie' && selectedColumns[1]));
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <header className="app-header">
          <h1>DataSnap - Quick Data Visualizer</h1>
          <p>Upload your CSV file and create beautiful charts instantly</p>
        </header>

        <main className="app-main">
          <div className="progress-indicator" role="progressbar" aria-valuenow={currentStep} aria-valuemin="1" aria-valuemax="3">
            <div className="progress-steps">
              <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1. Upload</div>
              <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2. Configure</div>
              <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3. Visualize</div>
            </div>
          </div>

          {error && (
            <div className="error-message" role="alert">
              <p><strong>Error:</strong> {error}</p>
              <button onClick={handleReset} className="error-reset-button">Try Again</button>
            </div>
          )}

          {currentStep === 1 && (
            <section className="upload-section">
              <FileUpload
                onFileUpload={handleFileUpload}
                onError={handleError}
              />
            </section>
          )}

          {currentStep === 2 && csvData && (
            <section className="configuration-section">
              <div className="config-grid">
                <div className="column-selection">
                  <ColumnSelector
                    columns={columns}
                    selectedColumns={selectedColumns}
                    onColumnSelect={setSelectedColumns}
                    chartType={chartType}
                  />
                </div>

                <div className="chart-type-selection">
                  <ChartTypeSelector
                    selectedType={chartType}
                    onTypeSelect={setChartType}
                  />
                </div>
              </div>

              <div className="navigation-buttons">
                <button onClick={handleReset} className="secondary-button">Start Over</button>
                <button onClick={handleStepProgression} disabled={!selectedColumns[0]} className="primary-button">
                  Generate Chart
                </button>
              </div>
            </section>
          )}

          {currentStep === 3 && isChartReady() && (
            <section className="visualization-section">
              <div className="chart-section">
                <ChartDisplay
                  csvData={csvData}
                  selectedColumns={selectedColumns}
                  chartType={chartType}
                  onChartReady={(chart) => {
                    chartRef.current = chart;
                  }}
                />

                <div className="chart-actions">
                  <button onClick={() => setCurrentStep(2)} className="secondary-button">
                    Modify Chart
                  </button>
                  <DownloadButton chartRef={chartRef} chartType={chartType} disabled={!chartRef.current} />
                </div>
              </div>
            </section>
          )}
        </main>

        <footer className="app-footer">
          <p>DataSnap - Built with React, Chart.js, and PapaParse</p>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
