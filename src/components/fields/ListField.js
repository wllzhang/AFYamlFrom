import React, { useState } from 'react';
import './FieldStyles.css';

const ListField = ({ 
  name, 
  label, 
  required, 
  validation, 
  value, 
  onChange, 
  error,
  item_fields
}) => {
  // 初始化项目，为每个项目设置默认值
  const initializeItems = (initialValue) => {
    if (initialValue && initialValue.length > 0) {
      return initialValue;
    }
    
    // 如果没有初始值，创建一个带有默认值的项目
    const initialItem = {};
    item_fields.forEach(field => {
      if (field.default !== undefined) {
        initialItem[field.name] = field.default;
      }
    });
    
    return [initialItem];
  };

  const [items, setItems] = useState(initializeItems(value));

  const handleItemChange = (index, fieldName, fieldValue) => {
    const newItems = [...items];
    if (!newItems[index]) {
      newItems[index] = {};
    }
    newItems[index][fieldName] = fieldValue;
    setItems(newItems);
    onChange(name, newItems);
  };

  const addItem = () => {
    // 为新项目设置默认值
    const newItem = {};
    item_fields.forEach(field => {
      if (field.default !== undefined) {
        newItem[field.name] = field.default;
      }
    });
    
    const newItems = [...items, newItem];
    setItems(newItems);
    onChange(name, newItems);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      onChange(name, newItems);
    }
  };

  const renderItemField = (field, itemValue, itemIndex) => {
    const commonProps = {
      name: `${name}_${itemIndex}_${field.name}`,
      label: field.label,
      required: field.required,
      validation: field.validation,
      value: itemValue[field.name] || field.default,
      onChange: (fieldName, fieldValue) => handleItemChange(itemIndex, field.name, fieldValue),
      unit: field.unit
    };

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            {...commonProps}
            className="field-input"
            placeholder={field.placeholder}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            {...commonProps}
            className="field-input"
            min={field.validation?.min}
            max={field.validation?.max}
          />
        );
      case 'select':
        return (
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
      
      <div className="list-field">
        {items.map((item, index) => (
          <div key={index} className="list-item">
            <div className="list-item-header">
              <span>项目 {index + 1}</span>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="remove-item-btn"
                >
                  删除
                </button>
              )}
            </div>
            <div className="list-item-fields">
              {item_fields.map(field => (
                <div key={field.name} className="list-item-field">
                  <label className="field-label">
                    {field.label}
                    {field.required && <span className="required"> *</span>}
                    {field.unit && <span className="unit"> ({field.unit})</span>}
                  </label>
                  {renderItemField(field, item, index)}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <button
          type="button"
          onClick={addItem}
          className="add-item-btn"
        >
          添加项目
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ListField;
