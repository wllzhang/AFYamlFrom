import React from 'react';
import PropTypes from 'prop-types';
import './FieldStyles.css';

const NumberInput = React.memo(({ 
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
        aria-describedby={error ? `${name}-error` : undefined}
        aria-invalid={!!error}
        aria-required={required}
      />
      {error && <div id={`${name}-error`} className="error-message" role="alert" aria-live="polite">{error}</div>}
    </div>
  );
});

NumberInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  validation: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  unit: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number
};

NumberInput.defaultProps = {
  placeholder: '',
  required: false,
  validation: null,
  value: '',
  error: null,
  unit: '',
  min: undefined,
  max: undefined
};

export default NumberInput;
