import React from 'react';
import './FieldStyles.css';

const NumberInput = ({ 
  name, 
  label, 
  placeholder, 
  required, 
  validation, 
  value, 
  onChange, 
  error,
  unit,
  min,
  max
}) => {
  const handleChange = (e) => {
    const value = e.target.value === '' ? '' : parseFloat(e.target.value);
    onChange(name, value);
  };

  return (
    <div className="field-container">
      <label htmlFor={name} className="field-label">
        {label}
        {required && <span className="required"> *</span>}
        {unit && <span className="unit"> ({unit})</span>}
      </label>
      <input
        type="number"
        id={name}
        name={name}
        placeholder={placeholder}
        value={value || ''}
        onChange={handleChange}
        min={min}
        max={max}
        className={`field-input ${error ? 'field-input-error' : ''}`}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default NumberInput;
