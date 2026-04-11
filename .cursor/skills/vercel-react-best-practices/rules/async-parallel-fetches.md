# 并行请求获取

### 为什么重要

串行请求会形成"瀑布效应"，每个请求必须等待前一个请求完成后才能开始。这会显著增加总加载时间，特别是在网络延迟较高的情况下。通过并行请求，多个请求可以同时进行，显著减少总等待时间。

### 适用场景

- 需要从多个端点获取独立数据的场景
- 没有依赖关系的多个数据请求
- 可以同时发起的 API 调用

### 不适用场景

- 后续请求依赖前一个请求的结果
- 请求顺序对业务逻辑有严格要求

### 反例

```typescript
// ❌ 串行请求，形成瀑布
async function fetchData() {
  const user = await fetch('/api/user');
  const posts = await fetch('/api/posts');
  const settings = await fetch('/api/settings');
  return { user, posts, settings };
}
```

### 正例

```typescript
// ✅ 并行请求，同时发起
async function fetchData() {
  const [user, posts, settings] = await Promise.all([
    fetch('/api/user'),
    fetch('/api/posts'),
    fetch('/api/settings')
  ]);
  return { user, posts, settings };
}
```

### 落地提示

1. 使用 `Promise.all()` 或 `Promise.allSettled()` 来并行执行独立请求
2. 对于需要部分失败容错的场景，使用 `Promise.allSettled()` 替代 `Promise.all()`
3. 考虑对大量请求进行分批并行，避免同时发起过多请求
4. 在服务端使用 Next.js 时，在 `async Server Component` 中同样适用此规则

### 参考资料

- [Promise.all() - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
- [Next.js: Fetching, Caching, and Revalidating](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Eliminating Request Waterfalls](https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast)
