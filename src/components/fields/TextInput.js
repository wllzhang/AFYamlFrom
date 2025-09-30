import React from 'react';
import PropTypes from 'prop-types';
import './FieldStyles.css';

const TextInput = React.memo(({ 
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
        aria-describedby={error ? `${name}-error` : undefined}
        aria-invalid={!!error}
        aria-required={required}
      />
      {error && <div id={`${name}-error`} className="error-message" role="alert" aria-live="polite">{error}</div>}
    </div>
  );
});

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  validation: PropTypes.object,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string
};

TextInput.defaultProps = {
  placeholder: '',
  required: false,
  validation: null,
  value: '',
  error: null
};

export default TextInput;
