---
name: component-usage-rules
description: 组件使用规范（工程级：可维护性 + 可组合性 + 性能 + 跨端一致性）
---

# 组件使用规范（强制）

适用于：

- React（Web / Admin）
- React Native

目标：

- 防止错误使用组件
- 保证组件可复用
- 控制渲染性能
- 提高可读性

---

# 1. 基本原则（核心）

## 1.1 单向数据流（必须）

- 所有数据必须通过 props 传递
- 不允许外部修改组件内部状态

---

## 1.2 控制优先（Controlled First）

组件优先支持受控模式：

```tsx
<Input value={value} onChange={setValue} />
```

## 1.3 禁止直接操作组件内部

❌ 禁止：
- 直接操作组件内部状态
- 使用 ref 操作内部 DOM（除非明确暴露）
- 在组件内部修改外部状态

# 2. Props 使用规范

## 2.1 必须类型安全

```tsx
type Props = {
  loading?: boolean;
};
```

## 2.2 解构 + 默认值
```tsx
const Button = ({ loading = false }: Props) => {}
```

## 2.3 Props 不允许透传污染
❌ 错误：
```tsx
<Button {...props} />
```

## 2.4 Props 分组（推荐）

```tsx
type Props = {
  value: string;
  onChange: (v: string) => void;

  style?: string;
  className?: string;
};
```

# 3. children 使用规范

## 3.1 简单组件
```tsx
<Button>提交</Button>
```

## 3.2 复杂组件（slot 模式）
```tsx
<Card>
  <Card.Header />
  <Card.Body />
</Card>
```
## 3.3 children 类型必须明确
```tsx
children: React.ReactNode;
```

## 3.4 禁止滥用 children
❌ 错误：
<Button>{complexLogic()}</Button>

# 4. 事件使用规范（必须结合 event-rules）

## 4.1 事件必须通过 props 传递
```tsx
<Button onClick={handleClick} />
```

## 4.2 禁止组件内部绑定业务事件
❌ 错误：
```tsx
<Button onClick={() => submit()} />
```

## 4.3 禁止吞掉事件
❌ 错误：
```tsx
<button onClick={onClick} />
```

# 5. 组合优于继承（核心）
## 5.1 禁止继承组件
```tsx
class PrimaryButton extends Button {}
```
## 5.2 必须使用组合
```tsx
<Button variant="primary" />
```

## 5.3 复合组件模式（推荐）
```tsx
<Select>
  <Select.Option value="1" />
</Select>
```

# 6. 样式使用规范
Web（Tailwind）
必须：
```tsx
<div className="flex items-center" />
```
禁止：

❌ inline style（除非动态计算）

React Native
必须：
```tsx
StyleSheet.create({})
```

# 7. 状态使用规范

## 7.1 UI 组件禁止持有业务状态
❌ 错误：
```tsx
const [user, setUser] = useState();
```
## 7.2 状态应由外部控制
``` tsx
<UserCard user={user} />
```

## 7.3 复杂逻辑必须抽离 hook

# 8. 数据请求规范（强制）

❌ 禁止在组件中直接请求：
```tsx
useEffect(() => {
  fetch();
}, []);
```
✅ 必须：
```tsx
const { data } = useUser();
```

# 9. 性能规范（重点）

## 9.1 避免重复 render

-使用 memo

-使用 useCallback

-使用 useMemo

## 9.2 列表必须加 key

```tsx
list.map(item => <Item key={item.id} />)
```
## 9.3 禁止在 JSX 中写函数

❌ 禁止：
```tsx
<Button onClick={() => doSomething()} />
```

# 10. 跨端使用规范（Web + RN）

## 10.1 props 必须一致
```tsx
<Button onClick />   // web
<Button onPress />   // RN
```

## 10.2 命名统一

-Button

-Input

-Modal

## 10.3 行为一致

-loading

-disabled

-状态表现一致

# 11. 可扩展性规范
## 11.1 支持 className / style 扩展
```tsx
<Button className="w-full" />
```

## 11.2 支持透传（有限）
```tsx
<button {...rest} />
```
（仅允许 DOM 属性）

# 12. 禁止行为（强制）
❌ 修改 DOM
❌ 写死数据
❌ 写业务逻辑
❌ 直接请求 API
❌ 跨层通信（如全局变量


# 13. 推荐模式
Container + Presentational
```tsx
const Container = () => {
  const { data } = useUser();
  return <UserView data={data} />;
};
```
# 14. AI 行为约束（关键）

1.生成组件使用代码时必须：

2.所有数据通过 props 传递

3.不允许组件内部写业务逻辑

4.自动拆分 container / UI

5.自动应用 event-rules

6.自动应用 hooks-rules

7.禁止匿名函数

8.自动优化性能

# 15. 自检清单（AI 必须执行）

- [ ]是否使用受控模式

- [ ]是否存在 props 污染

- [ ]是否存在匿名函数

- [ ]是否违反 event-rules

- [ ]是否违反 hooks-rules

- [ ]是否存在性能问题

- [ ]是否有业务逻辑混入 UI

- [ ]是否符合跨端规范