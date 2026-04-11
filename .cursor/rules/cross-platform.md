---
name: cross-platform-rules
description: Web + React Native 跨端开发规范（工程级）
---

# 跨端规范（强制）

适用于：

- React（Web / Admin）
- React Native（App）

目标：

- 一套组件设计，多端实现
- API 一致
- 行为一致
- UI 差异可控

---

# 1. 组件分层（核心架构）

```bash
packages/
  ui/              # 跨端抽象层（统一 API，不包含平台实现）
  web-ui/          # Web 实现（React + Tailwind + shadcn）
  native-ui/       # RN 实现（React Native）
```

## 1.1 分层职责（必须严格遵守）
| 层级        | 职责               |
| --------- | ---------------- |
| ui        | 抽象接口 + 类型 + 统一导出 |
| web-ui    | Web 具体实现         |
| native-ui | RN 具体实现          |



## 1.2 ui 层（抽象层）规范（最关键）

只做：

- 类型定义

- 统一接口

- 平台分发（adapter）

示例:

```tsx
// packages/ui/button/index.tsx

import { isWeb } from '../utils';
import { WebButton } from '@repo/web-ui/button';
import { NativeButton } from '@repo/native-ui/button';

export const Button = (props) => {
  if (isWeb()) return <WebButton {...props} />;
  return <NativeButton {...props} />;
};
```

## 1.3 ui/types.ts（必须存在）

```tsx
export type ButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  onPress?: () => void;
  loading?: boolean;
};
```

# 2. 组件目录结构（细化）

## 2.1 ui 层
```bash
ui/
  button/
    index.tsx        # 统一导出
    types.ts         # props 定义（必须）
```

## 2.2 web-ui 层
```bash
web-ui/
  button/
    Button.tsx
    styles.ts（可选）
    index.ts
```
## 2.3 native-ui 层
```bash
native-ui/
  button/
    Button.tsx
    styles.ts
    index.ts
```

# 3. Props 设计规范（跨端统一）

## 3.1 必须统一 API
```tsx
type ButtonProps = {
  children?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
};
```

## 3.2 事件统一策略
```tsx
// web
<Button onClick />

// RN
<Button onPress />
```

## 3.3 正确（统一抽象）
```tsx
type ButtonProps = {
  onPress?: () => void;
};
```
👉 在 web 内部适配：
```tsx
<button onClick={onPress} />
```

# 4. 平台差异处理（关键）

## 4.1 必须在实现层处理

❌ 禁止在 ui 层写：
```tsx
if (Platform.OS === 'ios') {}
```

## 4.2 正确
```tsx
// web-ui
<button />

// native-ui
<TouchableOpacity />
```

# 5. 样式系统统一（难点）
## 5.1 Web

- Tailwind

- shadcn

## 5.2 React Native

- StyleSheet

- 或 nativewind（可选）

## 5.3 Design Token（必须统一）
```tsx
export const tokens = {
  color: {
    primary: '#1677ff',
  },
  spacing: {
    sm: 8,
    md: 16,
  },
};
```
# 6. 行为一致性（必须）
| 能力       | 要求   |
| -------- | ---- |
| loading  | UI一致 |
| disabled | 不可点击 |
| 点击反馈     | 有反馈  |


# 7. 组件能力分级（推荐）

## 7.1 基础组件（必须跨端）

- Button

- Input

- Text

- View

## 7.2 复杂组件（可选跨端）

- Modal

- Dropdown

## 7.3 页面组件（禁止跨端）

# 8. 事件规范（跨端统一）
统一使用：
```tsx
onPress
onChange
onSubmit
```

| 抽象       | web      | RN           |
| -------- | -------- | ------------ |
| onPress  | onClick  | onPress      |
| onChange | onChange | onChangeText |


# 9. Hooks 规范（跨端）

## 9.1 通用 hooks

放在：

```bash
packages/hooks/
```

## 9.2 平台 hooks

```bash
useSafeArea (RN only)
useHover (web only)
```

# 10. 禁止行为（强制）

❌ ui 层写平台逻辑
❌ props 不一致
❌ 行为不一致
❌ 样式不统一
❌ 直接引用 web-ui / native-ui（绕过 ui）

# 11. 推荐模式（Adapter 模式）
```tsx
export const Button = (props) => {
  const Comp = isWeb() ? WebButton : NativeButton;
  return <Comp {...props} />;
};
```

# 12. AI 生成约束（关键）
生成跨端组件时必须：

- 1.先定义统一 props（ui 层）

- 2.再生成 web-ui 实现

- 3.再生成 native-ui 实现

- 4.不允许混写

- 5.自动对齐行为

- 6.自动对齐事件

- 7.自动对齐样式能力

# 13. 自检清单（必须）

- [ ]是否有 ui 层抽象

- [ ]props 是否统一

- [ ]是否存在平台逻辑污染

- [ ]行为是否一致

- [ ]是否绕过 ui 层

- [ ]是否有 design token

- [ ]是否符合 event-rules

- [ ]是否符合 hooks-rules

# 14. 进阶（推荐）

## 14.1 Schema 驱动（高级）
```tsx
UI Schema → Web / RN 代码
```
## 14.2 自动生成

- create-component → 自动生成三层结构