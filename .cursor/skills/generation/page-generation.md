# Page Generation Rules

Pages follow this structure.

apps/{app}/src/pages/{feature}

Example:

pages/user

---

# Structure

pages/user
 ├─ index.tsx
 ├─ components
 ├─ hooks
 └─ types

---

# Logic Separation

Page → UI

Hooks → business logic

Example:

hooks/views/useUserPage.ts

---

# Typical Page

Search form  
Table  
Pagination  
Create/Edit dialog