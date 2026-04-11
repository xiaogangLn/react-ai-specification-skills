# Tailwind CSS Rules

TailwindCSS is the only styling solution.

---

# Allowed

Tailwind utility classes  
shadcn components

Example:

className="flex items-center gap-2 px-4 py-2"

---

# Forbidden

CSS Modules  
Styled Components  
Inline style  
SCSS

---

# Layout

Use flex or grid.

Example:

flex items-center justify-between

grid grid-cols-3 gap-4

---

# Spacing

Use Tailwind spacing scale.

Example:

p-4  
gap-2

Avoid:

p-[13px]

---

# Typography

Use Tailwind typography utilities.

Example:

text-sm  
font-medium

---

# Responsive

Use responsive prefixes.

Example:

md:grid-cols-2
lg:grid-cols-4