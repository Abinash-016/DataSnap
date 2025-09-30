import { useState, useCallback } from 'react';

export const useCSVParser = () => {
  const [csvData, setCsvData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = useCallback((result) => {
    setCsvData(result.data);
    setColumns(result.columns);
    setError(null);
  }, []);

  const handleError = useCallback((errorMessage) => {
    setError(errorMessage);
    setCsvData(null);
    setColumns([]);
  }, []);

  const reset = useCallback(() => {
    setCsvData(null);
    setColumns([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    csvData,
    columns,
    isLoading,
    error,
    handleFileUpload,
    handleError,
    reset
  };
};
