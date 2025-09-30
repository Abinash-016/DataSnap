import './ChartTypeSelector.css';

const ChartTypeSelector = ({ selectedType, onTypeSelect }) => {
  const chartTypes = [
    {
      id: 'bar',
      name: 'Bar Chart',
      icon: '📊',
      description: 'Great for comparing values across categories'
    },
    {
      id: 'pie',
      name: 'Pie Chart', 
      icon: '🥧',
      description: 'Perfect for showing proportions and percentages'
    }
  ];

  return (
    <div className="chart-type-selector" role="radiogroup" aria-labelledby="chart-type-heading">
      <h3 id="chart-type-heading">Choose Chart Type</h3>
      
      <div className="chart-type-options">
        {chartTypes.map(type => (
          <label 
            key={type.id}
            className={`chart-type-option ${selectedType === type.id ? 'selected' : ''}`}
          >
            <input
              type="radio"
              name="chartType"
              value={type.id}
              checked={selectedType === type.id}
              onChange={(e) => onTypeSelect(e.target.value)}
              className="chart-type-input"
            />
            <div className="chart-type-content">
              <div className="chart-type-icon" aria-hidden="true">
                {type.icon}
              </div>
              <div className="chart-type-info">
                <h4>{type.name}</h4>
                <p>{type.description}</p>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ChartTypeSelector;
