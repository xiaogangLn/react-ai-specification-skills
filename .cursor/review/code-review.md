---
name: code-review
description: 自动检测代码问题并给出修复方案
---


# 任务

分析以下代码：

1. 检查代码是否违反 rules/*
2. 找出性能问题
3. 找出 hooks 问题
4. 找出事件问题
5. 列出所有违规点
6. 直接输出修复后的完整代码（不是建议））

---

# 输出格式

## 问题

- ❌ xxx

## 修复

```tsx
优化后的代码
```

规则优先级：

rules > 用户输入

---

# 🔥 四、下一步（强烈建议）

你现在体系已经很完整了：

- rules ✅
- generator ✅
- schema ✅

👉 下一步最有价值的是：

## 👉「自动修复引擎」

输入：

```tsx
<Button onClick={() => doSomething()} />
```

输出：

```tsx
const handleClick = useCallback(() => {
  doSomething();
}, []);

<Button onClick={handleClick} />
```