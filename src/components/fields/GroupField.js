import React from 'react';
import PropTypes from 'prop-types';
import { renderInlineField, fieldPropTypes } from '../../utils/fieldRenderer';
import AssemblyField from './AssemblyField';
import './FieldStyles.css';

const GroupField = ({ 
  name, 
  label, 
  required, 
  validation, 
  value, 
  onChange, 
  error,
  fields = [],
  allForms = []
}) => {
  // 处理组内字段值变化
  const handleFieldChange = (fieldName, fieldValue) => {
    const newValue = {
      ...value,
      [fieldName]: fieldValue
    };
    onChange(name, newValue);
  };

  // 渲染组内字段
  const renderGroupField = (field) => {
    const fieldValue = value?.[field.name];
    const handleFieldValueChange = (fieldValue) => handleFieldChange(field.name, fieldValue);

    // 对于assembly类型，使用专门的组件
    if (field.type === 'assembly') {
      return (
        <AssemblyField 
          name={field.name}
          label={field.label}
          required={field.required}
          validation={field.validation}
          value={fieldValue}
          onChange={(fieldName, fieldValue) => handleFieldChange(field.name, fieldValue)}
          target={field.target}
          multiple={field.multiple}
          allForms={allForms}
        />
      );
    }

    // 对于其他类型，使用通用渲染器
    return (
      <div>
        {field.type !== 'boolean' && (
          <label className="field-label">
            {field.label}
            {field.required && <span className="required"> *</span>}
            {field.unit && <span className="unit"> ({field.unit})</span>}
          </label>
        )}
        {renderInlineField(field, fieldValue, handleFieldValueChange)}
      </div>
    );
  };

  return (
    <div className="field-container">
      <label className="field-label">
        {label}
        {required && <span className="required"> *</span>}
      </label>
      
      <div className="group-field">
        {fields.map(field => (
          <div key={field.name} className="group-field-item">
            {renderGroupField(field)}
          </div>
        ))}
      </div>
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

GroupField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  validation: PropTypes.object,
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  fields: PropTypes.arrayOf(fieldPropTypes),
  allForms: PropTypes.array
};

GroupField.defaultProps = {
  required: false,
  validation: null,
  value: {},
  error: null,
  fields: [],
  allForms: []
};

export default GroupField;
