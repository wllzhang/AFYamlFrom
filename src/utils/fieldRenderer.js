import React from 'react';
import PropTypes from 'prop-types';

/**
 * 通用的内联字段渲染器
 * 用于减少GroupField和ListField中的重复代码
 */
export const renderInlineField = (field, value, onChange) => {
  const fieldProps = {
    name: field.name,
    label: field.label,
    required: field.required,
    validation: field.validation,
    value: value || field.default,
    onChange: onChange,
    unit: field.unit
  };

  switch (field.type) {
    case 'text':
      return (
        <input
          type="text"
          name={fieldProps.name}
          value={fieldProps.value || ''}
          onChange={(e) => fieldProps.onChange(e.target.value)}
          className="field-input"
          placeholder={field.placeholder}
        />
      );
    
    case 'number':
      return (
        <input
          type="number"
          name={fieldProps.name}
          value={fieldProps.value || ''}
          onChange={(e) => fieldProps.onChange(e.target.value === '' ? '' : parseFloat(e.target.value))}
          className="field-input"
          min={field.validation?.min !== undefined ? Number(field.validation.min) : undefined}
          max={field.validation?.max !== undefined ? Number(field.validation.max) : undefined}
        />
      );
    
    case 'select':
      return (
        <select
          name={fieldProps.name}
          value={fieldProps.value || ''}
          onChange={(e) => fieldProps.onChange(e.target.value)}
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
      );
    
    case 'boolean':
      return (
        <div className="boolean-field">
          <input
            type="checkbox"
            name={fieldProps.name}
            checked={fieldProps.value || false}
            onChange={(e) => fieldProps.onChange(e.target.checked)}
            className="field-checkbox"
          />
          <label className="field-label">
            {field.label}
            {field.required && <span className="required"> *</span>}
          </label>
        </div>
      );
    
    case 'assembly':
      // 对于assembly类型，返回null，由调用方处理
      return null;
    
    default:
      return <div>未知字段类型: {field.type}</div>;
  }
};

/**
 * 字段配置的PropTypes定义
 */
export const fieldPropTypes = PropTypes.shape({
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  required: PropTypes.bool,
  validation: PropTypes.object,
  default: PropTypes.any,
  placeholder: PropTypes.string,
  unit: PropTypes.string,
  options: PropTypes.array,
  item_fields: PropTypes.array,
  target: PropTypes.string,
  multiple: PropTypes.bool,
  fields: PropTypes.array
});

/**
 * 创建字段容器的通用组件
 */
export const FieldContainer = ({ field, children }) => (
  <div className="field-container">
    <label className="field-label">
      {field.label}
      {field.required && <span className="required"> *</span>}
      {field.unit && <span className="unit"> ({field.unit})</span>}
    </label>
    {children}
  </div>
);

FieldContainer.propTypes = {
  field: fieldPropTypes.isRequired,
  children: PropTypes.node.isRequired
};