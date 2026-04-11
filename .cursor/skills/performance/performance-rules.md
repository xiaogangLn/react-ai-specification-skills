# Performance Rules

AI must optimize performance.

---

# React.memo

Use for heavy components.

Example:

export default React.memo(UserTable)

---

# useMemo

For expensive calculations.

---

# useCallback

For event handlers passed to children.

---

# Lazy Loading

Pages should be lazy loaded.

Example:

const UserPage = lazy(() => import("./pages/user"))