import React, { useState } from 'react';
import './FieldStyles.css';

const NumberArrayField = ({ 
  name, 
  label, 
  required, 
  validation, 
  value, 
  onChange, 
  error,
  unit,
  default: defaultValue
}) => {
  const [items, setItems] = useState(value || defaultValue || []);

  const handleItemChange = (index, newValue) => {
    const newItems = [...items];
    newItems[index] = newValue === '' ? '' : parseFloat(newValue);
    setItems(newItems);
    onChange(name, newItems);
  };

  const addItem = () => {
    const newItems = [...items, ''];
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

  return (
    <div className="field-container">
      <label className="field-label">
        {label}
        {required && <span className="required"> *</span>}
        {unit && <span className="unit"> ({unit})</span>}
      </label>
      
      <div className="number-array-field">
        {items.map((item, index) => (
          <div key={index} className="number-array-item">
            <input
              type="number"
              value={item || ''}
              onChange={(e) => handleItemChange(index, e.target.value)}
              className="field-input"
              placeholder={`项目 ${index + 1}`}
            />
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

export default NumberArrayField;
