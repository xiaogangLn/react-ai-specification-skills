# Monorepo Architecture Rules

This project uses a Monorepo architecture.

Tech stack:

React  
TypeScript  
Vite  
pnpm workspace

---

# Root Structure

repo
 ├─ apps
 ├─ packages
 ├─ .skills
 ├─ package.json
 └─ pnpm-workspace.yaml

---

# Applications

Applications must be placed in:

apps/

Example:

apps
 ├─ admin
 └─ web

Each app is an independent React project.

---

# Shared Packages

Shared libraries must be placed in:

packages/

Example:

packages
 ├─ ui
 ├─ hooks
 ├─ utils
 └─ config

---

# Import Rules

Use workspace aliases when importing packages.

Example:

import { Button } from "@repo/ui"