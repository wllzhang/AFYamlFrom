import React from 'react';
import './FieldStyles.css';

const CheckboxField = ({ 
  name, 
  label, 
  required, 
  default: defaultValue,
  value, 
  onChange, 
  error 
}) => {
  const handleChange = (e) => {
    onChange(name, e.target.checked);
  };

  return (
    <div className="field-container">
      <div className="checkbox-container">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={value || defaultValue || false}
          onChange={handleChange}
          className={`checkbox-input ${error ? 'field-input-error' : ''}`}
        />
        <label htmlFor={name} className="checkbox-label">
          {label}
          {required && <span className="required"> *</span>}
        </label>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default CheckboxField;
