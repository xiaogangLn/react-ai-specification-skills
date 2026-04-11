# 快速使用指南

本文档提供 React AI 编码规范技能包的快速参考，帮助开发者快速上手。

---

## 🚀 三步快速开始

### 1. 安装

```bash
npm install
```

### 2. 配置

将 `.cursor/` 目录复制到你的项目根目录：

```bash
cp -r .cursor /your/project/
```

### 3. 生成 Tailwind 规则（可选）

```bash
npm run tailwind-rules:init
```

---

## 📚 规则速查表

### 核心规则

| 类别 | 规则文件 | 核心要求 |
|------|---------|---------|
| **全局强制** | global-enforce.md | 规则优先级：rules > 用户需求 |
| **React 组件** | react-component.md | 函数组件 + memo + TypeScript + 命名导出 |
| **组件使用** | component-usage.md | 受控模式 + 单向数据流 + 禁止透传污染 |
| **业务逻辑** | business-logic-rules.md | 优先复用现有代码，禁止重复造轮子 |
| **事件处理** | event-rules.md | 禁止匿名函数 + useCallback + 防抖节流 |
| **Hooks** | hooks-rules.md | 依赖数组完整 + 拆分 Effect + 禁止重复 state |
| **性能** | performance-rules.md | memo + useMemo + useCallback + 列表优化 |
| **跨端** | cross-platform.md | 三层架构：ui / web-ui / native-ui |
| **React Native** | react-native.md | 使用 RN 组件 + StyleSheet + FlatList |
| **Tailwind** | tailwind-rules.md | 语义化颜色 + 标准 Token + cn 合并 |

### 代码规范速查

| 场景 | ✅ 正确 | ❌ 错误 |
|------|---------|---------|
| 导出组件 | `export const Button = ...` | `export default Button` |
| 函数组件 | `const Comp = () => {}` | `class Comp extends React.Component` |
| 事件处理 | `<Button onClick={handleClick} />` | `<Button onClick={() => ...} />` |
| 类型定义 | `type Props = {...}` | `props: any` |
| 依赖数组 | `useEffect(fn, [a, b])` | `useEffect(fn, [])`（依赖缺失） |
| 列表 Key | `<Item key={item.id} />` | `<Item key={index} />` |
| 样式合并 | `className={cn('base', className)}` | `className={`base ${className}`}` |
| RN 组件 | `<View><Text>Hello</Text></View>` | `<div><span>Hello</span></div>` |
| RN 样式 | `StyleSheet.create({...})` | `<div style={{...}} />` |

---

## 🎯 AI 提示词模板

### 生成组件

```
请帮我生成一个 [组件名] 组件，必须遵守：
- react-component.md 中的组件规范
- tailwind-rules.md 中的样式规范
- event-rules.md 中的事件规范
- performance-rules.md 中的性能规范

组件需要：[需求描述]

要求：
1. 使用 TypeScript 定义 Props 类型
2. 使用 memo 包裹组件
3. 事件处理使用 useCallback
4. 样式使用 Tailwind + cn 合并
5. 支持通过 className 扩展样式
```

### 生成页面

```
请帮我生成 [页面名] 页面，请遵循：
- page-generation.md 中的页面结构
- 必须先搜索现有组件和 Hooks
- 优先复用 packages/ui 中的组件
- 按照 types → services → hooks → components → pages 的顺序生成

页面需求：[需求描述]

目录结构：
src/pages/[feature-name]/
├── index.tsx
├── components/
├── hooks/
└── types/
```

### 生成 Hook

```
请帮我生成一个 [Hook 名称] Hook，必须遵守：
- hooks-rules.md 中的 Hooks 规范
- event-rules.md 中的事件规范
- performance-rules.md 中的性能规范

Hook 功能：[需求描述]

要求：
1. 返回对象格式：{ data, loading, error }
2. 使用 useCallback 处理异步操作
3. useEffect 依赖数组完整
4. 清理副作用（如需）
```

### 代码审查

```
请审查以下代码，检查：
1. 是否违反 rules/ 目录中的任何规范
2. 是否有性能问题
3. 事件处理是否正确（是否使用 useCallback）
4. Hooks 使用是否正确（依赖数组是否完整）
5. 是否有重复造轮子的问题

请列出所有问题并给出修复后的完整代码。

[代码]
```

