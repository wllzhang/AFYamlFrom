import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import yaml from 'js-yaml';
import DynamicForm from './components/DynamicForm';
import './App.css';

function App() {
  const [formsConfig, setFormsConfig] = useState(null);
  const [rawYamlText, setRawYamlText] = useState('');
  const [loadingError, setLoadingError] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [allCollapsed, setAllCollapsed] = useState(false);

  // 加载表单配置
  useEffect(() => {
    const loadFormsConfig = async () => {
      try {
        setLoadingError(null);
        const response = await fetch(`${process.env.PUBLIC_URL}/config/form-config.yaml`);
        
        if (!response.ok) {
          throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
        }
        
        const yamlText = await response.text();
        setRawYamlText(yamlText);
        
        // 使用安全的YAML解析
        const config = yaml.load(yamlText, { schema: yaml.FAILSAFE_SCHEMA });
        
        if (!config || !config.forms) {
          throw new Error('配置文件格式错误：缺少forms字段');
        }
        
        setFormsConfig(config.forms);
      } catch (error) {
        console.error('加载表单配置失败:', error);
        setLoadingError(error.message || '加载配置文件时发生未知错误');
      }
    };

    loadFormsConfig();
  }, []);

  // 处理表单排序的拖拽开始
  const handleFormDragStart = (index) => {
    setDraggedIndex(index);
  };

  // 处理表单排序的拖拽结束
  const handleFormDragEnd = () => {
    setDraggedIndex(null);
  };

  // 处理表单排序的放置
  const handleFormDrop = (dropIndex) => {
    if (draggedIndex === null || draggedIndex === dropIndex) {
      return;
    }

    const newForms = [...formsConfig];
    const [draggedForm] = newForms.splice(draggedIndex, 1);
    newForms.splice(dropIndex, 0, draggedForm);
    
    setFormsConfig(newForms);
    setDraggedIndex(null);
  };

  // 显示错误状态
  if (loadingError) {
    return (
      <div className="App">
        <div className="forms-container">
          <div className="error-container">
            <h1 className="error-title">配置加载失败</h1>
            <p className="error-message">{loadingError}</p>
            <button 
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              重新加载
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 显示加载状态
  if (!formsConfig) {
    return (
      <div className="App">
        <div className="forms-container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>正在加载表单配置...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="forms-container">
        <div className="header-section">
          <h1 className="main-title">表单配置系统</h1>
          <button 
            className="toggle-all-button"
            onClick={() => setAllCollapsed(!allCollapsed)}
            title={allCollapsed ? '展开所有表单' : '折叠所有表单'}
          >
            {allCollapsed ? '📂 展开所有' : '📁 折叠所有'}
          </button>
        </div>
        <div className="forms-grid">
          {formsConfig.map((formItem, index) => (
            <DynamicForm 
              key={formItem.form.name}
              formConfig={formItem.form}
              rawYamlText={rawYamlText}
              allForms={formsConfig}
              formIndex={index}
              isDraggingForm={draggedIndex !== null}
              isBeingDragged={draggedIndex === index}
              onFormDragStart={() => handleFormDragStart(index)}
              onFormDragEnd={handleFormDragEnd}
              onFormDrop={() => handleFormDrop(index)}
              globalCollapsed={allCollapsed}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

