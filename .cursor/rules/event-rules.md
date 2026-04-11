---
name: event-rules
description: React / React Native 事件处理规范（性能 + 可维护性）
---

# 事件处理规范（强制）

## 1. 命名规范

## 1.1 Props 事件命名

必须以 `on` 开头：

```tsx
type Props = {
  onClick?: () => void;
  onChange?: (value: string) => void;
};
```

## 1.2 内部 handler 命名

必须以 `handle` 开头：

```tsx
type Props = {
  onClick?: () => void;
};

const handleClick = () => {};
```

## 1.3 单一职责

一个 handler 只负责一个事件：

❌ 错误：

```tsx
const handleClick = (event: MouseEvent) => {};
```

✅ 正确：

```tsx
const handleClick = (event: MouseEvent) => {};
const handleChange = (value: string) => {};
```

# 2 禁止匿名函数（核心）

❌ 错误：

```tsx
<Button onClick={() => doSomething(a, b)} />
```

✅ 正确：

```tsx
<Button onClick={doSomething(a, b)} />
```

# 3 必须使用 useCallback

-   **理由：** 避免不必要的重新渲染。
-   **例外：** 事件处理函数依赖的值在父组件中不会改变。

✅ 正确：

```tsx
const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

<Button onClick={handleClick} />
```

# 4 必须使用 useMemo

-   **理由：** 避免不必要的重新渲染。
-   **例外：** 计算值依赖的值在父组件中不会改变。

✅ 正确：

```tsx
const memoValue = useMemo(() => computeValue(a, b), [a, b]);

<Button memoValue={memoValue} />
```
# 5 参数传递规范（必须）

## 5.1 使用闭包 + useCallback

✅ 正确：

```tsx
const handleClick = useCallback((id: string) => {
  doSomething(id);
}, []);
```
## 5.2 列表场景（推荐写法）

❌ 错误：

```tsx
list.map(item => (
  <Button onClick={() => handleClick(item.id)} />
));
```

✅ 正确：（稳定引用）

```tsx
const handleClick = useCallback((id: string) => {
  doSomething(id);
}, []);

list.map(item => (
  <Button key={item.id} onClick={() => handleClick(item.id)} />
));
```

✅ 正确：高性能写法（推荐）

```tsx
const handleClick = useCallback((e: React.MouseEvent) => {
  const id = (e.currentTarget as HTMLElement).dataset.id;
  doSomething(id);
}, []);

<Button data-id={item.id} onClick={handleClick} />
```

# 6 事件透传（组件设计必须）

**理由：** 避免事件处理函数在每次渲染时都被创建，导致不必要的重新渲染。

✅ 正确：

```tsx
export const Button = ({ onClick }: Props) => {
  return <button onClick={onClick} />;
};
```

## 禁止

❌ 吞掉事件：
```tsx
<button onClick={() => {}} />
```

❌ 修改语义：
```tsx
<button onClick={() => onClick?.('extra')} />
```


# 7. React Native 事件差异（必须识别）

-   **理由：** React Native 事件系统与浏览器不同，React Native 没有 `onClick`，而是 `onPress`。
-   **例外：** 组件库统一定义了事件处理函数的命名规范。

| Web      | React Native    |
| -------- | --------------- |
| onClick  | onPress         |
| onChange | onChangeText    |
| onSubmit | onSubmitEditing |


RN 示例
```tsx
<TouchableOpacity onPress={handlePress}>
  <Text>Click</Text>
</TouchableOpacity>
```

# 8. 防抖 / 节流（必须场景）

| 场景     | 处理方式     |
| ------ | -------- |
| 输入框    | debounce |
| 滚动     | throttle |
| resize | debounce |

示例：
```tsx
const handleSearch = useMemo(
  () => debounce((value: string) => search(value), 300),
  []
);
```

# 9. 事件副作用规范
必须：

不在 render 中执行副作用

不在事件中直接修改外部变量

副作用必须可控

❌ 错误:
```tsx
let count = 0;

const handleClick = () => {
  count++;
};
```

✅ 正确:
```tsx
const [count, setCount] = useState(0);

const handleClick = useCallback(() => {
  setCount(prev => prev + 1);
}, []);
```

# 10. 禁止行为（强制）

❌ JSX 中写复杂逻辑:
```tsx
<Button onClick={() => {
  if (a) doA();
  else doB();
}} />
```

❌ 多层嵌套事件

❌ 在事件中直接调用 API（必须走 hook）

## 推荐模式（标准写法）
```tsx
const handleSubmit = useCallback(async () => {
  await submit();
}, [submit]);

<Button onClick={handleSubmit} />
```

# 11.与 Hooks 规范联动（必须

所有 handler 必须使用 useCallback

所有依赖必须完整声明

不允许闭包引用错误数据