### 跨端组件生成

```
请帮我生成跨端 [组件名] 组件，遵循：
- cross-platform.md 中的跨端规范
- 三层架构：ui（抽象层）+ web-ui（Web 实现）+ native-ui（RN 实现）

组件功能：[需求描述]

要求：
1. ui 层定义统一的 Props 接口
2. ui 层做平台分发
3. web-ui 使用 React + Tailwind
4. native-ui 使用 React Native + StyleSheet
5. 保持行为一致
```

### 生成 API 服务

```
请帮我生成 [API 名称] 服务，遵循：
- request-axios-rules.md 中的 API 规范
- 放在 services/modules/ 目录

API 功能：[需求描述]

要求：
1. 使用项目配置的 axios 实例
2. 定义请求和响应类型
3. 导出请求函数
```

---

## 📁 标准目录结构

### Monorepo 根目录

```
repo/
├── apps/              # 业务应用
│   ├── admin/
│   │   └── src/
│   │       ├── pages/        # 页面
│   │       ├── components/   # 业务组件
│   │       ├── hooks/        # 页面级 Hooks
│   │       ├── services/     # API 服务
│   │       ├── types/        # 类型定义
│   │       └── utils/        # 工具函数
│   └── web/
├── packages/           # 共享库
│   ├── ui/           # 跨端抽象组件
│   ├── web-ui/       # Web 实现
│   ├── native-ui/    # RN 实现
│   ├── hooks/        # 共享 Hooks
│   └── utils/        # 共享工具
└── pnpm-workspace.yaml
```

### 单个应用内部

```
src/
├── pages/           # 页面路由
│   └── user/
│       ├── index.tsx
│       ├── components/
│       ├── hooks/
│       └── types/
├── components/       # 业务组件
│   └── user-table/
├── hooks/           # 页面级 Hooks
├── services/        # API 服务
│   ├── http/
│   │   ├── createInstance.ts
│   │   └── request.ts
│   └── modules/
├── types/           # 类型定义
├── utils/           # 工具函数
└── lib/
    └── utils.ts      # cn 工具等
```

---

## 🔧 常用命令

### Tailwind 规则

```bash
# 初始化生成
npm run tailwind-rules:init

# 实时监控
npm run tailwind-rules:watch
```

### Cursor 快捷键

- `Cmd + L` - 询问 AI
- `Cmd + K` - 编辑选中的代码
- `Cmd + I` - 内联编辑

---

## ⚡ 常用代码模式

### 1. 标准组件

```tsx
import { memo, useCallback } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  title: string;
  onClick?: () => void;
  className?: string;
};

export const Card = memo(({ title, onClick, className }: Props) => {
  return (
    <div className={cn('p-md rounded-md bg-background', className)} onClick={onClick}>
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );
});
```

### 2. 自定义 Hook

```tsx
import { useState, useCallback, useEffect } from 'react';

export const useData = (id: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDataById(id);
      setData(res);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, refetch: fetchData };
};
```

### 3. API 请求

```tsx
// services/modules/user.ts
import { request } from '../http/request';
import type { User, ApiResponse } from '@/types/user';

export const getUserById = (id: string) => {
  return request.get<ApiResponse<User>>(`/api/users/${id}`);
};

export const updateUser = (id: string, data: Partial<User>) => {
  return request.put<ApiResponse<User>>(`/api/users/${id}`, data);
};

// hooks/user.ts
import { useRequest } from './useRequest';
import { getUserById } from '@/services/modules/user';

export const useUser = (id: string) => {
  return useRequest(() => getUserById(id));
};
```

### 4. Redux 状态

```tsx
// store/modules/userSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: null,
  },
  reducers: {
    setUser(state, action) {
      state.userInfo = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;

// 组件中使用
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/store/modules/userSlice';

const UserProfile = () => {
  const user = useSelector(state => state.user.userInfo);
  const dispatch = useDispatch();

  const handleUpdate = useCallback((newData) => {
    dispatch(setUser(newData));
  }, [dispatch]);

  return <div>{user?.name}</div>;
};
```

### 5. React Native 组件

```tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  title: string;
  onPress?: () => void;
};

export const RNCard = ({ title, onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
});
```

### 6. 跨端组件

