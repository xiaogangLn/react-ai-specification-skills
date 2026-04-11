---
name: tailwind-auto-rules
description: 自动生成和监控 Tailwind CSS 项目规则
---

# Tailwind CSS 自动规则生成系统

## 功能说明

本系统会自动扫描项目中的 Tailwind 配置文件，提取自定义的设计 Token（颜色、间距、圆角、字体等），并生成项目专属的 `tailwind-rules.md` 规则文件。

当样式文件修改时，规则文件会自动更新，确保 AI 编码时始终使用最新的项目配置。

---

## 使用方法

### 初始化（首次使用）

```bash
npm run tailwind-rules:init
```

或

```bash
pnpm tailwind-rules:init
```

这会：
1. 扫描项目中的 Tailwind 配置文件
2. 解析自定义的设计 Token
3. 生成 `.cursor/rules/tailwind-rules.md`

### 启动监控

```bash
npm run tailwind-rules:watch
```

或

```bash
pnpm tailwind-rules:watch
```

这会：
1. 监控以下文件的变化：
   - `src/**/globals.css`
   - `src/**/theme.css`
   - `tailwind.config.{js,ts,cjs,mjs}`
   - `src/**/*.{css,scss}`
2. 文件变化时自动重新生成规则文件

---

## 支持的配置文件格式

系统会自动检测和解析以下文件：

### 1. Tailwind 配置文件

```
tailwind.config.js
tailwind.config.ts
tailwind.config.cjs
tailwind.config.mjs
```

### 2. CSS 主题文件

```
src/app/globals.css
src/styles/globals.css
src/index.css
src/theme.css
```

---

## 生成的规则内容

系统会从配置文件中提取以下内容：

### 颜色系统

- 自定义颜色 Token（primary, secondary, success, warning, error 等）
- 语义化颜色（text-heading, text-body, text-secondary 等）
- 背景色（background, surface-secondary 等）

### 间距系统

- 自定义间距 Token（2xs, xs, sm, md, lg, xl, 2xl）
- 语义化间距（intimate, tight, content, group, section）

### 圆角系统

- 自定义圆角 Token（xs, sm, md, lg, xl, full）

### 字体系统

- 自定义字号 Token
- 字重配置

### 组件高度

- 组件高度 Token（2xs, xs, sm, md, lg, xl, 2xl）

---

## 规则生成逻辑

### 检测优先级

1. 优先查找 `tailwind.config.js/ts`
2. 如果不存在，扫描 `src/**/globals.css` 或 `src/**/theme.css`

### 解析规则

1. **Tailwind Config 解析**
   - 读取 `theme` 配置对象
   - 提取 `colors`, `spacing`, `borderRadius`, `fontSize` 等

2. **CSS 变量解析**
   - 使用正则匹配 `--variable-name: value;`
   - 识别颜色、间距、圆角等变量

3. **智能分类**
   - 根据变量名前缀自动分类（text-, bg-, spacing-, radius-）
   - 推断 Token 用途和场景

---

## 配置选项

可以在 `package.json` 中自定义配置：

```json
{
  "tailwindRules": {
    "watch": true,
    "files": [
      "src/**/*.css",
      "tailwind.config.{js,ts}"
    ],
    "output": ".cursor/rules/tailwind-rules.md",
    "excludes": [
      "**/*.module.css",
      "**/*.min.css"
    ]
  }
}
```

---

## 监控文件列表

默认监控以下文件：

- `src/**/globals.css`
- `src/**/theme.css`
- `src/**/index.css`
- `src/app/**/*.css`
- `src/styles/**/*.css`
- `tailwind.config.{js,ts,cjs,mjs}`

---

## 示例输出

生成的 `tailwind-rules.md` 包含：

### 1. 项目特定颜色 Token

```tsx
// 你的项目定义的颜色
<div className="bg-primary text-text-heading" />
<div className="border-border hover:bg-surface-secondary-hover" />
```

### 2. 项目特定间距 Token

```tsx
// 你的项目定义的间距
<div className="p-md gap-sm" />
<div className="gap-content" /> // 语义化间距
```

### 3. 项目特定圆角 Token

```tsx
// 你的项目定义的圆角
<button className="rounded-sm" />
<div className="rounded-md" />
```

---

## 故障排除

### 规则未生成

1. 检查是否在项目根目录
2. 确认存在 Tailwind 配置文件或样式文件
3. 查看控制台错误信息

### 监控不生效

1. 确认已安装 `chokidar` 依赖
2. 检查监控文件路径是否正确
3. 查看文件权限

---

## 技术栈

- **文件监控**: chokidar
- **文件扫描**: fast-glob
- **CSS 解析**: 正则表达式
- **Tailwind 解析**: 直接导入配置模块

---

## 最佳实践

1. **首次项目设置**: 运行 `init` 命令生成初始规则
2. **开发过程中**: 启动 `watch` 命令保持规则同步
3. **添加新 Token**: 修改配置文件后，规则会自动更新
4. **团队协作**: 将 `tailwind-rules.md` 提交到版本控制

---

## AI 使用方式

AI 在编码时会自动读取 `.cursor/rules/tailwind-rules.md`，并使用以下规则：

1. **颜色**: 使用项目中定义的语义化颜色 Token
2. **间距**: 使用项目中定义的标准间距 Token
3. **圆角**: 使用项目中定义的圆角 Token
4. **字体**: 使用项目中定义的字号和字重
5. **合并**: 使用 `cn` 工具合并 className
6. **状态**: 自动添加 hover/active/focus 等交互状态

---

## 更新日志

- **v1.0.0**: 初始版本，支持自动生成和实时监控
