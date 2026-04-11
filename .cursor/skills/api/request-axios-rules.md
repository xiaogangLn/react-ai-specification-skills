# Axios Request Rules

All HTTP requests must use Axios.

Do not use axios directly inside components.

---

# Directory

apps/{app}/src/services

services
 ├─ http
 │  ├─ createInstance.ts
 │  ├─ interceptors.ts
 │  └─ request.ts
 └─ modules
    ├─ user.ts
    └─ auth.ts

---

# Multiple Instances

Support multiple axios instances.

Examples:

authApi  
adminApi  
uploadApi

---

# Request Flow

Component
↓
Hook
↓
Service
↓
Axios