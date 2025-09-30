import React, { useState, useEffect } from 'react';
import yaml from 'js-yaml';
import DynamicForm from './components/DynamicForm';
import './App.css';

function App() {
  const [formsConfig, setFormsConfig] = useState(null);
  const [rawYamlText, setRawYamlText] = useState('');

  // 加载表单配置
  useEffect(() => {
    const loadFormsConfig = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/config/form-config.yaml`);
        const yamlText = await response.text();
        setRawYamlText(yamlText);
        const config = yaml.load(yamlText);
        setFormsConfig(config.forms);
      } catch (error) {
        console.error('加载表单配置失败:', error);
      }
    };

    loadFormsConfig();
  }, []);

  if (!formsConfig) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="App">
      <div className="forms-container">
        <h1 className="main-title">表单配置系统</h1>
        <div className="forms-grid">
          {formsConfig.map((formItem, index) => (
            <DynamicForm 
              key={index}
              formConfig={formItem.form}
              rawYamlText={rawYamlText}
              allForms={formsConfig}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

