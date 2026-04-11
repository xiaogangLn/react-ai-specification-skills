---
name: hooks-rules
description: React Hooks 编写规范（避免副作用错误 + 提升可维护性）
---

# Hooks 编写规范（强制）

# 1. 基本规则（必须）

- hooks 必须以 `use` 开头
- hooks 只能在顶层调用
- 不可在条件 / 循环中调用

❌ 错误：

```tsx
if (visible) {
  useEffect(() => {});
}
```

## 1.1 命名

- 所有 Hook 必须以 `use` 开头

```ts
useUser
useRequest
useDebounce
useThrottle
```

## 1.2 单一职责（核心）
一个 Hook 只做一件事：

❌ 错误：

``` tsx
useUserAndThemeAndRequest()
```

✅ 正确：

```tsx
useUser
useTheme
useRequest
```

# 2. Hook 分类（必须清晰）

- **状态**：`useWidth`, `useHeight`, `useToggle`, `useOptions`, `useSelected`
- **副作用**：`useScroll`, `useResize`, `usePrint`, `useHistory`
- **工具**：`useThrottle`, `useDebounce`, `useOnce`, `useIsMounted`, `useLatest`
- **其他**：`useMenu`, `useLog`, `usePrevious`, `useInterval`

| 类型  | Hook                             |
| --- | -------------------------------- |
| 状态  | useState / useReducer            |
| 副作用 | useEffect                        |
| 计算  | useMemo                          |
| 回调  | useCallback                      |
| 引用  | useRef                           |
| 并发  | useTransition / useDeferredValue |
| 自定义 | useXXX                           |


#  3. useEffect 规范（最重要）

## 3.1 必须规则

必须写依赖数组

必须处理 cleanup（如有副作用）

不允许写“模糊逻辑”

## 3.2 标准结构

✅ 正确：

```tsx
useEffect(() => {
  // side effect

  return () => {
    // cleanup
  };
}, [dep1, dep2]);
```

## 3.3 依赖数组规则（核心）

必须：

所有使用的外部变量必须声明

```tsx
useEffect(() => {
  console.log(a);
}, []);
```

## 3.4 依赖稳定策略
| 场景 | 方案          |
| -- | ----------- |
| 函数 | useCallback |
| 对象 | useMemo     |
| 常量 | useRef      |


## 3.5 拆分 effect（非常重要）

❌ 错误：
```tsx
useEffect(() => {
  fetchData();
  subscribe();
}, []);
```
✅ 正确：
```tsx
useEffect(fetchData, []);
useEffect(subscribe, []);
```

## 3.6 禁止 useEffect 做计算

❌ 错误
```tsx
useEffect(() => {
  setTotal(a + b);
}, [a, b]);
```
✅ 正确：
```tsx
const total = useMemo(() => a + b, [a, b]);
```

# 4. useState / useReducer 规范

## 4.1 useState

简单状态优先使用

避免重复 state

❌ 错误：
```tsx
const [fullName, setFullName] = useState('');
```

## 4.2 派生状态

必须使用 useMemo：
```tsx
const fullName = useMemo(() => `${first} ${last}`, [first, last]);
```

## 4.3 useReducer（复杂状态）
使用场景：

多状态联动

状态机

# 5. useMemo / useCallback 规范

## 5.1 使用时机
| 场景   | Hook        |
| ---- | ----------- |
| 计算   | useMemo     |
| 函数传递 | useCallback |


## 5.2 禁止滥用
- 不可变数据：直接使用 useState
- 副作用：useEffect
- 计算 + 下一代 state：useMemo
- 函数：useCallback

❌ 错误：
```tsx
useMemo(() => 1, []);
```

## 5.3 依赖必须完整

```tsx
useMemo(() => a + b, [a, b]);
```

# 6. useRef 规范


## 6.1 使用场景

DOM / RN 引用

保存 mutable 值（不触发 render）

## 6.2 替代 state（避免 render）

```tsx
const countRef = useRef(0);
```

## 6.3 防止 stale closure（高级）

```tsx
const latestValue = useRef(value);

useEffect(() => {
  latestValue.current = value;
}, [value]);
```

# 7. 自定义 Hook 规范（核心）

必须：

- 在前缀写文档
- 名字以 use 开头
- 依赖数组必须完整
- 没有副作用

## 7.1 返回值必须对象·

```tsx
return {
  data,
  loading,
  run,
};
```

## 7.2 禁止返回数组（除非明确约定）

## 7.3 不写 UI

❌ 错误：
```tsx
return <div />;
```


## 7.4 必须可复用

不依赖具体业务组件

# 8. 请求 Hook（强制标准）

标准实现
```tsx
export const useRequest = (service) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(async (...args) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);

    try {
      const res = await service(...args, {
        signal: controller.signal,
      });
      setData(res);
    } finally {
      setLoading(false);
    }
  }, [service]);

  return { loading, data, run };
};
```
必须支持:

- loading

- error（推荐）

- cancel（AbortController）

- retry（可选）

# 9. 并发 Hooks（React 18）

useTransition
```tsx
const [isPending, startTransition] = useTransition();
```
使用场景：

- 非紧急 UI 更新

useDeferredValue
```tsx
const deferred = useDeferredValue(value);
```

# 10. Hook 拆分规则（必须）

必须拆分当：

- 100 行

- 多职责

- 可复用逻辑

# 11. React Native 特殊规则

不使用 DOM

不依赖 window/document

useEffect 中避免频繁 setState（性能问题）

# 12. 常见反模式（必须避免）

❌ useEffect 依赖缺失
❌ 在 effect 中 setState 触发死循环
❌ useMemo 依赖错误
❌ Hook 嵌套调用
❌ 在 Hook 中写业务 UI

# 13. AI 行为约束（关键）

生成代码时必须：

- 1.useEffect 必须有依赖数组

- 2.自动判断 useMemo vs useEffect

- 3.所有 handler 使用 useCallback

- 4.自动拆分复杂 Hook

- 5.自动补全依赖

- 6.请求必须封装 Hook

- 7.避免重复 state

# 14. 自动修复策略（AI 必须执行）

| 问题            | 修复           |
| ------------- | ------------ |
| useEffect 做计算 | 改为 useMemo   |
| 依赖缺失          | 自动补全         |
| 函数不稳定         | useCallback  |
| state 冗余      | 删除 + useMemo |


## 15. 自检清单（生成前必须检查）

- [ ]useEffect 是否依赖完整

- [ ]是否滥用 useEffect

- [ ]是否存在重复 state

- [ ]是否使用 useMemo/useCallback

- [ ]是否拆分 Hook

- [ ]是否有副作用泄漏

- [ ]是否支持 cleanup