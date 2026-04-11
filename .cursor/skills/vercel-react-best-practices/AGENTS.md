# React / Next.js 性能最佳实践 - 完整规则汇编

> 本文件是技能书的完整规则汇编，用于集中查看全量内容。

---

## 第1章：消除请求瀑布

### async-parallel-fetches - 并行请求获取

串行请求会形成"瀑布效应"，每个请求必须等待前一个请求完成后才能开始。通过并行请求，多个请求可以同时进行，显著减少总等待时间。

```typescript
// ❌ 串行请求
async function fetchData() {
  const user = await fetch('/api/user');
  const posts = await fetch('/api/posts');
  return { user, posts };
}

// ✅ 并行请求
async function fetchData() {
  const [user, posts] = await Promise.all([
    fetch('/api/user'),
    fetch('/api/posts')
  ]);
  return { user, posts };
}
```

---

## 第2章：包体积优化

### bundle-dynamic-imports - 动态导入优化

动态导入允许代码按需加载，减少初始包体积。将非关键代码延迟加载，可以显著改善首屏加载时间。

```typescript
// ❌ 静态导入
import HeavyChart from '@/components/HeavyChart';

// ✅ 动态导入
import dynamic from 'next/dynamic';
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false
});
```

---

## 第3章：服务端性能优化

### server-caching - 服务端缓存

合理使用缓存可以显著减少服务端计算和数据库查询次数，提升响应速度。

```typescript
// ✅ 使用 Next.js 的缓存配置
export const revalidate = 3600; // 1小时

async function getData() {
  const data = await fetch('/api/data', {
    next: { revalidate: 3600 }
  });
  return data.json();
}
```

---

## 第4章：客户端数据获取优化

### client-request-deduplication - 请求去重

多个组件同时请求相同数据时，应避免重复请求。

```typescript
// ✅ 使用 SWR 自动去重
import useSWR from 'swr';

function useUser(id) {
  const { data } = useSWR(`/api/user/${id}`, fetcher);
  return data;
}
```

---

## 第5章：重渲染优化

### rerender-granular-state - 细粒度状态订阅

只订阅组件真正需要的数据，减少不必要的重渲染。

```typescript
// ❌ 订阅整个对象
const user = useStore((state) => state.user);

// ✅ 只订阅需要的字段
const avatar = useStore((state) => state.user.avatar);
const name = useStore((state) => state.user.name);
```

---

## 第6章：渲染性能优化

### rendering-static-promotion - 静态提升

将静态内容提升到组件外部，避免重复创建。

```typescript
// ❌ 每次渲染创建新对象
function List() {
  const options = { style: 'normal', size: 'md' };
  return <ListBase options={options} />;
}

// ✅ 静态提升到组件外部
const OPTIONS = { style: 'normal', size: 'md' };
function List() {
  return <ListBase options={OPTIONS} />;
}
```

---

## 第7章：JavaScript 运行时优化

### js-caching - 计算缓存

避免重复计算，使用记忆化缓存计算结果。

```typescript
// ❌ 每次渲染重新计算
function List({ items }) {
  const sorted = items.sort((a, b) => a.name.localeCompare(b.name));
  return <ul>{sorted.map(item => <li key={item.id}>{item.name}</li>)}</ul>;
}

// ✅ 使用 useMemo 缓存计算结果
function List({ items }) {
  const sorted = useMemo(
    () => items.sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  );
  return <ul>{sorted.map(item => <li key={item.id}>{item.name}</li>)}</ul>;
}
```

---

## 第8章：进阶性能模式

### advanced-stable-references - 稳定引用

保持回调函数和对象的引用稳定，避免子组件不必要的重渲染。

```typescript
// ❌ 每次渲染创建新函数
function Parent({ items }) {
  const handleClick = (id) => console.log(id);
  return <Child items={items} onClick={handleClick} />;
}

// ✅ 使用 useCallback 保持引用稳定
function Parent({ items }) {
  const handleClick = useCallback((id) => console.log(id), []);
  return <Child items={items} onClick={handleClick} />;
}
```

---

## 快速参考

| 类别 | 规则 | 关键点 |
|------|------|--------|
| 请求瀑布 | async-parallel-fetches | Promise.all 并行请求 |
| 包体积 | bundle-dynamic-imports | dynamic() 按需加载 |
| 服务端 | server-caching | revalidate 缓存配置 |
| 客户端 | client-request-deduplication | SWR 去重 |
| 重渲染 | rerender-granular-state | 细粒度订阅 |
| 渲染 | rendering-static-promotion | 静态提升 |
| 运行时 | js-caching | useMemo 缓存 |
| 进阶 | advanced-stable-references | useCallback 稳定引用 |

---

*详细规则请查看 `rules/` 目录下的具体文件。*
