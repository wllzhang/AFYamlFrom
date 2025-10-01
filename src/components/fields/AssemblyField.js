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
  const [isDragOver, setIsDragOver] = useState(false);
  const selectorRef = useRef(null);
  const optionsRef = useRef(null);

  // 同步外部value变化到内部状态
  useEffect(() => {
    setSelectedItems(value || (multiple ? [] : null));
  }, [value, multiple]);

  // 根据表单类型返回对应的图标
  const getTypeIcon = (type) => {
    const iconMap = {
      'launched_platform_type': '🚀',
      'weapon': '⚔️',
      'weapon_effects': '💥',
      'sensor': '📡',
      'antenna_pattern': '📶',
      'platform_type': '✈️',
      'route': '🗺️',
      'platform': '🎯',
      'radar_signature': '📊',
      'infrared_signature': '🔴',
      'optical_signature': '👁️',
      'processor': '⚙️'
    };
    return iconMap[type] || '📄';
  };

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
        title: form.title || form.name,
        type: form.type,
        description: form.description || '',
        icon: getTypeIcon(form.type)
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
      return selected ? (
        <span className="assembly-display-value">
          <span className="assembly-icon">{selected.icon}</span>
          <span className="assembly-name">{selected.name}</span>
          <span className="assembly-title-hint"> - {selected.title}</span>
        </span>
      ) : '请选择...';
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

  // 处理拖拽进入
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const data = e.dataTransfer.getData('application/json');
      if (data) {
        const dragData = JSON.parse(data);
        // 只允许拖放匹配 target 类型的表单
        if (dragData.type === target) {
          e.dataTransfer.dropEffect = 'copy';
          setIsDragOver(true);
        } else {
          e.dataTransfer.dropEffect = 'none';
        }
      }
    } catch (err) {
      // 如果还没有数据，预先设置为允许拖放
      e.dataTransfer.dropEffect = 'copy';
      setIsDragOver(true);
    }
  }, [target]);

  // 处理拖拽离开
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  // 处理拖放
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    try {
      const data = e.dataTransfer.getData('application/json');
      if (!data) return;

      const dragData = JSON.parse(data);
      
      // 检查类型是否匹配
      if (dragData.type !== target) {
        return;
      }

      // 查找是否存在这个选项
      const option = options.find(opt => opt.name === dragData.name);
      if (!option) return;

      // 添加到选中项
      if (multiple) {
        if (!selectedItems.includes(dragData.name)) {
          const newSelection = [...selectedItems, dragData.name];
          setSelectedItems(newSelection);
          onChange(name, newSelection);
        }
      } else {
        setSelectedItems(dragData.name);
        onChange(name, dragData.name);
      }
    } catch (err) {
      console.error('拖放处理错误:', err);
    }
  }, [target, options, multiple, selectedItems, onChange, name]);

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
          className={`assembly-selector ${isDragOver ? 'drag-over' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          tabIndex={0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-describedby={error ? `${name}-error` : undefined}
          aria-invalid={!!error}
          aria-required={required}
        >
          <span className="assembly-value">
            {isDragOver ? (
              <span className="drag-hint">
                📥 拖放表单到这里
              </span>
            ) : (
              getDisplayValue()
            )}
          </span>
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
                <div className="assembly-option-content">
                  <div className="assembly-option-header">
                    <span className="assembly-option-icon">{option.icon}</span>
                    <span className="assembly-option-name">{option.name}</span>
                  </div>
                  <div className="assembly-option-title">{option.title}</div>
                  <div className="assembly-option-type">[{option.type}]</div>
                </div>
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
                  <span className="selected-item-icon">{option?.icon || '📄'}</span>
                  <span className="selected-item-name">{option?.name || item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemove(item)}
                    className="remove-selected-btn"
                    aria-label={`移除 ${option?.name || item}`}
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
