# 动态导入优化

### 为什么重要

动态导入（Dynamic Import）允许代码按需加载，减少初始包体积。将非关键代码延迟加载，可以显著改善首屏加载时间和可交互时间（TTI）。

### 适用场景

- 首屏不需要立即使用的组件或模块
- 条件性加载的功能（如模态框、下拉菜单）
- 大型第三方库或组件
- 路由级别的代码分割

### 不适用场景

- 首屏渲染必需的核心组件
- 极小的组件（代码分割的开销可能超过收益）

### 反例

```typescript
// ❌ 静态导入，所有代码都打包进主包
import HeavyChart from '@/components/HeavyChart';
import Modal from '@/components/Modal';
import DataGrid from '@/components/DataGrid';

function Dashboard() {
  return (
    <div>
      <HeavyChart />
      <Modal />
      <DataGrid />
    </div>
  );
}
```

### 正例

```typescript
// ✅ 动态导入，按需加载
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false
});

const Modal = dynamic(() => import('@/components/Modal'), {
  ssr: false
});

const DataGrid = dynamic(() => import('@/components/DataGrid'), {
  loading: () => <GridSkeleton />
});

function Dashboard() {
  return (
    <div>
      <HeavyChart />
      <Modal />
      <DataGrid />
    </div>
  );
}
```

### 落地提示

1. 在 Next.js 中使用 `next/dynamic()` 来实现动态导入
2. 使用纯 React 时使用 `import()` 语法配合 `React.lazy()`
3. 为动态组件提供加载状态，提升用户体验
4. 对于 SSR 不必要的组件，设置 `ssr: false`
5. 预加载重要但非首屏的代码：使用 webpack 的魔法注释 `/* webpackPrefetch: true */`

### 参考资料

- [Next.js: Dynamic Imports](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
- [React: Code-Splitting](https://react.dev/reference/react/lazy)
- [Dynamic Imports - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/import)