```tsx
// packages/ui/button/index.tsx
import { isWeb } from '../utils';
import { WebButton } from '@repo/web-ui/button';
import { NativeButton } from '@repo/native-ui/button';

type ButtonProps = {
  children: React.ReactNode;
  onPress?: () => void;
  loading?: boolean;
};

export const Button = (props: ButtonProps) => {
  return isWeb()
    ? <WebButton {...props} />
    : <NativeButton {...props} />;
};
```

---

## 🎨 Tailwind 样式速查

### 常用类名

| 用途 | 类名 |
|------|------|
| 水平居中 | `flex justify-center` |
| 垂直居中 | `flex items-center` |
| 完全居中 | `flex items-center justify-center` |
| 两端对齐 | `flex justify-between` |
| 网格布局 | `grid grid-cols-3 gap-4` |
| 响应式 | `md:grid-cols-2 lg:grid-cols-3` |
| 内边距 | `p-4`、`p-md`、`p-lg` |
| 外边距 | `m-4`、`m-md`、`m-lg` |
| 间距 | `gap-4`、`gap-md`、`gap-lg` |
| 圆角 | `rounded-md`、`rounded-lg`、`rounded-full` |
| 阴影 | `shadow-sm`、`shadow-md` |

### 颜色使用

```tsx
// 语义化颜色
className="bg-primary text-text-heading"
className="border-border hover:bg-surface-secondary-hover"

// 状态色
className="text-success bg-success/10"
className="text-error bg-error/10"
```

### 合并 className

```tsx
import { cn } from '@/lib/utils';

// 简单合并
<div className={cn('base-class', className)} />

// 条件合并
<div className={cn('base', isActive && 'active')} />

// 多个条件
<div className={cn(
  'base',
  variant === 'primary' && 'bg-primary',
  disabled && 'opacity-50',
  className
)} />
```

---

## ❌ 常见错误对照

| 错误表现 | 原因 | 修复 |
|---------|------|------|
| 组件不更新 | props 变化导致子组件不更新 | 使用 `memo` + 稳定 props |
| 性能差 | 列表没有 key 或 key 不稳定 | 使用 `item.id` 作为 key |
| 性能差 | 每次渲染创建新函数 | 使用 `useCallback` |
| 重复请求 | useEffect 依赖问题 | 检查依赖数组 |
| 类型错误 | 使用了 `any` | 定义明确的类型 |
| 事件无效 | 匿名函数导致引用变化 | 使用 `useCallback` |
| 样式不生效 | Tailwind 类名拼写错误 | 检查类名拼写 |
| RN 报错 | 使用了 Web 组件 | 使用 RN 的 View/Text |
| RN 布局错误 | 使用了 flex-direction: column | 使用 flexDirection: 'column' |
| RN 样式无效 | 使用了 px 单位 | 使用数字（dp） |

---

## 🧩 状态管理速查

| 状态类型 | 使用场景 | 解决方案 |
|---------|---------|---------|
| 全局状态 | 用户信息、登录状态、权限 | Redux |
| 模块状态 | 表单联动、可编辑表格 | MobX |
| 局部状态 | 弹窗开关、loading | useState |

### Redux 使用

```tsx
import { useSelector, useDispatch } from 'react-redux';

const user = useSelector(state => state.user.userInfo);
const dispatch = useDispatch();

dispatch(setUser(data));
```

### MobX 使用

```tsx
import { observer } from 'mobx-react-lite';
import { userStore } from '@/stores/userStore';

const UserProfile = observer(() => {
  return <div>{userStore.user?.name}</div>;
});
```

---

## 📖 完整文档

| 文档 | 说明 |
|------|------|
| [README.md](README.md) | 详细的项目说明 |
| [TAILWIND-RULES-README.md](TAILWIND-RULES-README.md) | Tailwind 规则生成系统 |
| [.cursor/skills/README.md](.cursor/skills/README.md) | 技能模块详细说明 |

---

## 💡 提示

1. **让 AI 先搜索** - 生成代码前，让 AI 搜索现有组件和 Hooks
2. **引用规则** - 提示 AI 遵循具体的规则文件
3. **分步生成** - 复杂功能可以分步生成，逐步完善
4. **代码审查** - 生成后使用代码审查模板检查代码质量
5. **Tailwind 自动化** - 使用 `npm run tailwind-rules:init` 生成项目专属规则

---

**祝编码愉快！🎉**
