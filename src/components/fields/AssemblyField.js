import React, { useState, useEffect } from 'react';
import './FieldStyles.css';

const AssemblyField = ({ 
  name, 
  label, 
  required, 
  validation, 
  value, 
  onChange, 
  error,
  target,
  multiple = false,
  allForms = [] // 接收所有表单配置
}) => {
  const [selectedItems, setSelectedItems] = useState(value || (multiple ? [] : null));
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState([]);

  // 根据target动态获取匹配的表单选项
  useEffect(() => {
    if (!target || !allForms.length) {
      setOptions([]);
      return;
    }

    // 查找所有type匹配target的表单
    const matchingForms = allForms.filter(formItem => {
      const form = formItem.form;
      return form.type === target;
    });

    // 生成选项列表
    const formOptions = matchingForms.map(formItem => {
      const form = formItem.form;
      return {
        name: form.name,
        title: form.title || form.name
      };
    });

    setOptions(formOptions);
  }, [target, allForms]);

  const handleSelect = (option) => {
    if (multiple) {
      const newSelection = selectedItems.includes(option.name) 
        ? selectedItems.filter(item => item !== option.name)
        : [...selectedItems, option.name];
      setSelectedItems(newSelection);
      onChange(name, newSelection);
    } else {
      setSelectedItems(option.name);
      onChange(name, option.name);
      setIsOpen(false);
    }
  };

  const handleRemove = (itemToRemove) => {
    if (multiple) {
      const newSelection = selectedItems.filter(item => item !== itemToRemove);
      setSelectedItems(newSelection);
      onChange(name, newSelection);
    }
  };

  const getDisplayValue = () => {
    if (multiple) {
      return selectedItems.length > 0 ? `${selectedItems.length} 项已选择` : '请选择...';
    } else {
      const selected = options.find(opt => opt.name === selectedItems);
      return selected ? selected.name : '请选择...';
    }
  };

  return (
    <div className="field-container">
      <label className="field-label">
        {label}
        {required && <span className="required"> *</span>}
      </label>
      
      <div className="assembly-field">
        <div 
          className="assembly-selector"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="assembly-value">{getDisplayValue()}</span>
          <span className="assembly-arrow">{isOpen ? '▲' : '▼'}</span>
        </div>
        
        {isOpen && (
          <div className="assembly-options">
            {options.map(option => (
              <div
                key={option.name}
                className={`assembly-option ${
                  (multiple ? selectedItems.includes(option.name) : selectedItems === option.name) 
                    ? 'selected' : ''
                }`}
                onClick={() => handleSelect(option)}
              >
                {option.name}
              </div>
            ))}
          </div>
        )}
        
        {multiple && selectedItems.length > 0 && (
          <div className="selected-items">
            {selectedItems.map(item => {
              const option = options.find(opt => opt.name === item);
              return (
                <div key={item} className="selected-item">
                  <span>{option?.name || item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemove(item)}
                    className="remove-selected-btn"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default AssemblyField;
