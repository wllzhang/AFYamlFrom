import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import yaml from 'js-yaml';
import TextInput from './fields/TextInput';
import EmailInput from './fields/EmailInput';
import PasswordInput from './fields/PasswordInput';
import SelectField from './fields/SelectField';
import CheckboxField from './fields/CheckboxField';
import NumberInput from './fields/NumberInput';
import BooleanField from './fields/BooleanField';
import ListField from './fields/ListField';
import AssemblyField from './fields/AssemblyField';
import NumberArrayField from './fields/NumberArrayField';
import GroupField from './fields/GroupField';
import { validateForm, validateField } from '../utils/validation';
import { getTypeIcon, getTypeColor } from '../utils/typeConfig';
import './DynamicForm.css';

const DynamicForm = ({ 
  formConfig, 
  rawYamlText, 
  allForms = [],
  formIndex,
  isDraggingForm = false,
  isBeingDragged = false,
  onFormDragStart,
  onFormDragEnd,
  onFormDrop
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [showRawCode, setShowRawCode] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 初始化表单数据
  const initializeFormData = useCallback((form) => {
    const initialData = {};
    form.fields.forEach(field => {
      if (field.default !== undefined) {
        initialData[field.name] = field.default;
      } else if (field.type === 'list') {
        initialData[field.name] = [{}];
      } else if (field.type === 'assembly' && field.multiple) {
        initialData[field.name] = [];
      } else if (field.type === 'boolean') {
        initialData[field.name] = false;
      } else if (field.type === 'number[]') {
        initialData[field.name] = field.default || [];
      } else if (field.type === 'group') {
        initialData[field.name] = {};
      }
    });
    setFormData(initialData);
    setErrors({});
  }, []);

  // 初始化表单数据
  useEffect(() => {
    if (formConfig) {
      initializeFormData(formConfig);
    }
  }, [formConfig, initializeFormData]);

  // 获取当前表单的原始代码
  const getCurrentFormRawCode = useMemo(() => {
    if (!formConfig) return '';
    
    // 直接返回 formConfig 中的 raw_code 字段值
    return formConfig.raw_code || '';
  }, [formConfig]);

  // 处理字段值变化
  const handleFieldChange = useCallback((fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // 实时验证
    if (formConfig) {
      const field = formConfig.fields.find(f => f.name === fieldName);
      if (field) {
        const error = validateField(field.type, value, field.validation, field);
        setErrors(prev => ({
          ...prev,
          [fieldName]: error
        }));
      }
    }
  }, [formConfig]);

  // 渲染字段组件
  const renderField = useCallback((field) => {
    const commonProps = {
      name: field.name,
      label: field.label,
      required: field.required,
      validation: field.validation,
      error: errors[field.name],
      value: formData[field.name],
      onChange: handleFieldChange
    };

    switch (field.type) {
      case 'text':
        return <TextInput {...commonProps} placeholder={field.placeholder} />;
      case 'email':
        return <EmailInput {...commonProps} placeholder={field.placeholder} />;
      case 'password':
        return <PasswordInput {...commonProps} placeholder={field.placeholder} />;
      case 'number':
        return (
          <NumberInput 
            {...commonProps} 
            unit={field.unit}
            min={field.validation?.min !== undefined ? Number(field.validation.min) : undefined}
            max={field.validation?.max !== undefined ? Number(field.validation.max) : undefined}
          />
        );
      case 'boolean':
        return <BooleanField {...commonProps} />;
      case 'list':
        return (
          <ListField 
            {...commonProps} 
            item_fields={field.item_fields}
          />
        );
      case 'assembly':
        return (
          <AssemblyField 
            {...commonProps} 
            target={field.target}
            multiple={field.multiple}
            allForms={allForms}
          />
        );
      case 'number[]':
        return (
          <NumberArrayField 
            {...commonProps} 
            unit={field.unit}
            default={field.default}
          />
        );
      case 'group':
        return (
          <GroupField 
            {...commonProps} 
            fields={field.fields}
            allForms={allForms}
          />
        );
      case 'select':
        return (
          <SelectField 
            {...commonProps} 
            options={field.options}
            default={field.default}
          />
        );
      case 'checkbox':
        return (
          <CheckboxField 
            {...commonProps} 
            default={field.default}
          />
        );
      default:
        return <div>未知字段类型: {field.type}</div>;
    }
  }, [errors, formData, allForms, handleFieldChange]);

  // 提交表单
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    const validationResult = validateForm(formData, formConfig.fields);
    setErrors(validationResult.errors);

    if (!validationResult.isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitMessage('提交成功！');
      console.log('表单数据:', formData);
    } catch (error) {
      setSubmitMessage('提交失败，请重试。');
      console.error('提交错误:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formConfig) {
    return <div className="loading">加载中...</div>;
  }

  // 处理拖拽开始
  const handleDragStart = (e) => {
    const dragData = {
      name: formConfig.name,
      title: formConfig.title,
      type: formConfig.type,
      icon: getTypeIcon(formConfig.type),
      isFormSort: true,
      formIndex: formIndex
    };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
    
    // 添加拖拽样式
    e.currentTarget.classList.add('dragging');
    
    // 在 body 上添加拖动类型，用于高亮目标字段
    document.body.setAttribute('data-dragging-type', formConfig.type || '');
    document.body.classList.add('is-dragging-form');
    
    // 通知父组件开始拖拽
    if (onFormDragStart) {
      onFormDragStart();
    }
  };

  // 处理拖拽结束
  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
    
    // 移除 body 上的拖动状态
    document.body.removeAttribute('data-dragging-type');
    document.body.classList.remove('is-dragging-form');
    
    // 通知父组件结束拖拽
    if (onFormDragEnd) {
      onFormDragEnd();
    }
  };

  // 处理拖拽悬停（用于排序）
  const handleDragOver = (e) => {
    if (isDraggingForm && !isBeingDragged) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    }
  };

  // 处理放置（用于排序）
  const handleDrop = (e) => {
    if (isDraggingForm && !isBeingDragged) {
      e.preventDefault();
      e.stopPropagation();
      
      if (onFormDrop) {
        onFormDrop();
      }
    }
  };

  return (
    <div 
      className={`dynamic-form-container ${isBeingDragged ? 'being-dragged' : ''} ${isDraggingForm && !isBeingDragged ? 'drop-target' : ''}`}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={formConfig.type ? {
        borderLeft: `4px solid ${getTypeColor(formConfig.type)}`
      } : {}}
    >
      <div className="form-header">
        <div className="form-header-top">
          <div className="form-title-section">
            <h2 className="form-title">
              {formConfig.type && (
                <span className="form-title-icon">{getTypeIcon(formConfig.type)}</span>
              )}
              <span className="form-title-text">{formConfig.title}</span>
            </h2>
            <div className="form-name">
              <span className="form-name-label">key:</span>
              <span className="form-name-value">{formConfig.name}</span>
            </div>
            {formConfig.type && (
              <div className="form-type">
                <span className="form-type-label">type:</span>
                <span 
                  className="form-type-value"
                  style={{
                    backgroundColor: `${getTypeColor(formConfig.type)}15`,
                    borderColor: `${getTypeColor(formConfig.type)}40`,
                    color: getTypeColor(formConfig.type)
                  }}
                >
                  {formConfig.type}
                </span>
              </div>
            )}
          </div>
          <button 
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="collapse-button"
            aria-label={isCollapsed ? '展开表单' : '折叠表单'}
            title={isCollapsed ? '展开表单' : '折叠表单'}
          >
            {isCollapsed ? '▼' : '▲'}
          </button>
        </div>
        
        {!isCollapsed && (
          <>
            {formConfig.description && (
              <p className="form-description">{formConfig.description}</p>
            )}
            <button 
              type="button"
              onClick={() => setShowRawCode(!showRawCode)}
              className="raw-code-button"
            >
              {showRawCode ? '隐藏原始代码' : '显示原始代码'}
            </button>
          </>
        )}
      </div>

      {!isCollapsed && showRawCode && (
        <div className="raw-code-container">
          <pre className="raw-code">
            <code>{getCurrentFormRawCode}</code>
          </pre>
        </div>
      )}

      {!isCollapsed && (
        <form onSubmit={handleSubmit} className="dynamic-form" role="form" aria-label={formConfig.title}>
        {formConfig.fields.map(field => (
          <div key={field.name}>
            {renderField(field)}
          </div>
        ))}

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? '提交中...' : '提交配置'}
          </button>
        </div>

        {submitMessage && (
          <div 
            className={`submit-message ${submitMessage.includes('成功') ? 'success' : 'error'}`}
            role="alert"
            aria-live="polite"
          >
            {submitMessage}
          </div>
        )}
        </form>
      )}
    </div>
  );
};

// 字段配置的PropTypes定义
const fieldPropTypes = PropTypes.shape({
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

// 表单配置的PropTypes定义
const formConfigPropTypes = PropTypes.shape({
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  type: PropTypes.string,
  raw_code: PropTypes.string,
  fields: PropTypes.arrayOf(fieldPropTypes).isRequired
});

DynamicForm.propTypes = {
  formConfig: formConfigPropTypes.isRequired,
  rawYamlText: PropTypes.string,
  allForms: PropTypes.arrayOf(PropTypes.shape({
    form: formConfigPropTypes
  })),
  formIndex: PropTypes.number,
  isDraggingForm: PropTypes.bool,
  isBeingDragged: PropTypes.bool,
  onFormDragStart: PropTypes.func,
  onFormDragEnd: PropTypes.func,
  onFormDrop: PropTypes.func
};

DynamicForm.defaultProps = {
  rawYamlText: '',
  allForms: [],
  formIndex: 0,
  isDraggingForm: false,
  isBeingDragged: false,
  onFormDragStart: null,
  onFormDragEnd: null,
  onFormDrop: null
};

export default DynamicForm;
