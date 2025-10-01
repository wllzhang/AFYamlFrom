// 表单类型配置工具函数

/**
 * 根据表单类型返回对应的图标
 * @param {string} type - 表单类型
 * @returns {string} - 对应的图标 emoji
 */
export const getTypeIcon = (type) => {
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

/**
 * 根据表单类型返回对应的颜色
 * @param {string} type - 表单类型
 * @returns {string} - 对应的颜色值（十六进制）
 */
export const getTypeColor = (type) => {
  const colorMap = {
    'launched_platform_type': '#e53e3e',    // 红色 - 发射平台
    'weapon': '#dd6b20',                     // 橙色 - 武器
    'weapon_effects': '#d69e2e',             // 黄色 - 武器效果
    'sensor': '#38a169',                     // 绿色 - 传感器
    'antenna_pattern': '#319795',            // 青色 - 天线
    'platform_type': '#3182ce',              // 蓝色 - 平台类型
    'route': '#805ad5',                      // 紫色 - 航路
    'platform': '#d53f8c',                   // 粉色 - 平台
    'radar_signature': '#2c7a7b',            // 深青色 - 雷达特征
    'infrared_signature': '#c53030',         // 深红色 - 红外特征
    'optical_signature': '#2d3748',          // 深灰色 - 光学特征
    'processor': '#718096'                   // 灰色 - 处理器
  };
  return colorMap[type] || '#718096';
};

