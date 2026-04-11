# AI Coding Skills 规范说明（README）

本项目通过 `.skills` 目录为 AI 编码工具（如 Cursor、Copilot、ChatGPT 等）提供统一的工程规范，使 AI 在生成代码时能够遵循团队的架构设计、开发规则和技术栈约定，从而保证代码结构一致、风格统一、可维护性高。

该规范主要适用于以下技术栈：

* React
* TypeScript
* Vite
* TailwindCSS
* shadcn/ui
* Axios
* Monorepo（pnpm workspace）

---

# 一、目录结构

```
.skills
├─ architecture
│  ├─ monorepo-architecture.md
│  └─ project-structure.md
│
├─ development
│  ├─ react-development-rules.md
│  ├─ coding-style.md
│  └─ existing-code-learning.md
│
├─ ui
│  ├─ ui-governance.md
│  ├─ shadcn-usage.md
│  ├─ tailwind-rules.md
│  └─ figma-design-reader.md
│
├─ api
│  └─ request-axios-rules.md
│
├─ state
│  └─ state-management.md
│
├─ generation
│  └─ page-generation.md
│
├─ performance
│  └─ performance-rules.md
│
├─ testing
│  └─ testing-rules.md
│
└─ ai
   └─ ai-workflow.md
```

整个 `.skills` 目录按照 **架构、开发规范、UI规范、接口规范、状态管理、页面生成、性能优化、测试规范、AI工作流程** 九个模块进行划分。

---

# 二、各目录作用说明

## 1. architecture（架构规范）

用于约束整个项目的 **工程结构与 Monorepo 架构设计**。

### monorepo-architecture.md

说明项目的 Monorepo 结构，例如：

* `apps`：业务应用
* `packages`：共享库
* `pnpm workspace` 管理依赖

作用：

* 让 AI 在生成代码时遵守 Monorepo 结构
* 避免错误的目录生成

---

### project-structure.md

规定每个应用内部的目录结构，例如：

```
src
 ├─ pages
 ├─ components
 ├─ hooks
 ├─ services
 ├─ types
 ├─ utils
```

作用：

* 统一 React 项目结构
* 保证代码可维护性

---

# 三、development（开发规范）

用于约束 **React开发方式与代码风格**。

### react-development-rules.md

主要规定：

* 只使用 **函数组件**
* 业务逻辑必须使用 **Hooks**
* 避免滥用 `useEffect`

作用：

让 AI 写出符合 React 最佳实践的代码。

---

### coding-style.md

规定代码风格，例如：

* TypeScript 强制使用
* 文件命名 `kebab-case`
* 组件命名 `PascalCase`
* Hook 必须 `use` 开头

作用：

保证团队代码风格一致。

---

### existing-code-learning.md

规定 AI 在生成代码前必须：

1. 先搜索已有代码
2. 优先复用已有组件
3. 优先复用已有 hooks
4. 遵循现有代码模式

作用：

避免 AI 生成重复代码。

---

# 四、ui（UI规范）

用于统一 **组件体系与样式规范**。

---

### ui-governance.md

规定 UI 组件管理规则：

* 所有基础组件放在 `packages/ui`
* 业务组件在 `apps/**/components`
* 不直接修改基础组件

作用：

保证组件复用性和稳定性。

---

### shadcn-usage.md

规定 `shadcn/ui` 的使用方式：

* 优先使用 `packages/ui` 封装组件
* 表单组件必须使用 shadcn
* Dialog / Table / Input 等统一来源

作用：

统一组件体系。

---

### tailwind-rules.md

规定 TailwindCSS 使用规范，例如：

允许：

```
flex
grid
gap
p-4
text-sm
```

禁止：

* inline style
* CSS modules
* styled-components

作用：

统一样式系统。

---

### figma-design-reader.md

规定 AI 如何解析设计稿：

优先级：

1. Figma
2. SVG
3. 截图

作用：

帮助 AI 从设计稿自动生成 UI。

---

# 五、api（接口请求规范）

### request-axios-rules.md

统一 Axios 使用方式：

请求层结构：

```
services
 ├─ http
 └─ modules
```

调用流程：

```
Component
 ↓
Hook
 ↓
Service
 ↓
Axios
```

支持：

* 统一请求拦截
* 统一响应拦截
* 多实例 Axios

作用：

避免组件直接调用接口。

---

# 六、state（状态管理）

### state-management.md

统一状态管理方案：

推荐：

* Redux
* Mobx

状态分类：

* 全局状态：store
* 局部状态：useState
* 异步状态：hooks

作用：

减少状态管理复杂度。

---

# 七、generation（页面生成规则）

### page-generation.md

规定后台页面结构：

```
pages/user
 ├─ index.tsx
 ├─ components
 ├─ hooks
 └─ types
```

典型页面结构：

* 搜索表单
* 数据表格
* 分页
* 新增 / 编辑弹窗

作用：

让 AI 能自动生成标准后台页面。

---

# 八、performance（性能规范）

### performance-rules.md

规定性能优化策略：

* `React.memo`
* `useMemo`
* `useCallback`
* 路由懒加载

作用：

避免 AI 生成低性能代码。

---

# 九、testing（测试规范）

### testing-rules.md

统一测试工具：

* Vitest
* React Testing Library

测试内容：

* 组件渲染
* 用户交互
* API Mock

作用：

提高代码质量。

---

# 十、ai（AI开发流程）

### ai-workflow.md

规定 AI 编码流程：

1. 分析项目架构
2. 搜索已有代码
3. 解析设计稿
4. 匹配 UI 组件
5. 按层生成代码

生成顺序：

```
types
services
hooks
components
pages
```

作用：

让 AI 按工程流程生成代码，而不是随意生成。

---

# 十一、使用规范

开发过程中使用 AI 时应遵循以下原则：

1️⃣ 所有 AI 生成代码必须遵守 `.skills` 规则
2️⃣ 新功能优先复用已有组件与 hooks
3️⃣ 页面结构必须符合 `page-generation` 规范
4️⃣ 所有接口必须通过 `services` 层调用
5️⃣ 样式必须使用 Tailwind 或 shadcn 组件

---

# 十二、目标

通过 `.skills` 体系，实现以下目标：

* 统一 AI 生成代码质量
* 保证团队代码风格一致
* 自动遵循工程架构
* 提高开发效率
* 降低维护成本

最终实现：

**AI 编写的代码 ≈ 团队工程代码**
