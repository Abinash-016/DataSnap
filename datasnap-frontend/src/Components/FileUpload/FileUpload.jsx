import { useState, useRef } from 'react';
import Papa from 'papaparse';
import './FileUpload.css';

const FileUpload = ({ onFileUpload, onError }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!file.type.includes('csv') && !file.name.endsWith('.csv')) {
      throw new Error('Please upload a CSV file only');
    }
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('File size must be less than 2MB');
    }
  };

  const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data.length > 10000) {
            reject(new Error('CSV file must contain fewer than 10,000 rows'));
            return;
          }
          if (results.errors.length > 0) {
            reject(new Error('CSV parsing failed: ' + results.errors[0].message));
            return;
          }
          resolve({
            data: results.data,
            columns: results.meta.fields,
            rowCount: results.data.length,
          });
        },
        error: (error) => {
          reject(new Error('Failed to parse CSV: ' + error.message));
        },
      });
    });
  };

  const handleFileProcess = async (file) => {
    setIsUploading(true);
    console.log('Start processing file:', file.name);
    try {
      validateFile(file);
      const parsedResult = await parseCSV(file);
      console.log('Parsed CSV Data:', parsedResult);
      onFileUpload(parsedResult);
      if (fileInputRef.current) {
        setTimeout(() => {
          fileInputRef.current.value = null; // reset to allow reupload of same file
        }, 0);
      }
    } catch (error) {
      console.error('File processing error:', error.message);
      onError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    console.log('Files dropped:', files);
    if (files.length > 0) handleFileProcess(files[0]);
  };

  const handleFileSelect = (e) => {
    console.log('File select event triggered');
    const files = Array.from(e.target.files);
    console.log('Selected files:', files);
    if (files.length > 0) handleFileProcess(files[0]);
  };

  return (
    <div
      className={`file-upload ${isDragActive ? 'drag-active' : ''}`}
      onDragEnter={() => setIsDragActive(true)}
      onDragLeave={() => setIsDragActive(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      aria-label="Upload CSV file"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".csv"
        style={{ display: 'none' }}
        id="csv-file-input"
      />

      <div className="upload-content">
        {isUploading ? (
          <div className="upload-loading">
            <div className="spinner" aria-label="Uploading file"></div>
            <p>Processing CSV file...</p>
          </div>
        ) : (
          <>
            <div className="upload-icon" aria-hidden="true">📊</div>
            <h3>Upload your CSV file</h3>
            <p>Drag and drop your CSV file here, or click to browse</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="upload-button"
            >
              Choose File
            </button>
            <small className="upload-restrictions">
              Maximum 2MB, up to 10,000 rows
            </small>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
