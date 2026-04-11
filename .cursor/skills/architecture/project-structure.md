# Project Structure Rules

Each application follows the same structure.

apps/{app-name}/src

src
 ├─ pages
 ├─ components
 ├─ hooks
 ├─ services
 ├─ types
 ├─ utils
 └─ styles

---

# Pages

pages directory stores route pages.

Example:

pages/dashboard
pages/user

---

# Components

Reusable UI components.

Example:

components/user-table
components/user-form

---

# Hooks

Custom hooks.

Example:

useRequest
usePagination

---

# Services

API request logic.

Example:

services/modules/user.ts

---

# Types

TypeScript definitions.

Example:

types/user.ts
types/table.ts