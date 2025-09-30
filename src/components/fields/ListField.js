import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { renderInlineField, fieldPropTypes } from '../../utils/fieldRenderer';
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
    const fieldValue = itemValue[field.name] || field.default;
    const handleFieldChange = (fieldValue) => handleItemChange(itemIndex, field.name, fieldValue);
    
    return renderInlineField(field, fieldValue, handleFieldChange);
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

ListField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  validation: PropTypes.object,
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  item_fields: PropTypes.arrayOf(fieldPropTypes).isRequired
};

ListField.defaultProps = {
  required: false,
  validation: null,
  value: [],
  error: null
};

export default ListField;
