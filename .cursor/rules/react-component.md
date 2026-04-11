---
name: react-component-rules
description: React Web 组件编写规范（强制）
---

# React Web 组件编写规范（强制）

适用于：

- React (Vite)
- TypeScript
- Tailwind CSS
- shadcn/ui

目标：

- 统一组件实现方式
- 提高性能
- 提高可维护性
- 提高 AI 生成代码质量


# React 组件规范

# 1. 必须使用

- React 18
- 函数组件（Function Component）
- TypeScript
- 必须使用命名导出（Named Export）
```tsx
export const Button = () => {}
```
- 组件文件结构（强制）
```tsx
// 1. import
// 2. types
// 3. constants
// 4. hooks
// 5. component
// 6. sub components（可选）
```

❌ 禁止 Class Component

---

# 2. 组件结构（强制顺序）

```tsx
import ...

type Props = {}

export const Component = (props: Props) => {
  // 1. hooks
  // 2. memoized values
  // 3. handlers
  // 4. render
}
```

# 3. Props 规范
## 3.1 Props 必须定义类型
```tsx
type Props = {
  loading?: boolean;
  onClick?: () => void;
};
```
## 3.2 Props 必须解构

```tsx
export const Button = ({ loading }: Props) => {}
```

## 3.3 禁止 any
❌ 禁止：
```tsx
props: any
```
## 3.4 必须区分 UI props / 行为 props

```tsx
type Props = {
  // UI
  className?: string;
  
  // 行为
  onClick?: () => void;
};
```
# 4.JSX 规范

## 4.1 JSX 必须简洁
❌ 错误：
```tsx
<div>{a && b && c && <Comp />}</div>
```

✅ 正确：
```tsx
const show = a && b && c;
return <div>{show && <Comp />}</div>;
```

## 4.2 禁止 JSX 内写复杂逻辑

## 4.3 条件渲染必须清晰

```tsx
if (!visible) return null;
```

# 5. 事件规范（强制）

必须遵循：

- event-rules.md

核心：

- 禁止匿名函数

- 必须 useCallback

- 禁止 JSX 内函数


# 6. Hooks 规范（强制）

必须遵循：

hooks-rules.md

# 7. 样式规范（Tailwind）

- 必须使用 Tailwind
- 禁止使用 CSS 模块
- 禁止使用 styled-components

## 7.1 必须使用 Tailwind
```tsx
<div className="flex items-center" />
```
## 7.2 className 必须使用合并工具
```tsx
import { cn } from '@/lib/utils';

<div className={cn('base', className)} />
```

## 7.3 禁止硬编码样式

❌ 错误：
```tsx
<div style={{ marginLeft: 13 }} />
```

# 8. 组件拆分规范（关键）

## 8.1单组件职责单一

❌ 错误：

- 一个组件做 UI + 数据请求 + 逻辑

## 8.2 必须拆分：

- UI 组件

- Hook

- Container（可选）

## 8.3 文件结构

```bash
Button/
 ├── index.ts
 ├── Button.tsx
 ├── types.ts
 ├── hooks.ts（可选）
```

# 9.性能规范（强制）

## 9.1 必须使用 memo（展示组件）
```tsx
export const Button = memo((props: Props) => {})
```

## 9.2 必须使用 useCallback

## 9.3 必须使用 key（列表）

### 9.3.1 key 规范
```tsx
// ✅ 正确：使用稳定的 key
list.map(item => <Item key={item.id} />)

// ❌ 错误：避免使用 index 作为 key
list.map((item, index) => <Item key={index} />)
```

### 9.3.2 禁止列表中使用匿名函数（性能优化）

**理由**：列表中的匿名函数会导致每次渲染都创建新函数，破坏子组件的 memo 优化。

❌ 错误：
```tsx
list.map(item => (
  <Button onClick={() => handleClick(item.id)}>删除</Button>
))
```

✅ 正确：使用闭包 + useCallback
```tsx
const handleClick = useCallback((id: string) => {
  doSomething(id);
}, []);

list.map(item => (
  <Button key={item.id} onClick={() => handleClick(item.id)}>删除</Button>
))
```

✅ 正确：高性能写法（推荐）
```tsx
const handleClick = useCallback((e: React.MouseEvent) => {
  const id = (e.currentTarget as HTMLElement).dataset.id;
  doSomething(id);
}, []);

list.map(item => (
  <Button key={item.id} data-id={item.id} onClick={handleClick}>删除</Button>
))
```

## 9.4 禁止重复计算
```tsx
const value = useMemo(() => compute(a), [a]);
```
# 10. 可复用性规范

## 10.1 禁止写业务逻辑
❌ 错误：
```tsx
if (user.role === 'admin') {}
```
## 10.2 必须可组合

```tsx
<Card>
  <Card.Header />
</Card>
```

## 10.3 支持扩展

```tsx
className
style
children
```
# 11. Ref 规范
## 11.1 必须使用 forwardRef（需要时）
```tsx
export const Input = forwardRef<HTMLInputElement, Props>(
  (props, ref) => {}
);
```

## 11.2 禁止滥用 ref

# 12. 语义化规范

必须：
```tsx
button / input / form
```

❌ 禁止 div 代替

# 13. 可访问性（a11y）

必须：
```tsx
<button aria-label="关闭" />
```

# 14. 错误处理

## 14.1 不允许组件崩溃

## 14.2 必须容错
```tsx
if (!data) return null;
```

# 15. 禁止行为（强制）
❌ default export
❌ any
❌ class component
❌ JSX 写函数
❌ 写业务逻辑
❌ 直接请求 API
❌ 操作 DOM

# 16. 推荐模式

## 16.1 纯展示组件

```tsx
type Props = {
  title: string;
};

export const Title = memo(({ title }: Props) => {
  return <h1>{title}</h1>;
});
```

## 16.2 Hook + UI

```tsx
const useData = () => {}

export const List = () => {
  const { data } = useData();
  return <View data={data} />;
};
```

# 17. AI 行为约束（关键）

AI 生成组件必须：

- 自动使用 TypeScript

- 自动拆分组件结构

- 自动使用 memo

- 自动使用 useCallback

- 自动应用 Tailwind

- 自动避免匿名函数

- 自动符合 component-usage-rules

- 自动符合 hooks-rules

- 自动符合 event-rules

#18. 自检清单（必须）

- [ ]是否使用 TS 类型

- [ ]是否使用 memo

- [ ]是否存在匿名函数

- [ ]是否使用 useCallback

- [ ]是否违反 hooks-rules

- [ ]是否违反 event-rules

- [ ]是否写了业务逻辑

- [ ]是否有性能问题

- [ ]是否支持扩展 className

- [ ]是否符合组件拆分原则
  
