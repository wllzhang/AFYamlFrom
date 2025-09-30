# YAML 动态表单系统

基于 YAML 配置的动态表单 React 应用，支持多种字段类型和复杂的表单结构。

## 功能特性

- 🎯 **多表单支持** - 同时显示多个表单
- 📝 **动态字段渲染** - 根据 YAML 配置自动渲染字段
- 🔧 **多种字段类型** - 支持 text, number, select, boolean, list, assembly, group 等
- ✅ **实时验证** - 输入时即时验证反馈
- 📱 **响应式设计** - 适配移动端和桌面端
- 🔍 **原始代码查看** - 可查看每个表单的 YAML 配置

## 支持的字段类型

- `text` - 文本输入
- `number` - 数字输入（支持单位）
- `select` - 下拉选择
- `boolean` - 布尔值
- `list` - 动态列表
- `assembly` - 装配字段（关联其他表单）
- `group` - 组字段（嵌套字段）
- `number[]` - 数字数组

## 项目结构

```
src/
├── components/
│   ├── DynamicForm.js          # 主表单组件
│   ├── DynamicForm.css         # 表单样式
│   └── fields/                 # 字段组件
│       ├── TextInput.js
│       ├── NumberInput.js
│       ├── SelectField.js
│       ├── BooleanField.js
│       ├── ListField.js
│       ├── AssemblyField.js
│       ├── NumberArrayField.js
│       ├── GroupField.js
│       └── FieldStyles.css
├── utils/
│   └── validation.js           # 验证逻辑
├── App.js                      # 主应用组件
└── App.css                     # 应用样式
```

## 安装和运行

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start
```

### 构建和部署

```bash
# 构建生产版本
npm run build

# 部署到 GitHub Pages
npm run deploy
```

## YAML 配置示例

```yaml
forms:
  - form:
      name: "platform_type_MISSILE"
      title: "平台类型 - 导弹"
      description: "定义导弹的飞行与制导特性"
      fields:
        - name: "icon"
          label: "平台图标"
          type: "text"
        
        - name: "mover"
          label: "运动模型"
          type: "text"
          default: "WSF_STRAIGHT_LINE_MOVER"
        
        - name: "tof_and_speed"
          label: "飞行时间与速度表"
          type: "list"
          item_fields:
            - name: "time"
              label: "时间 (秒)"
              type: "number"
              unit: "s"
            - name: "speed"
              label: "速度 (节)"
              type: "number"
              unit: "kts"
        
        - name: "maximum_lateral_acceleration"
          label: "最大横向过载 (g)"
          type: "number"
          unit: "g"
        
        - name: "guidance_mode"
          label: "制导模式"
          type: "select"
          options: ["lead_pursuit", "pure_pursuit"]
```

## 技术栈

- React 18
- JavaScript (ES6+)
- CSS3
- js-yaml
- GitHub Pages

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！