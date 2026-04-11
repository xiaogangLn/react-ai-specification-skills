---
name: business-logic-rules
description: 业务代码逻辑编写规范（强制）
---

# 业务代码逻辑编写规范（强制）

适用于：

- React (Vite)
- TypeScript
- 业务组件开发
- 状态管理
- API 数据处理

目标：

- 避免重复造轮子
- 保持代码逻辑一致性
- 提高代码复用率
- 减少技术债务积累
- 确保 API 数据结构正确性

---

# 1. 编写前的必要检查（强制）

## 1.1 必须读取的公共代码目录

在编写任何业务代码之前，必须先检查以下目录中的已有实现：

```
项目根目录/
├── src/
│   ├── utils/           # 公共工具函数（优先检查）
│   ├── types/           # TypeScript 类型定义
│   ├── constants/       # 常量定义
│   ├── hooks/           # 自定义 Hooks
│   ├── services/        # API 服务层
│   └── stores/          # 状态管理（如果有）
```

## 1.2 检查步骤

1. 使用 `Grep` 搜索现有相关函数名
2. 使用 `Glob` 查找相关类型定义
3. 阅读现有函数的实现逻辑
4. 确认是否可以直接复用

---

# 2. 函数复用规范（强制）

## 2.1 禁止重复创建相同功能函数

```ts
// ❌ 错误：已有相同功能的函数却重新创建
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// ✅ 正确：使用 utils 中已有的函数
import { formatDate } from '@/utils/date';

const formattedDate = formatDate(new Date());
```

## 2.2 类型定义复用

```ts
// ❌ 错误：重复定义已有类型
type User = {
  id: string;
  name: string;
  email: string;
};

// ✅ 正确：使用 types 中已有的类型
import type { User } from '@/types/user';

const user: User = { /* ... */ };
```

## 2.3 工具函数使用前缀搜索

在实现新功能前，先搜索以下常见前缀：

- `format*` - 格式化相关
- `parse*` - 解析相关
- `validate*` - 验证相关
- `transform*` - 转换相关
- `calculate*` - 计算相关
- `filter*` - 过滤相关
- `sort*` - 排序相关

---

# 3. 状态变量管理规范（强制）

## 3.1 状态变量必须持续化使用

```tsx
// ❌ 错误：创建临时变量存储需要持久化的状态
const UserProfile = () => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');

  // ... 这些状态可能与其他组件共享
};

// ✅ 正确：使用全局状态管理或统一的上下文
import { useUserStore } from '@/stores/user';
// 或
import { UserContext } from '@/contexts/UserContext';

const UserProfile = () => {
  const { user, updateUser } = useUserStore();

  return <div>{user.name}</div>;
};
```

## 3.2 禁止随意定义临时变量

```tsx
// ❌ 错误：用临时变量替代状态
const SearchResults = () => {
  let searchResults: ResultItem[] = [];

  const handleSearch = (query: string) => {
    searchResults = results.filter(r => r.title.includes(query));
    // searchResults 会在渲染时丢失
  };

  return <div>{searchResults.map(...)}</div>;
};

// ✅ 正确：使用 useState 存储状态
const SearchResults = () => {
  const [searchResults, setSearchResults] = useState<ResultItem[]>([]);

  const handleSearch = (query: string) => {
    const filtered = results.filter(r => r.title.includes(query));
    setSearchResults(filtered);
  };

  return <div>{searchResults.map(...)}</div>;
};
```

## 3.3 优先复用现有 Hook

```tsx
// ❌ 错误：重复创建相同功能的 Hook
function useUserData(userId: string) {
  const [data, setData] = useState<User | null>(null);
  // ... 实现

  return { data, loading };
}

// ✅ 正确：使用 hooks 中已有的 Hook
import { useUserData } from '@/hooks/user';

const { data, loading } = useUserData(userId);
```

---

# 4. 代码复用决策流程（强制）

## 4.1 复用判断标准

需要实现一个新功能时，按以下顺序判断：

1. **第一步**：检查 `utils/` 中是否有现成函数
   - 有：直接使用
   - 没有：进入第二步

2. **第二步**：检查 `hooks/` 中是否有现成 Hook
   - 有：直接使用
   - 没有：进入第三步

3. **第三步**：检查 `services/` 中是否有现成 API 调用
   - 有：直接使用
   - 没有：进入第四步

4. **第四步**：确认是否需要创建新的公共代码
   - 如果该功能会在多处使用 → 创建到相应目录
   - 如果该功能只在当前组件使用 → 保持组件内

## 4.2 复用前的验证

在复用现有代码前，必须确认：

```ts
// 1. 检查函数签名是否满足需求
const existingFunction = (param1: Type1, param2: Type2): ReturnType => {
  // ...
};

// 2. 检查函数行为是否符合预期
// 可以通过函数名、注释、测试用例等确认

// 3. 如果参数不完全匹配，考虑是否可以调整调用方式
// 而不是直接创建新函数
```

---

# 5. 逻辑重构规范（强制）

## 5.1 检测逻辑混乱的信号

当出现以下情况时，需要提示是否需要重构：

- 函数职责不单一（一个函数做太多事）
- 相似逻辑在多处重复
- 嵌套层级过深（超过 3 层）
- 变量命名不清晰（如 `temp`、`data1`、`flag`）
- 状态管理分散，难以追踪数据流
- API 返回数据被多次转换，原始结构丢失

## 5.2 重构提示模板

当发现逻辑混乱时，使用以下模板提示用户：

