// 表单验证工具函数

/**
 * 验证文本字段
 * @param {string} value - 要验证的值
 * @param {Object} validation - 验证规则
 * @returns {string|null} - 错误消息或null
 */
export const validateText = (value, validation) => {
  if (!validation) return null;

  // 必填验证
  if (validation.required && (!value || value.trim() === '')) {
    return `${validation.label || '此字段'}是必填项`;
  }

  // 如果不填写且非必填，则通过验证
  if (!value || value.trim() === '') {
    return null;
  }

  // 最小长度验证
  if (validation.min_length && value.length < validation.min_length) {
    return `长度不能少于${validation.min_length}个字符`;
  }

  // 最大长度验证
  if (validation.max_length && value.length > validation.max_length) {
    return `长度不能超过${validation.max_length}个字符`;
  }

  // 正则表达式验证
  if (validation.pattern) {
    const pattern = new RegExp(validation.pattern);
    if (!pattern.test(value)) {
      return validation.error_message || '格式不正确';
    }
  }

  return null;
};

/**
 * 验证邮箱字段
 * @param {string} value - 要验证的值
 * @param {Object} validation - 验证规则
 * @returns {string|null} - 错误消息或null
 */
export const validateEmail = (value, validation) => {
  if (!validation) return null;

  // 必填验证
  if (validation.required && (!value || value.trim() === '')) {
    return `${validation.label || '电子邮箱'}是必填项`;
  }

  // 如果不填写且非必填，则通过验证
  if (!value || value.trim() === '') {
    return null;
  }

  // 邮箱格式验证
  const emailRegex = validation.regex ? new RegExp(validation.regex) : /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return validation.error_message || '请输入有效的电子邮箱地址';
  }

  return null;
};

/**
 * 验证密码字段安全
 * @param {string} value - 要验证的值
 * @param {Object} validation - 验证规则
 * @returns {string|null} - 错误消息或null
 */
export const validatePassword = (value, validation) => {
  if (!validation) return null;

  // 必填验证
  if (validation.required && (!value || value.trim() === '')) {
    return `${validation.label || '密码'}是必填项`;
  }

  // 如果不填写且非必填，则通过验证
  if (!value || value.trim() === '') {
    return null;
  }

  // 最小长度验证
  if (validation.min_length && value.length < validation.min_length) {
    return validation.error_message || `密码长度至少为${validation.min_length}位`;
  }

  return null;
};

/**
 * 验证复选框字段
 * @param {boolean} value - 要验证的值
 * @param {Object} validation - 验证规则
 * @returns {string|null} - 错误消息或null
 */
export const validateCheckbox = (value, validation) => {
  if (!validation) return null;

  // 必填验证
  if (validation.required && !value) {
    return validation.error_message || `${validation.label || '此字段'}是必填项`;
  }

  return null;
};

/**
 * 验证数字字段
 * @param {number} value - 要验证的值
 * @param {Object} validation - 验证规则
 * @returns {string|null} - 错误消息或null
 */
export const validateNumber = (value, validation) => {
  if (!validation) return null;

  // 必填验证
  if (validation.required && (value === null || value === undefined || value === '')) {
    return `${validation.label || '此字段'}是必填项`;
  }

  // 如果不填写且非必填，则通过验证
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const numValue = parseFloat(value);

  // 检查是否为有效数字
  if (isNaN(numValue)) {
    return '请输入有效的数字';
  }

  // 最小值验证
  if (validation.min !== undefined && numValue < validation.min) {
    return `值不能小于 ${validation.min}`;
  }

  // 最大值验证
  if (validation.max !== undefined && numValue > validation.max) {
    return `值不能大于 ${validation.max}`;
  }

  return null;
};

/**
 * 验证列表字段
 * @param {Array} value - 要验证的值
 * @param {Object} validation - 验证规则
 * @returns {string|null} - 错误消息或null
 */
export const validateList = (value, validation) => {
  if (!validation) return null;

  // 必填验证
  if (validation.required && (!value || !Array.isArray(value) || value.length === 0)) {
    return `${validation.label || '此字段'}是必填项`;
  }

  // 如果不填写且非必填，则通过验证
  if (!value || !Array.isArray(value) || value.length === 0) {
    return null;
  }

  // 最小项目数验证
  if (validation.min_items && value.length < validation.min_items) {
    return `至少需要 ${validation.min_items} 个项目`;
  }

  // 最大项目数验证
  if (validation.max_items && value.length > validation.max_items) {
    return `最多允许 ${validation.max_items} 个项目`;
  }

  return null;
};

