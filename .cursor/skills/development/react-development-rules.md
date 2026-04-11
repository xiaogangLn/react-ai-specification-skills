# React Development Rules

Only use React functional components.

Do not use class components.

---

# Component Example

function UserList() {}

or

const UserList = () => {}

---

# Hooks Rules

Business logic must be extracted into hooks.

Avoid large logic blocks inside components.

Example:

useUserList
useUserFilter

---

# useEffect Rules

Avoid unnecessary useEffect usage.

Before using useEffect consider:

props  
derived state  
custom hooks

---

# Hooks Directory

apps/{app-name}/src/hooks

Example:

useRequest
usePagination

View hooks:

hooks/views/useUserPage.ts