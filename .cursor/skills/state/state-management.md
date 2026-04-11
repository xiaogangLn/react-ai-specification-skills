# State Management Skills

本文件定义项目的 **状态管理 AI 生成规则**。
AI 在生成代码时必须遵循本规范，以保证状态管理统一、可维护、可扩展。

本项目统一推荐使用以下两种状态管理方案：

1. **Redux（推荐用于全局状态）**
2. **MobX（推荐用于复杂模块状态）**

AI 不允许随意引入新的状态管理库。

---

# 一、状态分类

项目中的状态分为三类：

## 1. 全局状态（Global State）

用于整个应用共享的数据，例如：

* 当前登录用户
* 登录状态
* 权限信息
* 系统配置
* 主题信息

全局状态 **必须使用 Redux 管理**。

---

## 2. 模块状态（Module State）

用于某个复杂业务模块的状态，例如：

* 表单复杂联动
* 可编辑表格
* 多步骤流程
* 页面复杂 UI 状态

推荐使用：

**MobX**

---

## 3. 局部状态（Local State）

只在组件内部使用的状态，例如：

* 弹窗开关
* loading 状态
* UI 展开收起

使用：

React Hooks

示例：

```tsx
const [open, setOpen] = useState(false)
```

---

# 二、Redux 使用规范

Redux 用于 **全局状态管理**。

AI 必须使用：

**Redux Toolkit**

禁止使用旧版 Redux 写法。

---

## Redux 目录结构

```text
src
 ├─ store
 │  ├─ index.ts
 │  ├─ rootReducer.ts
 │  └─ modules
 │     ├─ userSlice.ts
 │     ├─ authSlice.ts
 │     └─ appSlice.ts
```

说明：

| 文件             | 作用             |
| -------------- | -------------- |
| store/index.ts | 创建 Redux store |
| rootReducer.ts | 合并 reducer     |
| modules        | 各业务模块 slice    |

---

## Redux Slice 示例

AI 生成 Redux 状态时必须使用 `createSlice`。

```ts
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null
  },
  reducers: {
    setUser(state, action) {
      state.userInfo = action.payload;
    }
  }
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
```

---

## React 中使用 Redux

组件中必须使用 Hooks：

```ts
useSelector
useDispatch
```

示例：

```tsx
const user = useSelector((state) => state.user.userInfo);

const dispatch = useDispatch();

dispatch(setUser(data));
```

---

# 三、MobX 使用规范

MobX 用于 **复杂模块状态管理**。

推荐安装：

```text
mobx
mobx-react-lite
```

---

## MobX 目录结构

```text
src
 ├─ stores
 │  ├─ userStore.ts
 │  ├─ formStore.ts
 │  └─ tableStore.ts
```

每个复杂业务模块可以创建独立 Store。

---

## MobX Store 示例

```ts
import { makeAutoObservable } from "mobx";

class UserStore {

  user = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user) {
    this.user = user;
  }

}

export const userStore = new UserStore();
```

---

## React 中使用 MobX

使用 `observer` 包裹组件。

```tsx
import { observer } from "mobx-react-lite";

const UserInfo = observer(() => {

  return <div>{userStore.user?.name}</div>

});
```

---

# 四、状态管理使用优先级

AI 在生成代码时必须遵循以下优先级：

1️⃣ 全局共享状态 → **Redux**

例如：

* 用户信息
* 登录状态
* 权限

---

2️⃣ 复杂业务模块 → **MobX**

例如：

* 表单联动
* 数据编辑
* UI复杂状态

---

3️⃣ 简单组件状态 → **React Hooks**

例如：

```tsx
const [loading, setLoading] = useState(false)
```

---

# 五、禁止行为

AI 生成代码时禁止以下行为：

❌ 在组件中直接维护全局状态
❌ 使用多个组件分别维护同一份数据
❌ 创建全局变量管理状态
❌ 引入新的状态管理库

---

# 六、推荐数据流

AI 在生成代码时应遵循以下数据流：

```text
Component
   ↓
Hook / Store
   ↓
Redux / MobX
   ↓
API Service
```

---

# 七、目标

通过统一状态管理规则，实现：

* 状态逻辑清晰
* 数据流稳定
* 组件职责单一
* 代码易维护

最终目标：

**AI 生成的代码必须符合项目统一的状态管理架构。**