/**
 * 验证装配字段
 * @param {string|Array} value - 要验证的值
 * @param {Object} validation - 验证规则
 * @param {Object} fieldConfig - 字段配置
 * @returns {string|null} - 错误消息或null
 */
export const validateAssembly = (value, validation, fieldConfig) => {
  if (!validation) return null;

  // 必填验证
  if (validation.required) {
    if (fieldConfig.multiple) {
      if (!value || !Array.isArray(value) || value.length === 0) {
        return `${fieldConfig.label || '此字段'}是必填项`;
      }
    } else {
      if (!value || value === '') {
        return `${fieldConfig.label || '此字段'}是必填项`;
      }
    }
  }

  return null;
};

/**
 * 验证数字数组字段
 * @param {Array} value - 要验证的值
 * @param {Object} validation - 验证规则
 * @returns {string|null} - 错误消息或null
 */
export const validateNumberArray = (value, validation) => {
  if (!validation) return null;

  // 必填验证
  if (validation.required && (!value || !Array.isArray(value) || value.length === 0)) {
    return `${validation.label || '此字段'}是必填项`;
  }

  // 如果不填写且非必填，则通过验证
  if (!value || !Array.isArray(value) || value.length === 0) {
    return null;
  }

  // 验证数组中的每个元素都是有效数字
  for (let i = 0; i < value.length; i++) {
    const numValue = parseFloat(value[i]);
    if (isNaN(numValue)) {
      return `第${i + 1}个元素不是有效的数字`;
    }

    // 最小值验证
    if (validation.min !== undefined && numValue < validation.min) {
      return `第${i + 1}个元素不能小于 ${validation.min}`;
    }

    // 最大值验证
    if (validation.max !== undefined && numValue > validation.max) {
      return `第${i + 1}个元素不能大于 ${validation.max}`;
    }
  }

  // 最小长度验证
  if (validation.min_length && value.length < validation.min_length) {
    return `至少需要 ${validation.min_length} 个元素`;
  }

  // 最大长度验证
  if (validation.max_length && value.length > validation.max_length) {
    return `最多允许 ${validation.max_length} 个元素`;
  }

  return null;
};

/**
 * 验证组字段
 * @param {Object} value - 要验证的值
 * @param {Object} validation - 验证规则
 * @param {Object} fieldConfig - 字段配置
 * @returns {string|null} - 错误消息或null
 */
export const validateGroup = (value, validation, fieldConfig) => {
  if (!validation) return null;

  // 必填验证
  if (validation.required && (!value || typeof value !== 'object')) {
    return `${fieldConfig.label || '此字段'}是必填项`;
  }

  return null;
};

/**
 * 根据字段类型验证字段
 * @param {string} type - 字段类型
 * @param {any} value - 字段值
 * @param {Object} validation - 验证规则
 * @param {Object} fieldConfig - 字段配置
 * @returns {string|null} - 错误消息或null
 */
export const validateField = (type, value, validation, fieldConfig) => {
  switch (type) {
    case 'text':
      return validateText(value, validation);
    case 'email':
      return validateEmail(value, validation);
    case 'password':
      return validatePassword(value, validation);
    case 'checkbox':
      return validateCheckbox(value, validation);
    case 'boolean':
      return validateCheckbox(value, validation);
    case 'number':
      return validateNumber(value, validation);
    case 'list':
      return validateList(value, validation);
    case 'assembly':
      return validateAssembly(value, validation, fieldConfig);
    case 'number[]':
      return validateNumberArray(value, validation);
    case 'group':
      return validateGroup(value, validation, fieldConfig);
    case 'select':
      // 下拉选择框通常不需要复杂验证
      if (validation?.required && (!value || value === '')) {
        return `${fieldConfig.label || '此字段'}是必填项`;
      }
      return null;
    default:
      return null;
  }
};

/**
 * 验证整个表单
 * @param {Object} formData - 表单数据
 * @param {Array} fields - 字段配置数组
 * @returns {Object} - 验证结果 { isValid: boolean, errors: Object }
 */
export const validateForm = (formData, fields) => {
  const errors = {};
  let isValid = true;

  fields.forEach(field => {
    const value = formData[field.name];
    const error = validateField(field.type, value, field.validation, field);
    
    if (error) {
      errors[field.name] = error;
      isValid = false;
    }
  });

  return { isValid, errors };
};
