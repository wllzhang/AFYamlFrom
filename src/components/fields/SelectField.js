import React from 'react';
import PropTypes from 'prop-types';
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
        aria-describedby={error ? `${name}-error` : undefined}
        aria-invalid={!!error}
        aria-required={required}
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
      {error && <div id={`${name}-error`} className="error-message" role="alert" aria-live="polite">{error}</div>}
    </div>
  );
};

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired
    })
  ])),
  default: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  required: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string
};

SelectField.defaultProps = {
  options: [],
  required: false,
  value: '',
  error: null
};

export default SelectField;
