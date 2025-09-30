# YAML 动态表单系统

基于 YAML 配置的 React 动态表单，支持多种字段类型和复杂表单结构。

## 快速开始

```bash
npm install
npm start
```

## 功能特性

- 🎯 **多表单支持** - 同时显示多个表单
- 📝 **动态字段渲染** - 根据 YAML 配置自动渲染
- 🔧 **丰富字段类型** - text, number, select, boolean, list, assembly, group
- ✅ **实时验证** - 输入时即时反馈
- 📱 **响应式设计** - 适配各种设备

## 支持的字段类型

| 类型 | 描述 | 示例 |
|------|------|------|
| `text` | 文本输入 | 平台名称 |
| `number` | 数字输入 | 速度 (m/s) |
| `select` | 下拉选择 | 制导模式 |
| `boolean` | 布尔值 | 是否启用 |
| `list` | 动态列表 | 参数列表 |
| `assembly` | 装配字段 | 关联其他表单 |
| `group` | 组字段 | 嵌套字段组合 |

## 配置示例

```yaml
forms:
  - form:
      name: "missile_config"
      title: "导弹配置"
      fields:
        - name: "name"
          label: "名称"
          type: "text"
          required: true
          
        - name: "speed"
          label: "速度"
          type: "number"
          unit: "m/s"
          validation:
            min: 0
            max: 1000
            
        - name: "guidance_mode"
          label: "制导模式"
          type: "select"
          options: ["lead_pursuit", "pure_pursuit"]
```

## 项目结构

```
src/
├── components/
│   ├── DynamicForm.js     # 主表单组件
│   └── fields/           # 字段组件库
├── utils/
│   ├── validation.js     # 验证逻辑
│   └── fieldRenderer.js  # 字段渲染工具
└── App.js               # 应用入口
```

## 技术栈

- React 18 + Hooks
- JavaScript ES6+
- CSS3
- js-yaml
- PropTypes

## 部署

```bash
npm run build
npm run deploy  # 部署到 GitHub Pages
```

---

MIT License | [提交 Issue](https://github.com/your-repo/issues)