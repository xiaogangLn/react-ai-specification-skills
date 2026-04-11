# 细粒度状态订阅

### 为什么重要

当一个组件订阅了过于宽泛的状态时，任何相关状态的变化都会导致组件重新渲染。通过细化状态订阅的粒度，只订阅组件真正需要的数据，可以显著减少不必要的重渲染次数。

### 适用场景

- 使用全局状态管理（如 Redux、Zustand、Jotai）
- 使用 Context API 管理状态
- 组件只需要状态树中的部分数据

### 不适用场景

- 组件需要监听整个状态树的变化
- 状态变化频繁且所有变化都需要触发更新

### 反例

```typescript
// ❌ 订阅整个用户对象，任何用户信息变化都会重渲染
const UserProfile = () => {
  const user = useStore((state) => state.user);

  return (
    <div>
      <Avatar src={user.avatar} />
      <span>{user.name}</span>
    </div>
  );
};
```

### 正例

```typescript
// ✅ 只订阅需要的字段，仅相关字段变化时重渲染
const UserProfile = () => {
  const avatar = useStore((state) => state.user.avatar);
  const name = useStore((state) => state.user.name);

  return (
    <div>
      <Avatar src={avatar} />
      <span>{name}</span>
    </div>
  );
};
```

### 落地提示

1. 在 Zustand 中，使用选择器函数来订阅特定字段
2. 在 Redux 中，使用 `useSelector` 配合记忆化的选择器
3. 在 Context 中，拆分为多个 Context 来按需订阅
4. 对于组合状态，使用浅比较来减少不必要的重渲染
5. 考虑使用 `shallow` 比较库来避免对象引用变化导致的重渲染

### 参考资料

- [Zustand: Selectors](https://github.com/pmndrs/zustand#selecting-multiple-state-slices)
- [Redux: Performance](https://redux.js.org/usage/deriving-data-selectors)
- [React: Context](https://react.dev/reference/react/useContext)
