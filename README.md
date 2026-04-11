# React AI Monorepo CLI

一键初始化 React + Vite + pnpm + shadcn/ui 的 Monorepo 项目，为 AI 编码工具（Cursor、Copilot、Claude Code、Ducc 等）提供统一的工程规范。

---

## 🚀 快速开始

### 使用 CLI 创建新项目（推荐）

```bash
npx react-ai-monorepo init
```

这将创建一个完整的 Monorepo 项目结构。

详细 CLI 文档请查看 [CLI-README.md](CLI-README.md)

---

## 📋 目录

- [项目概述](#项目概述)
- [CLI 命令](#cli-命令)
- [项目结构](#项目结构)
- [技术栈](#技术栈)
- [工作流程](#工作流程)
- [手动配置](#手动配置)
- [规则体系](#规则体系)
- [发布到 npm](#发布到-npm)

---

## 项目概述

本包提供完整的 Monorepo 项目模板和 AI 编码规范，使 AI 在生成代码时能够：

- 遵守团队架构设计
- 保持代码风格统一
- 提高代码可维护性
- 减少技术债务积累
- 确保多端一致性

**最终目标：AI 编写的代码 ≈ 团队工程代码**

---

## CLI 命令

### init

初始化一个新的 Monorepo 项目。

```bash
npx react-ai-monorepo init
```

生成的项目包含：
- 📱 两个应用：`web` 和 `admin`
- 📦 四个共享包：`ui`、`utils`、`types`、`config`
- 🎨 预配置的 Tailwind CSS 和 shadcn/ui
- ⚙️ 完整的 TypeScript 和 Vite 配置
- 🤖 AI 编码规范文件（`.cursor/`）

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

---

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
├── .cursor/          # AI 编码规范
│   ├── rules/         # 强制执行规则
│   ├── skills/        # 技能模块
│   └── config.json    # 规则配置
├── pnpm-workspace.yaml
├── components.json    # shadcn/ui 配置
└── package.json
```

---

## 技术栈

| 分类 | 技术 |
|------|------|
| **前端框架** | React 18 |
| **语言** | TypeScript |
| **构建工具** | Vite |
| **样式方案** | Tailwind CSS |
| **UI 组件** | shadcn/ui |
| **包管理** | pnpm workspace |
| **架构** | Monorepo |
| **跨平台** | React Native |
| **状态管理** | Redux / MobX |
| **测试** | Vitest + React Testing Library |

---

## 工作流程

### 1. 创建项目

```bash
npx react-ai-monorepo init
```

### 2. 进入项目目录

```bash
cd your-project
```

### 3. 安装依赖

```bash
pnpm install
```

### 4. 下载 shadcn/ui 组件（可选）

```bash
npx react-ai-monorepo shadcn button input dialog
```

### 5. 启动开发

```bash
# 启动 web 应用
pnpm dev

# 启动所有应用
pnpm run dev:all

# 启动特定应用
pnpm --filter @repo/web dev
```

### 6. 构建

```bash
pnpm build
```

---

## 手动配置

如果不想使用 CLI 初始化，可以手动配置：

### 1. 安装包

```bash
npm install -D react-ai-monorepo
# 或
npm install -g react-ai-monorepo
```

### 2. 配置 AI 工具

将本项目的 `.cursor/` 目录内容复制到你的项目根目录：

```bash
# 方式一：软链接（推荐）
ln -s /path/to/react-ai-monorepo/.cursor /your/project/.cursor

# 方式二：直接复制
cp -r /path/to/react-ai-monorepo/.cursor /your/project/
```

### 3. 生成 Tailwind 规则（可选）

```bash
npm run tailwind
```

---

## 规则体系

### 强制规则 (.cursor/rules/)

规则文件由 AI 自动应用，生成的代码必须遵守。规则优先级：`rules > 用户需求`。

| 规则文件 | 说明 | 核心要求 |
|---------|------|---------|
| [global-enforce.md](.cursor/rules/global-enforce.md) | 全局强制执行 | 规则优先级最高，冲突时优先规范 |
| [react-component.md](.cursor/rules/react-component.md) | React 组件编写 | 函数组件 + memo + TypeScript + 命名导出 |
| [component-usage.md](.cursor/rules/component-usage.md) | 组件使用规范 | 受控模式 + 单向数据流 + 禁止透传污染 |
| [business-logic-rules.md](.cursor/rules/business-logic-rules.md) | 业务代码逻辑 | 优先复用现有代码，禁止重复造轮子 |
| [event-rules.md](.cursor/rules/event-rules.md) | 事件处理规范 | 禁止匿名函数 + 强制 useCallback + 防抖节流 |
| [hooks-rules.md](.cursor/rules/hooks-rules.md) | Hooks 编写规范 | 依赖数组完整 + 拆分 Effect + 禁止重复 state |
| [performance-rules.md](.cursor/rules/performance-rules.md) | 性能优化规范 | memo + useMemo + useCallback + 列表优化 |
| [cross-platform.md](.cursor/rules/cross-platform.md) | 跨端开发规范 | 三层架构：ui / web-ui / native-ui |
| [react-native.md](.cursor/rules/react-native.md) | React Native 规范 | 使用 RN 组件 + StyleSheet + FlatList |
| [tailwind-rules.md](.cursor/rules/tailwind-rules.md) | Tailwind CSS 规范 | 语义化颜色 + 标准 Token + cn 合并 |

### 技能模块 (.cursor/skills/)

提供可复用的开发指导：

- **架构规范**：Monorepo 架构、项目结构
- **开发规范**：代码风格、React 开发规则、现有代码学习
- **UI 规范**：UI 治理、shadcn 使用、Tailwind 规则、Figma 设计解析
- **API 规范**：Axios 请求规范
- **状态管理**：Redux / MobX 使用指南
- **页面生成**：页面生成规范
- **性能优化**：性能优化规则
- **测试规范**：测试编写规范
- **AI 工作流**：AI 编码流程、全栈开发流程

详细说明请查看 [.cursor/skills/README.md](.cursor/skills/README.md)

---

## 发布到 npm

### 准备工作

1. 注册 [npm](https://www.npmjs.com/) 账号
2. 登录 npm：`npm login`
3. 修改 `package.json` 中的包名和元信息

### 发布

```bash
npm publish

# 如果使用 scope，需要声明公开
npm publish --access public
```

详细发布指南请查看 [PUBLISH-GUIDE.md](PUBLISH-GUIDE.md)

---

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

---

## 可用组件

以下 shadcn/ui 组件可通过 CLI 下载：

- button, input, label, select, checkbox, radio-group, switch, slider
- dialog, dropdown-menu, popover, tooltip, toast
- table, card, badge, avatar, separator
- tabs, accordion, alert, scroll-area, command

使用 `npx react-ai-monorepo shadcn --list` 查看完整列表。

---

## 最佳实践

### 标准组件

```tsx
import { memo, useCallback } from 'react';
import { cn } from '@repo/utils';

type Props = {
  title: string;
  onClick?: () => void;
  className?: string;
};

export const Card = memo(({ title, onClick, className }: Props) => {
  return (
    <div className={cn('p-md rounded-md bg-background', className)}>
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );
});
```

### 事件处理

```tsx
// ✅ 正确
import { useCallback } from 'react';

const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

<Button onClick={handleClick} />
```

---

## 常见问题

### Q1: 如何自定义应用和包列表？

A: 编辑 `scripts/monorepo-init.js` 中的 `CONFIG` 对象，修改 `defaultApps` 和 `defaultPackages` 数组。

### Q2: 规则冲突怎么办？

A: 按 `rules > skills > 用户需求` 的优先级处理。

### Q3: 如何发布到私有 npm？

A: 使用 scope 并发布：`npm publish`（私有包需要付费账号）

---

## 相关文档

- [CLI-README.md](CLI-README.md) - CLI 详细使用文档
- [PUBLISH-GUIDE.md](PUBLISH-GUIDE.md) - 发布到 npm 的详细指南
- [.cursor/skills/README.md](.cursor/skills/README.md) - 技能模块详细说明

---

## License

MIT

---

## 贡献

欢迎提交 Issue 和 Pull Request！
