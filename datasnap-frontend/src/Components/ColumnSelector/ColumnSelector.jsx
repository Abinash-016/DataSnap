import './ColumnSelector.css';

const ColumnSelector = ({ 
  columns, 
  selectedColumns, 
  onColumnSelect, 
  chartType
}) => {
  const getColumnOptions = () => {
    return columns.filter(col => col && col.trim() !== '');
  };

  const handleColumnChange = (columnIndex, value) => {
    const newColumns = [...selectedColumns];
    newColumns[columnIndex] = value;
    onColumnSelect(newColumns);
  };

  const isValidSelection = () => {
    if (chartType === 'pie') {
      return selectedColumns[0] && selectedColumns[1] && 
             selectedColumns[0] !== selectedColumns[1];
    }
    return selectedColumns[0] !== '';
  };

  return (
    <div className="column-selector" role="region" aria-labelledby="column-selector-heading">
      <h3 id="column-selector-heading">Select Data Columns</h3>
      
      <div className="selector-group">
        <label htmlFor="column-1" className="selector-label">
          {chartType === 'pie' ? 'Categories Column:' : 'Data Column:'}
        </label>
        <select
          id="column-1"
          value={selectedColumns[0] || ''}
          onChange={(e) => handleColumnChange(0, e.target.value)}
          className="column-select"
          aria-describedby="column-1-help"
        >
          <option value="">Select a column...</option>
          {getColumnOptions().map(column => (
            <option key={column} value={column}>
              {column}
            </option>
          ))}
        </select>
        <small id="column-1-help" className="help-text">
          {chartType === 'pie' ? 'Choose the column containing category names' : 'Choose the column containing numeric values'}
        </small>
      </div>

      {chartType === 'pie' && (
        <div className="selector-group">
          <label htmlFor="column-2" className="selector-label">
            Values Column:
          </label>
          <select
            id="column-2"
            value={selectedColumns[1] || ''}
            onChange={(e) => handleColumnChange(1, e.target.value)}
            className="column-select"
            aria-describedby="column-2-help"
          >
            <option value="">Select a column...</option>
            {getColumnOptions()
              .filter(col => col !== selectedColumns[0])
              .map(column => (
                <option key={column} value={column}>
                  {column}
                </option>
              ))}
          </select>
          <small id="column-2-help" className="help-text">
            Choose the column containing numeric values for each category
          </small>
        </div>
      )}

      {!isValidSelection() && selectedColumns[0] && (
        <div className="validation-message" role="alert">
          Please select {chartType === 'pie' ? 'two different columns' : 'a valid column'} to continue.
        </div>
      )}
    </div>
  ); 
};

export default ColumnSelector;
