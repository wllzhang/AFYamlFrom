# 动态表单React应用

基于YAML配置的动态表单构建应用，使用React实现灵活的表单渲染和验证。

## 功能特性

- ✅ **YAML配置驱动**: 通过YAML文件定义表单字段和验证规则
- ✅ **多种字段类型**: 支持文本、邮箱、密码、下拉选择、复选框等字段类型
- ✅ **实时验证**: 字段输入时实时验证，提供即时反馈
- ✅ **响应式设计**: 适配桌面和移动设备
- ✅ **美观的UI**: 现代化的渐变背景和精美的表单样式
- ✅ **错误处理**: 完善的错误提示和异常处理机制

## 表单字段类型

### 1. 文本字段 (text)
```yaml
- name: "username"
  label: "用户名"
  type: "text"
  placeholder: "请输入您的用户名"
  required: true
  validation:
    min_length: 5
    max_length: 20
    pattern: "^[a-zA-Z0-9_]+$"
    error_message: "用户名必须为5-20个字母、数字或下划线。"
```

### 2. 邮箱字段 (email)
```yaml
- name: "email"
  label: "电子邮箱"
  type: "email"
  placeholder: "请输入您的电子邮箱"
  required: true
  validation:
    regex: "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$"
    error_message: "请输入有效的电子邮箱地址。"
```

### 3. 密码字段 (password)
```yaml
- name: "password"
  label: "密码"
  type: "password"
  required: true
  validation:
    min_length: 8
    error_message: "密码长度至少为8位。"
```

### 4. 下拉选择 (select)
```yaml
- name: "gender"
  label: "性别"
  type: "select"
  options:
    - label: "男"
      value: "male"
    - label: "女"
      value: "female"
    - label: "保密"
      value: "secret"
  default: "secret"
  required: false
```

### 5. 复选框 (checkbox)
```yaml
- name: "agree_terms"
  label: "我同意用户协议"
  type: "checkbox"
  required: true
  default: false
```

## 项目结构

```
yaml_form/
├── public/
│   ├── index.html
│   └── config/
│       └── form-config.yaml      # YAML表单配置文件
├── src/
│   ├── components/
│   │   ├── DynamicForm.js         # 主表单组件
│   │   ├── DynamicForm.css        # 表单样式
│   │   └── fields/                # 字段组件
│   │       ├── TextInput.js       # 文本输入组件
│   │       ├── EmailInput.js      # 邮箱输入组件
│   │       ├── PasswordInput.js   # 密码输入组件
│   │       ├── SelectField.js     # 下拉选择组件
│   │       ├── CheckboxField.js   # 复选框组件
│   │       └── FieldStyles.css    # 字段样式
│   ├── utils/
│   │   └── validation.js         # 验证逻辑
│   ├── App.js                    # 主应用组件
│   ├── App.css                   # 应用样式
│   └── index.js                  # 入口文件
├── package.json                  # 项目配置
└── README.md                    # 项目说明
```

## 安装和运行

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm start
```

### 3. 构建生产版本
```bash
npm run build
```

## 验证规则配置

### 文本字段验证
- `min_length`: 最小长度
- `max_length`: 最大长度
- `pattern`: 正则表达式模式
- `error_message`: 自定义错误消息

### 邮箱字段验证
- `regex`: 邮箱格式正则表达式
- `error_message`: 自定义错误消息

### 密码字段验证
- `min_length`: 最小长度
- `error_message`: 自定义错误消息

### 必填验证
- `required`: 是否为必填字段
- 复选框类型的必填验证检查是否勾选

## 自定义表单配置

1. 编辑 `public/config/form-config.yaml` 文件
2. 按照字段类型规范配置新的字段
3. 重启开发服务器查看效果

### 配置示例
```yaml
form:
  name: "my_form"
  title: "我的表单"
  description: "这是一个示例表单"
  fields:
    - name: "custom_field"
      label: "自定义字段"
      type: "text"
      placeholder: "请输入..."
      required: true
      validation:
        min_length: 3
        error_message: "至少输入3个字符"
```

## 技术栈

- **React 18**: 前端框架
- **Create React App**: 项目脚手架
- **js-yaml**: YAML解析库
- **CSS3**: 样式和动画
- **JavaScript ES6+**: 现代JavaScript语法

## 浏览器兼容性

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 开发说明

### 添加新字段类型
1. 在 `src/components/fields/` 中创建新的字段组件
2. 在 `src/components/DynamicForm.js` 的 `renderField` 方法中添加类型处理
3. 在 `src/utils/validation.js` 中添加验证逻辑

### 样式定制
- 主要样式在 `src/components/DynamicForm.css`
- 字段样式在 `src/components/fields/FieldStyles.css`
- 全局样式在 `src/App.css`

## 许可证

MIT License

## 联系方式

如有问题或建议，欢迎提交Issue！
