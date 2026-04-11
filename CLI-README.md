# React AI Monorepo CLI

一键初始化 React + Vite + pnpm + shadcn/ui 的 Monorepo 项目。

## 快速开始

### 使用 npx 直接创建新项目

```bash
npx react-ai-monorepo init
```

或者使用短命令：

```bash
npx react-ai-monorepo init
```

这将创建一个完整的 Monorepo 项目结构，包含：
- 📱 两个应用：`web` 和 `admin`
- 📦 四个共享包：`ui`、`utils`、`types`、`config`
- 🎨 预配置的 Tailwind CSS 和 shadcn/ui
- ⚙️ 完整的 TypeScript 和 Vite 配置

### 安装到现有项目

如果你想把这个包集成到现有项目中：

```bash
# 全局安装（可选）
npm install -g react-ai-monorepo

# 或在项目中安装
npm install -D react-ai-monorepo
```

## 命令

### init

初始化一个新的 Monorepo 项目。

```bash
npx react-ai-monorepo init
```

### shadcn

下载 shadcn/ui 组件到 `packages/ui` 目录。

```bash
# 下载指定组件
npx react-ai-monorepo shadcn button input dialog

# 下载所有默认组件
npx react-ai-monorepo shadcn --all

# 列出可用组件
npx react-ai-monorepo shadcn --list
```

### add-component / component

添加 shadcn/ui 组件（`shadcn` 的别名）。

```bash
npx react-ai-monorepo add-component button
npx react-ai-monorepo component input
```

### tailwind

生成 Tailwind CSS 规则文件。

```bash
npx react-ai-monorepo tailwind
```

### help

显示帮助信息。

```bash
npx react-ai-monorepo help
npx react-ai-monorepo help shadcn
```

## 项目结构

```
.
├── apps/              # 业务应用
│   ├── web/          # Web 应用 (端口 3000)
│   └── admin/        # 管理后台 (端口 3001)
├── packages/          # 共享库
│   ├── ui/           # UI 组件库 (shadcn/ui)
│   ├── utils/        # 工具函数 (cn 等)
│   ├── types/        # 类型定义
│   └── config/       # 项目配置
├── pnpm-workspace.yaml
├── components.json    # shadcn/ui 配置
└── package.json
```

## 工作流程

### 1. 初始化项目

```bash
npx react-ai-monorepo init
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 下载 shadcn/ui 组件

```bash
npx react-ai-monorepo shadcn button input dialog
```

### 4. 启动开发

```bash
# 启动 web 应用
pnpm dev

# 启动所有应用
pnpm run dev:all

# 启动特定应用
pnpm --filter @repo/web dev
```

### 5. 构建

```bash
pnpm build
```

## 使用组件

```tsx
import { Button } from '@repo/ui';

export default function App() {
  return (
    <div>
      <Button>Click me</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  );
}
```

## 可用组件

以下 shadcn/ui 组件可通过 CLI 下载：

- button
- input
- label
- select
- checkbox
- radio-group
- switch
- slider
- dialog
- dropdown-menu
- popover
- tooltip
- toast
- table
- card
- badge
- avatar
- separator
- tabs
- accordion
- alert
- scroll-area
- command

使用 `npx react-ai-monorepo shadcn --list` 查看完整列表。

## 技术栈

- **框架**: React 18
- **语言**: TypeScript
- **构建工具**: Vite
- **包管理**: pnpm workspace
- **样式**: Tailwind CSS
- **UI 组件**: shadcn/ui

## 发布到 npm

### 准备发布

1. 确保你有一个 npm 账号
2. 登录 npm：`npm login`

### 修改 package.json

更新以下字段：

```json
{
  "name": "your-scope/react-ai-monorepo",
  "repository": {
    "url": "https://github.com/your-username/react-ai-monorepo.git"
  },
  "bugs": {
    "url": "https://github.com/your-username/react-ai-monorepo/issues"
  },
  "homepage": "https://github.com/your-username/react-ai-monorepo#readme"
}
```

### 发布

```bash
# 构建并发布
npm publish

# 或使用 pnpm
pnpm publish
```

### 使用私有包

如果你使用 npm 的 scope 功能，需要设置公开访问：

```bash
npm publish --access public
```

## 常见问题

### Q: 如何自定义应用和包列表？

A: 编辑 `scripts/monorepo-init.js` 中的 `CONFIG` 对象，修改 `defaultApps` 和 `defaultPackages` 数组。

### Q: 如何添加更多 shadcn 组件？

A: 使用 `npx react-ai-monorepo shadcn --all` 下载所有默认组件，或单独下载需要的组件。

### Q: 支持其他包管理器吗？

A: 当前主要支持 pnpm。如需使用 npm 或 yarn，需要手动调整 `pnpm-workspace.yaml` 和相关脚本。

## License

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！
