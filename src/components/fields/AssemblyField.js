import React, { useState, useEffect, useRef, useCallback } from 'react';
import './FieldStyles.css';

const AssemblyField = React.memo(({ 
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
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectorRef = useRef(null);
  const optionsRef = useRef(null);

  // 同步外部value变化到内部状态
  useEffect(() => {
    setSelectedItems(value || (multiple ? [] : null));
  }, [value, multiple]);

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

  const handleSelect = useCallback((option) => {
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
  }, [multiple, selectedItems, onChange, name]);

  const handleRemove = useCallback((itemToRemove) => {
    if (multiple) {
      const newSelection = selectedItems.filter(item => item !== itemToRemove);
      setSelectedItems(newSelection);
      onChange(name, newSelection);
    }
  }, [multiple, selectedItems, onChange, name]);

  const getDisplayValue = () => {
    if (multiple) {
      return selectedItems.length > 0 ? `${selectedItems.length} 项已选择` : '请选择...';
    } else {
      const selected = options.find(opt => opt.name === selectedItems);
      return selected ? selected.name : '请选择...';
    }
  };

  // 键盘事件处理
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => (prev + 1) % options.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => prev <= 0 ? options.length - 1 : prev - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && options[focusedIndex]) {
          handleSelect(options[focusedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        selectorRef.current?.focus();
        break;
      case 'Tab':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      // 使用setTimeout确保在mousedown之后执行
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="field-container">
      <label className="field-label">
        {label}
        {required && <span className="required"> *</span>}
      </label>
      
      <div className="assembly-field">
        <div 
          ref={selectorRef}
          className="assembly-selector"
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-describedby={error ? `${name}-error` : undefined}
          aria-invalid={!!error}
          aria-required={required}
        >
          <span className="assembly-value">{getDisplayValue()}</span>
          <span className="assembly-arrow" aria-hidden="true">{isOpen ? '▲' : '▼'}</span>
        </div>
        
        {isOpen && (
          <div 
            ref={optionsRef}
            className="assembly-options"
            role="listbox"
            aria-label={`${label}选项`}
          >
            {options.map((option, index) => (
              <div
                key={option.name}
                className={`assembly-option ${
                  (multiple ? selectedItems.includes(option.name) : selectedItems === option.name) 
                    ? 'selected' : ''
                } ${index === focusedIndex ? 'focused' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(option);
                }}
                role="option"
                aria-selected={multiple ? selectedItems.includes(option.name) : selectedItems === option.name}
                tabIndex={-1}
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
      
      {error && <div id={`${name}-error`} className="error-message" role="alert" aria-live="polite">{error}</div>}
    </div>
  );
});

export default AssemblyField;
