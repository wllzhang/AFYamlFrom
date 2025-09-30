import React from 'react';
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
    const commonProps = {
      name: field.name,
      label: field.label,
      required: field.required,
      validation: field.validation,
      value: value?.[field.name],
      onChange: handleFieldChange,
      unit: field.unit,
      default: field.default
    };

    switch (field.type) {
      case 'text':
        return (
          <div>
            <label className="field-label">
              {field.label}
              {field.required && <span className="required"> *</span>}
            </label>
            <input
              type="text"
              {...commonProps}
              className="field-input"
              placeholder={field.placeholder}
            />
          </div>
        );
      case 'number':
        return (
          <div>
            <label className="field-label">
              {field.label}
              {field.required && <span className="required"> *</span>}
              {field.unit && <span className="unit"> ({field.unit})</span>}
            </label>
            <input
              type="number"
              {...commonProps}
              className="field-input"
              min={field.validation?.min}
              max={field.validation?.max}
            />
          </div>
        );
      case 'boolean':
        return (
          <div className="boolean-field">
            <input
              type="checkbox"
              {...commonProps}
              className="field-checkbox"
              checked={commonProps.value || false}
            />
            <label className="field-label">
              {field.label}
              {field.required && <span className="required"> *</span>}
            </label>
          </div>
        );
      case 'select':
        return (
          <div>
            <label className="field-label">
              {field.label}
              {field.required && <span className="required"> *</span>}
            </label>
            <select
              {...commonProps}
              className="field-select"
            >
              <option value="" disabled>
                请选择{field.label}
              </option>
              {field.options?.map((option) => {
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
          </div>
        );
      case 'assembly':
        // 导入AssemblyField组件
        const AssemblyField = require('./AssemblyField').default;
        return (
          <AssemblyField 
            {...commonProps} 
            target={field.target}
            multiple={field.multiple}
            allForms={allForms}
          />
        );
      default:
        return <div>未知字段类型: {field.type}</div>;
    }
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

export default GroupField;
