import React, { useState, useEffect } from 'react';
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
import './DynamicForm.css';

const DynamicForm = ({ formConfig, rawYamlText, allForms = [] }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [showRawCode, setShowRawCode] = useState(false);

  // 初始化表单数据
  useEffect(() => {
    if (formConfig) {
      initializeFormData(formConfig);
    }
  }, [formConfig]);

  // 初始化表单数据
  const initializeFormData = (form) => {
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
  };

  // 获取当前表单的原始代码
  const getCurrentFormRawCode = () => {
    if (!formConfig) return '';
    
    // 直接返回 formConfig 中的 raw_code 字段值
    return formConfig.raw_code || '';
  };

  // 处理字段值变化
  const handleFieldChange = (fieldName, value) => {
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
  };

  // 渲染字段组件
  const renderField = (field) => {
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
            min={field.validation?.min}
            max={field.validation?.max}
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
  };

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

  return (
    <div className="dynamic-form-container">
      <div className="form-header">
        <h2 className="form-title">{formConfig.title}</h2>
        <div className="form-name">
          <span className="form-name-label">key:</span>
          <span className="form-name-value">{formConfig.name}</span>
        </div>
       
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
      </div>

      {showRawCode && (
        <div className="raw-code-container">
          <pre className="raw-code">
            <code>{getCurrentFormRawCode()}</code>
          </pre>
        </div>
      )}

      <form onSubmit={handleSubmit} className="dynamic-form">
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
          <div className={`submit-message ${submitMessage.includes('成功') ? 'success' : 'error'}`}>
            {submitMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default DynamicForm;
