import React from 'react';
import './FieldStyles.css';

const BooleanField = ({ 
  name, 
  label, 
  required, 
  validation, 
  value, 
  onChange, 
  error 
}) => {
  const handleChange = (e) => {
    onChange(name, e.target.checked);
  };

  return (
    <div className="field-container">
      <div className="boolean-field">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={value || false}
          onChange={handleChange}
          className={`field-checkbox ${error ? 'field-input-error' : ''}`}
        />
        <label htmlFor={name} className="field-label">
          {label}
          {required && <span className="required"> *</span>}
        </label>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default BooleanField;