```
⚠️ 检测到现有逻辑可能存在以下问题：
1. [问题描述1]
2. [问题描述2]

是否需要重构这部分逻辑？

重构方案：
- [方案1：提取公共函数]
- [方案2：优化状态管理]
- [方案3：简化数据流]

注意：API 接口返回的数据结构作为重构的唯一标准，不可随意修改。
```

## 5.3 重构原则

重构时必须遵循以下原则：

1. **API 数据结构不可变**
   ```ts
   // API 返回的数据结构必须保持不变
   interface APIResponse {
     data: {
       userId: string;
       userName: string;
     };
   }

   // 可以转换数据，但要保持原始结构的可追溯性
   const normalizedData = {
     id: apiResponse.data.userId,
     name: apiResponse.data.userName,
   };
   ```

2. **保持数据流向清晰**
   - 数据从 API 到 UI 的流向应该是单向的
   - 每个转换步骤都应该有明确的输入和输出

3. **重构后保持功能一致**
   - 不能改变用户可见的行为
   - 不能改变业务逻辑的执行结果

---

# 6. 常见场景规范（强制）

## 6.1 数据获取场景

```tsx
// ❌ 错误：在组件内重复编写 API 调用逻辑
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return <div>{/* ... */}</div>;
};

// ✅ 正确：使用 services 和 hooks
import { useUsers } from '@/hooks/user';

const UserList = () => {
  const { users, loading, error } = useUsers();

  return <div>{/* ... */}</div>;
};
```

## 6.2 表单处理场景

```tsx
// ❌ 错误：重复编写表单验证逻辑
const RegisterForm = () => {
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  // ...
};

// ✅ 正确：使用 utils 中的验证函数
import { validateEmail, validatePassword } from '@/utils/validate';

const RegisterForm = () => {
  // 直接使用验证函数
};
```

## 6.3 数据转换场景

```tsx
// ❌ 错误：在多处编写相同的数据转换逻辑
// 组件 A
const displayData = apiData.map(item => ({
  id: item.user_id,
  name: item.user_name,
}));

// 组件 B
const displayData = apiData.map(item => ({
  id: item.user_id,
  name: item.user_name,
}));

// ✅ 正确：使用 utils 中的转换函数
import { transformUserList } from '@/utils/transform';

const displayData = transformUserList(apiData);
```

---

# 7. AI 行为约束（关键）

AI 在编写业务代码时必须：

1. **优先检查现有代码**
   - 使用 `Grep` 搜索相关函数
   - 使用 `Glob` 查找相关类型
   - 使用 `Read` 阅读现有实现

2. **优先复用而非创建**
   - 发现可用函数直接使用
   - 发现可用类型直接引用
   - 发现可用 Hook 直接调用

3. **状态管理规范化**
   - 识别需要持久化的状态
   - 检查是否已有相关 store/context
   - 避免随意定义临时变量

4. **逻辑重构识别**
   - 识别混乱的逻辑模式
   - 提供重构建议
   - 保持 API 数据结构不变

5. **代码复用追踪**
   - 记录使用的公共函数和类型
   - 在代码注释中注明来源

---

# 8. 编码检查清单（必须）

在完成任何业务代码编写后，必须自检：

- [ ] 是否已检查 `utils/` 目录中的相关函数
- [ ] 是否已检查 `types/` 目录中的相关类型
- [ ] 是否已检查 `hooks/` 目录中的相关 Hook
- [ ] 是否复用了现有的公共代码而非重复创建
- [ ] 状态变量是否正确管理（非随意定义）
- [ ] 临时变量是否必要（是否有更好的状态管理方式）
- [ ] API 数据结构是否保持一致
- [ ] 是否有逻辑混乱的迹象需要提示重构
- [ ] 是否在注释中注明复用的公共代码来源

---

# 9. 常见错误示例

## 9.1 重复造轮子

```ts
// ❌ 错误
function debounce(fn: Function, delay: number) {
  let timer: any;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ✅ 正确
import { debounce } from '@/utils/performance';
```

## 9.2 类型重复定义

```ts
// ❌ 错误
interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

// ✅ 正确
import type { ApiResponse } from '@/types/api';
```

## 9.3 状态管理不当

```tsx
// ❌ 错误
const Counter = () => {
  let count = 0;

  const increment = () => {
    count++;
    console.log(count); // 不会触发重新渲染
  };

  return <button onClick={increment}>{count}</button>;
};

// ✅ 正确
const Counter = () => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(prev => prev + 1);
  };

  return <button onClick={increment}>{count}</button>;
};
```

---

# 10. 最佳实践示例

## 10.1 正确的代码组织结构

```ts
// ✅ 复用现有公共代码
import type { User } from '@/types/user';
import { formatDate, formatCurrency } from '@/utils/format';
import { useUserList } from '@/hooks/user';
import { cn } from '@/lib/utils';

const UserTable = () => {
  const { users, loading } = useUserList();

  if (loading) return <div>Loading...</div>;

  return (
    <div className={cn('w-full', 'border')}>
      {users.map(user => (
        <div key={user.id}>
          <span>{user.name}</span>
          <span>{formatDate(user.createdAt)}</span>
          <span>{formatCurrency(user.balance)}</span>
        </div>
      ))}
    </div>
  );
};
```

## 10.2 正确的状态管理

```ts
// ✅ 使用全局状态管理
import { useCartStore } from '@/stores/cart';

const CartButton = ({ productId }: { productId: string }) => {
  const addToCart = useCartStore(state => state.addToCart);
  const isInCart = useCartStore(state =>
    state.items.some(item => item.id === productId)
  );

  return (
    <button
      onClick={() => addToCart(productId)}
      disabled={isInCart}
    >
      {isInCart ? '已在购物车' : '加入购物车'}
    </button>
  );
};
```
