import React from 'react';
import './FieldStyles.css';

const TextInput = ({ 
  name, 
  label, 
  placeholder, 
  required, 
  validation, 
  value, 
  onChange, 
  error 
}) => {
  const handleChange = (e) => {
    onChange(name, e.target.value);
  };

  return (
    <div className="field-container">
      <label htmlFor={name} className="field-label">
        {label}
        {required && <span className="required"> *</span>}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        placeholder={placeholder}
        value={value || ''}
        onChange={handleChange}
        className={`field-input ${error ? 'field-input-error' : ''}`}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default TextInput;
