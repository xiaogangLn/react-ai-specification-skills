# Tailwind CSS 自动规则生成系统

一个支持实时监控的 Tailwind CSS 规则自动生成器，可根据项目配置自动生成 AI 编码时使用的样式规范。

## 功能特性

- ✅ 自动扫描 Tailwind 配置文件（`tailwind.config.js/ts/cjs/mjs`）
- ✅ 自动解析 CSS 变量（`globals.css`、`theme.css` 等）
- ✅ 提取设计 Token（颜色、间距、圆角、字体、组件高度）
- ✅ 生成项目专属的 `tailwind-rules.md`
- ✅ 实时监控文件变化，自动更新规则
- ✅ 支持多种配置文件格式

## 快速开始

### 1. 安装依赖

```bash
npm install
# 或
pnpm install
```

### 2. 初始化规则（首次使用）

```bash
npm run tailwind-rules:init
# 或
pnpm tailwind-rules:init
```

这将扫描项目中的配置文件并生成 `.cursor/rules/tailwind-rules.md`

### 3. 启动实时监控（开发时使用）

```bash
npm run tailwind-rules:watch
# 或
pnpm tailwind-rules:watch
```

这将监控样式文件的变化，自动重新生成规则。

## 支持的文件

### Tailwind 配置文件

```
tailwind.config.js
tailwind.config.ts
tailwind.config.cjs
tailwind.config.mjs
```

### CSS 主题文件

```
src/app/globals.css
src/styles/globals.css
src/index.css
src/theme.css
app/globals.css
```

## 提取的内容

| 类别 | 说明 |
|------|------|
| **颜色** | 品牌色、文本色、背景色、边框色、状态色 |
| **间距** | 自定义间距、语义化间距 |
| **圆角** | 自定义圆角 Token |
| **字体** | 自定义字号、字重 |
| **组件高度** | 标准组件高度 |

## 生成的规则示例

```tsx
// 项目特定的颜色 Token
<div className="bg-primary text-text-heading" />
<div className="border-border hover:bg-surface-secondary-hover" />

// 项目特定的间距 Token
<div className="p-md gap-sm" />
<div className="gap-content" />

// 项目特定的圆角 Token
<button className="rounded-sm" />
<div className="rounded-md" />
```

## 目录结构

```
react-ai-specification-skills/
├── .cursor/
│   ├── rules/
│   │   └── tailwind-rules.md      # 自动生成的规则文件
│   └── skills/
│       └── ui/
│           └── tailwind-auto-rules.md  # 使用说明
├── scripts/
│   ├── tailwind-rules-generator.js  # 规则生成器
│   └── tailwind-rules-watcher.js    # 文件监控器
└── package.json
```

## 工作原理

```
┌─────────────────────────────────────────────────────────────┐
│                     Tailwind 配置文件                        │
│  tailwind.config.js | globals.css | theme.css                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     规则生成器                               │
│  - 解析配置文件                                               │
│  - 提取设计 Token                                            │
│  - 生成规则 Markdown                                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              .cursor/rules/tailwind-rules.md                 │
│  - 项目特定颜色 Token                                        │
│  - 项目特定间距 Token                                        │
│  - 项目特定圆角 Token                                        │
│  - AI 行为约束                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      AI 编码时                               │
│  Cursor / Copilot / Claude Code 读取规则文件                  │
│  自动应用项目特定的样式规范                                   │
└─────────────────────────────────────────────────────────────┘
```

## 使用场景

1. **新项目初始化**：运行 `init` 命令生成初始规则
2. **开发过程中**：运行 `watch` 命令保持规则同步
3. **添加新 Token**：修改配置文件，规则自动更新
4. **团队协作**：将 `tailwind-rules.md` 提交到版本控制

## 故障排除

### 规则未生成

1. 确认在项目根目录运行命令
2. 确认存在 Tailwind 配置文件或样式文件
3. 查看控制台错误信息

### 监控不生效

1. 确认已安装 `chokidar` 依赖
2. 检查监控文件路径是否正确
3. 查看文件权限

## 技术栈

- **文件监控**: chokidar
- **文件系统**: fs (Node.js)
- **CSS 解析**: 正则表达式
- **Tailwind 解析**: 直接导入配置模块

## License

MIT
