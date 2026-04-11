---
name: performance-rules
description: React / React Native 性能优化规范（强制）- 渲染控制 + 计算优化 + 列表优化 + hooks优化
---

# 性能规范（强制）

适用于：

- React（Web / Admin）
- React Native

目标：

- 减少不必要 render
- 降低计算开销
- 提升列表性能
- 避免内存泄漏

---

# 1. 渲染控制（核心）

## 1.1 必须避免不必要 render

原因：

- React 默认重新执行函数组件
- 子组件会跟随更新

---

## 1.2 必须使用 memo（展示组件）

```tsx
export const Item = memo((props: Props) => {
  return <div>{props.name}</div>;
});
```

## 1.3 父组件必须控制 props 稳定
❌ 错误：
```tsx
<Item data={{ name: 'test' }} />
```

✅ 正确：
```tsx
const data = useMemo(() => ({ name: 'test' }), []);
<Item data={data} />
```

# 2. 函数稳定性（高频问题）
## 2.1 所有事件必须 useCallback
```tsx
const handleClick = useCallback(() => {}, []);
```

## 2.2 禁止 JSX 匿名函数
```tsx
<Button onClick={() => doSomething()} />
```

# 3. 列表优化（重点）

## 3.1 React（Web）

必须：

- key 稳定

- 避免 index 作为 key

## 3.2 React Native

必须使用：
```tsx
FlatList
SectionList
```

## 3.3 renderItem 必须 useCallback
```tsx
const renderItem = useCallback(({ item }) => {
  return <Item data={item} />;
}, []);
```

# 4. hooks 性能

## 4.1 useEffect 避免死循环
❌
```tsx
useEffect(() => {
  setState(a);
}, [state]);
```

# 5. 避免重复渲染策略

| 问题       | 解决          |
| -------- | ----------- |
| props 变化 | useMemo     |
| 函数变化     | useCallback |
| 子组件更新    | memo        |


# 6. 副作用优化
## 6.1 清理副作用
```tsx
useEffect(() => {
  const timer = setInterval(...);
  return () => clearInterval(timer);
}, []);
```
## 6.2 请求取消
```tsx
AbortController
```
# 7.跨端性能差异
| 场景 | Web | RN         |
| -- | --- | ---------- |
| 列表 | map | FlatList   |
| 样式 | CSS | StyleSheet |
| 动画 | CSS | Animated   |


# 8. 禁止行为（强制）
❌ render 中计算复杂逻辑
❌ JSX 匿名函数
❌ 重复 state
❌ useEffect 滥用
❌ index 作为 key
❌ 组件不拆分

# 9.AI 行为约束（关键）
生成代码时必须：

- 1.自动使用 memo

- 2.自动使用 useCallback

- 3.自动使用 useMemo

- 4.自动优化列表

- 5.自动避免重复 state

- 6.自动拆分组件

- 7.自动补充 key

- 8.自动检测性能问题

# 10. 自动检测规则（用于 Code Review）

检测以下问题：

- 是否存在匿名函数

- 是否未使用 memo

- 是否未使用 useCallback

- 是否存在重复 state

- 是否 useEffect 错误

- 是否列表未优化

# 11.自动修复策略（AI 必须执行）

| 问题           | 修复          |
| ------------ | ----------- |
| 匿名函数         | useCallback |
| 重复 state     | useMemo     |
| props 不稳定    | useMemo     |
| 子组件重复 render | memo        |
| useEffect 误用 | 改为 useMemo  |


# 12.自检清单（必须）
 
- [ ]是否使用 memo

- [ ]是否使用 useCallback

- [ ]是否使用 useMemo

- [ ]是否存在匿名函数

- [ ]是否存在重复 state

- [ ]是否列表优化

- [ ]是否存在性能问题

- [ ]是否拆分组件
