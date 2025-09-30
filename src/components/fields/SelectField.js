import React from 'react';
import './FieldStyles.css';

const SelectField = ({ 
  name, 
  label, 
  options = [], 
  default: defaultValue,
  required, 
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
      <select
        id={name}
        name={name}
        value={value || defaultValue || ''}
        onChange={handleChange}
        className={`field-select ${error ? 'field-input-error' : ''}`}
      >
        <option value="" disabled>
          请选择{label}
        </option>
        {options.map((option) => {
          // 支持两种格式：字符串数组或对象数组
          if (typeof option === 'string') {
            return (
              <option key={option} value={option}>
                {option}
              </option>
            );
          } else {
            return (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            );
          }
        })}
      </select>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default SelectField;
