---
name: tailwind-rules
description: Tailwind CSS 样式使用规范（自动生成）
---

# Tailwind CSS 样式使用规范（自动生成）

> 本文件由 Tailwind 规则自动生成器生成
> 修改配置文件后，规则会自动更新

---

# 6. 通用规则

## 6.1 必须使用语义化 Token

```tsx
// ✅ 正确 - 使用主题变量对应的 Tailwind 类
className="bg-primary text-heading rounded-md"
className="bg-surface-secondary hover:bg-surface-secondary-hover"
className="text-success bg-success/10"

// ❌ 错误 - 硬编码颜色值
className="bg-[#3377FF] p-[13px]"
```

## 6.2 必须使用 cn 工具

```tsx
import { cn } from '@/lib/utils';

className={cn("base-class", className)}
```

## 6.3 颜色使用规范

### 6.3.1 品牌色（Primary）

| Tailwind 类 | 对应变量 | 用途 |
|------------|---------|------|
| `bg-primary` | `--color-primary` (#3377FF) | 主要按钮、链接 |
| `hover:bg-primary-hover` | `--color-primary-hover` (#5993FF) | 悬浮态 |
| `active:bg-primary-active` | `--color-primary-active` (#215BD9) | 按下态 |
| `bg-primary-light` | `--color-primary-light` (#F2F8FF) | 浅色背景 |
| `text-primary-foreground` | `--color-primary-foreground` (#FFFFFF) | 品牌色上的文字 |

### 6.3.2 状态色（Status）

| Tailwind 类 | 对应变量 | 色值 | 用途 |
|------------|---------|------|------|
| `text-status-processing` / `bg-status-processing` | `--status-processing` | #3377FF | 处理中 |
| `text-status-success` / `bg-status-success` | `--status-success` | #1BB23E | 成功 |
| `text-status-warning` / `bg-status-warning` | `--status-warning` | #FF7733 | 警告 |
| `text-status-error` / `bg-status-error` | `--status-error` | #FF5040 | 错误 |
| `text-status-error-hover` | `--status-error-hover` | #FF7066 | 错误悬浮 |
| `text-status-error-active` | `--status-error-active` | #D93936 | 错误按下 |

### 6.3.3 品牌色（Brand）

| Tailwind 类 | 对应变量 | 色值 | 用途 |
|------------|---------|------|------|
| `bg-brand-base` | `--brand-base` | #3377FF | 品牌基础色 |
| `hover:bg-brand-hover` | `--brand-hover` | #5993FF | 品牌悬浮态 |
| `active:bg-brand-active` | `--brand-active` | #215BD9 | 品牌按下态 |
| `bg-brand-disabled` | `--brand-disabled` | #80AEFF | 品牌禁用态 |
| `bg-brand-light-bg` | `--brand-light-bg` | #F2F8FF | 品牌浅色背景 |

### 6.3.4 文本色（Text）

| Tailwind 类 | 对应变量 | 用途 |
|------------|---------|------|
| `text-heading` | `--color-text-heading` (#11141A) | 标题 |
| `text-body` | `--color-text-body` (#11141A) | 正文 |
| `text-secondary` | `--color-text-secondary` (#5C6473) | 次要文本 |
| `text-help` | `--color-text-help` (#878D99) | 帮助文本 |
| `text-disabled` | `--color-text-disabled` (#C7CDD9) | 禁用文本 |

### 6.3.5 背景色（Background）

| Tailwind 类 | 对应变量 | 色值 | 用途 |
|------------|---------|------|------|
| `bg-primary` | `--bg-primary` | #FFFFFF | 主背景 |
| `bg-secondary` | `--bg-secondary` | #F2F4F7 | 次背景 |
| `hover:bg-secondary-hover` | `--bg-secondary-hover` | #EDF0F5 | 次背景悬浮态 |
| `active:bg-secondary-active` | `--bg-secondary-active` | #E8E9EB | 次背景按下态 |
| `bg-tertiary` | `--bg-tertiary` | #F4F5F7 | 三级背景 |
| `bg-quaternary` | `--bg-quaternary` | #F7F8FA | 四级背景 |
| `bg-quinary` | `--bg-quinary` | #EDF0F5 | 五级背景 |
| `hover:bg-ghost-hover` | `--bg-ghost-hover` | #F7F8FA | Ghost 悬浮态 |
| `active:bg-ghost-active` | `--bg-ghost-active` | #EDF0F5 | Ghost 按下态 |

### 6.3.6 标签色（Tag）

```tsx
// 危险标签
className="bg-tag-danger-bg text-tag-danger-text"
// 警告标签
className="bg-tag-warning-bg text-tag-warning-text"
// 成功标签
className="bg-tag-success-bg text-tag-success-text"
// 信息标签
className="bg-tag-info-bg text-tag-info-text"
// 中性标签
className="bg-tag-neutral-bg text-tag-neutral-text"
```

### 6.3.7 边框与分割线

| Tailwind 类 | 对应变量 | 色值 | 用途 |
|------------|---------|------|------|
| `border-border` / `border-border-color` | `--color-border` | #DCDFE5 | 边框 |
| `border-divider` / `border-divider-color` | `--color-divider` | #F4F5F7 | 分割线 |

```tsx
// 输入框边框
className="border border-border"

// 分割线
className="border-b border-divider"
```

### 6.3.8 图标色（Icon）

| Tailwind 类 | 对应变量 | 色值 | 用途 |
|------------|---------|------|------|
| `text-icon-main` | `--icon-main` | #878D99 | 主图标 |
| `text-icon-disabled` | `--icon-disabled` | #EFF0F1 | 禁用图标 |

```tsx
// 主图标
className="text-icon-main"

// 禁用图标
className="text-icon-disabled"
```

### 6.3.9 警告框背景色（Alert）

| Tailwind 类 | 对应变量 | 色值 | 用途 |
|------------|---------|------|------|
| `bg-alert-info` | `--alert-info-bg` | #EBF3FF | 信息提示框 |
| `bg-alert-success` | `--alert-success-bg` | #DCF5E4 | 成功提示框 |
| `bg-alert-warning` | `--alert-warning-bg` | #FFF5EB | 警告提示框 |
| `bg-alert-error` | `--alert-error-bg` | #FFF1F0 | 错误提示框 |

```tsx
// 信息提示框
className="bg-alert-info text-heading"

// 成功提示框
className="bg-alert-success text-heading"

// 警告提示框
className="bg-alert-warning text-heading"

// 错误提示框
className="bg-alert-error text-heading"
```

### 6.3.10 遮罩层（Overlay）

| Tailwind 类 | 对应变量 | 色值 | 用途 |
|------------|---------|------|------|
| `bg-overlay` | `--overlay-bg` | rgba(17, 20, 26, 0.5) | 模态框遮罩层 |

```tsx
// 遮罩层
className="fixed inset-0 bg-overlay z-50"
```

## 6.4 圆角使用规范

### 6.4.1 语义化圆角（Corner - Semantic Radius）

| Tailwind 类 | 对应变量 | 值 | 用途 |
|------------|---------|-----|------|
| `corner-none` | `--corner-none` | 0px | 无圆角 |
| `corner-sm` | `--corner-sm` | 4px | 小圆角 |
| `corner-md` | `--corner-md` | 8px | 中等圆角（默认） |
| `corner-lg` | `--corner-lg` | 12px | 大圆角 |
| `corner-xl` | `--corner-xl` | 20px | 超大圆角 |
| `corner-pill` | `--corner-pill` | 9999px | 胶囊形 |

### 6.4.2 基础圆角（Radius）

| Tailwind 类 | 值 | 用途 |
|------------|-----|------|
| `rounded-none` | 0px | 无圆角 |
| `rounded-xs` | 2px | 极小圆角 |
| `rounded-sm` | 4px | 小圆角 |
| `rounded-md` | 8px | 中等圆角（默认） |
| `rounded-lg` | 12px | 大圆角 |
| `rounded-xl` | 20px | 超大圆角 |
| `rounded-full` | 9999px | 胶囊形 |

## 6.5 间距使用规范

### 6.5.1 基础间距

| Tailwind 类 | 值 | 用途 |
|------------|-----|------|
| `p-2xs` / `m-2xs` | 4px | 极小间距 |
| `p-xs` / `m-xs` | 8px | 小间距 |
| `p-sm` / `m-sm` | 12px | 中小间距 |
| `p-md` / `m-md` | 16px | 标准间距（默认） |
| `p-lg` / `m-lg` | 20px | 大间距 |
| `p-xl` / `m-xl` | 24px | 超大间距 |
| `p-2xl` / `m-2xl` | 32px | 区块级间距 |

### 6.5.2 语义化间距

| Tailwind 类 | 对应变量 | 值 | 用途 |
|------------|---------|-----|------|
| `p-intimate` / `m-intimate` | `--space-intimate` | 4px | 亲密元素间距 |
| `p-tight` / `m-tight` | `--space-tight` | 8px | 紧凑元素间距 |
| `p-content` / `m-content` | `--space-content` | 12px | 内容间距 |
| `p-group` / `m-group` | `--space-group` | 16px | 组间距 |
| `p-section` / `m-section` | `--space-section` | 20px | 区块间距 |
| `p-region` / `m-region` | `--space-region` | 24px | 区域间距 |
| `p-page` / `m-page` | `--space-page` | 32px | 页面级间距 |

## 6.6 字体排版规范

### 6.6.1 字体字号（Font Sizes - Primitives）

| Tailwind 类 | 值 | 用途 |
|------------|-----|------|
| `text-2xs` | 12px | 极小文字 |
| `text-xs` | 13px | 小号文字 |
| `text-sm` | 14px | 标准正文 |
| `text-md` | 15px | 大号正文 |
| `text-lg` | 16px | |
| `text-xl` | 18px | |
| `text-2xl` | 20px | 小标题 |
| `text-3xl` | 22px | |
| `text-4xl` | 24px | |
| `text-5xl` | 28px | |
| `text-6xl` | 36px | 展示文字 |

### 6.6.2 行高（Font Heights / Line Heights）

| Tailwind 类 | 值 | 对应字号 |
|------------|-----|---------|
| `leading-2xs` | 18px | 12px |
| `leading-xs` | 20px | 13px |
| `leading-sm` | 21px | 14px |
| `leading-md` | 22px | 15px |
| `leading-lg` | 24px | 16px |
| `leading-xl` | 27px | 18px |
| `leading-2xl` | 30px | 20px |
| `leading-3xl` | 33px | 22px |
| `leading-4xl` | 36px | 24px |
| `leading-5xl` | 42px | 28px |
| `leading-6xl` | 54px | 36px |

### 6.6.3 字重（Font Weights）

| Tailwind 类 | 值 | 用途 |
|------------|-----|------|
| `font-regular` | 400 | 常规 |
| `font-medium` | 500 | 中等 |
| `font-semibold` | 600 | 半粗（标题） |

### 6.6.4 字体排版组合类（Typography Roles - 推荐）

这些类已包含字号、行高、字重的组合，优先使用：

| Tailwind 类 | 字号 | 行高 | 字重 | 用途 |
|------------|------|------|------|------|
| `font-display` | 36px | 54px | 600 | 展示文字 |
| `font-heading` | 20px | 30px | 600 | 标题 |
| `font-title1` | 28px | 42px | 600 | 大标题 |
| `font-title2` | 24px | 36px | 600 | 标题2 |
| `font-title3` | 22px | 33px | 600 | 标题3 |
| `font-title4` | 20px | 30px | 600 | 标题4 |
| `font-title5` | 18px | 27px | 600 | 标题5 |
| `font-title6` | 16px | 24px | 600 | 标题6 |
| `font-title7` | 15px | 22px | 600 | 标题7 |
| `font-body-lg` | 16px | 24px | 400 | 大正文 |
| `font-body-md` | 14px | 21px | 400 | 标准正文 |
| `font-label` | 13px | 20px | 400 | 标签文字 |
| `font-caption` | 12px | 18px | 400 | 说明文字 |
| `font-overline` | 12px | 18px | 500 | 上方标签 |

## 6.7 组件高度规范（Semantic Component Heights）

| Tailwind 类 | 值 | 用途 |
|------------|-----|------|
| `h-comp-3xs` | 1px | 分割线 |
| `h-comp-2xs` | 16px | 小标签 |
| `h-comp-xs` | 18px | 大标签 |
| `h-comp-sm` | 20px | 单选框/复选框 |
| `h-comp-md` | 24px | |
| `h-comp-lg` | 32px | 常规按钮/输入框 |
| `h-comp-xl` | 36px | 表格行高 |
| `h-comp-2xl` | 50px | 双行表格 |

```tsx
// 常规按钮
className="h-comp-lg"

// 输入框
className="h-comp-lg"

// 表格行
className="h-comp-xl"
```

## 6.8 阴影规范

| Tailwind 类 | 值 | 用途 |
|------------|-----|------|
| `shadow-sm` | 0px 2px 12px 0px #11141A14 | 小阴影 |
| `shadow-md` | 0 2px 20px 0 rgba(17, 20, 26, 0.16) | 中阴影 |
| `shadow-message` | 0px 0px 9.23px 0px rgba(196, 205, 223, 0.4) | 全局提示专用阴影 |

```tsx
// 卡片阴影
className="shadow-sm"

// 下拉菜单阴影
className="shadow-md"

// 全局提示阴影
className="shadow-message"
```

## 6.9 禁止行为

- ❌ 使用硬编码颜色值
- ❌ 使用硬编码间距
- ❌ 使用内联 style
- ❌ 使用 CSS Modules
- ❌ 使用 styled-components
- ❌ 使用 !important
- ❌ 绕过 cn 工具直接拼接 className

# 7. AI 行为约束（关键）

AI 生成样式必须：

- 自动使用 `cn` 合并 className
- 自动添加交互状态样式
- 自动避免硬编码值

## 7.1 按钮组件样式规则

```tsx
// Primary 按钮
className="cn(
  'h-comp-lg px-spacing-md rounded-md bg-primary text-primary-foreground',
  'hover:bg-primary-hover active:bg-primary-active',
  'disabled:bg-brand-disabled disabled:text-gray-2',
  className
)"

// Secondary 按钮
className="cn(
  'h-comp-lg px-spacing-md rounded-md bg-surface-secondary text-heading',
  'hover:bg-surface-secondary-hover active:bg-surface-secondary-active',
  'disabled:bg-gray-1 disabled:text-gray-2',
  className
)"

// Ghost 按钮
className="cn(
  'h-comp-lg px-spacing-md rounded-md bg-transparent text-heading',
  'hover:bg-surface-ghost-hover active:bg-surface-ghost-active',
  'disabled:text-gray-2',
  className
)"
```

## 7.2 输入框组件样式规则

```tsx
// 常规输入框
className="cn(
  'h-comp-lg px-spacing-md rounded-md',
  'bg-background border border-divider text-body placeholder:text-disabled',
  'focus:outline-none focus:border-primary',
  'disabled:bg-surface-secondary disabled:text-disabled',
  className
)"
```

## 7.3 标签（Tag）组件样式规则

```tsx
// 状态标签
const variants = {
  danger: "bg-tag-danger-bg text-tag-danger-text",
  warning: "bg-tag-warning-bg text-tag-warning-text",
  success: "bg-tag-success-bg text-tag-success-text",
  info: "bg-tag-info-bg text-tag-info-text",
  neutral: "bg-tag-neutral-bg text-tag-neutral-text",
}

className="cn('px-spacing-sm py-2xs rounded-xs', variants[variant])"
```

## 7.4 文本样式规则

```tsx
// 标题
className="font-title1 text-heading"

// 正文
className="font-body-md text-body"

// 次要文本
className="font-body-md text-secondary"

// 帮助文本
className="font-label text-help"
```

# 8. 自检清单（必须）

代码生成完成前必须检查：

## 8.1 基础规范
- [ ] 是否使用 `cn` 合并 className
- [ ] 是否有硬编码颜色值（如 `#3377FF`）
- [ ] 是否有硬编码间距值（如 `p-4` 替代为语义化类）
- [ ] 是否有内联 `style` 属性

## 8.2 主题变量使用
- [ ] 颜色是否使用语义化类（`primary`, `success`, `warning`, `error`）
- [ ] 文本颜色是否使用正确的类（`text-heading`, `text-body`, `text-secondary`）
- [ ] 背景色是否使用正确的类（`bg-surface-*`）
- [ ] 间距是否使用语义化类（`spacing-intimate`, `spacing-tight` 等）
- [ ] 边框是否使用 `border-border`
- [ ] 分割线是否使用 `border-divider`

## 8.3 交互状态
- [ ] 按钮是否有 `hover:` 状态
- [ ] 按钮是否有 `active:` 状态
- [ ] 输入框是否有 `focus:` 状态
- [ ] 禁用状态是否正确处理

## 8.4 组件规范
- [ ] 按钮高度是否使用 `h-comp-lg`
- [ ] 输入框高度是否使用 `h-comp-lg`
- [ ] 圆角是否使用 `rounded-md`（默认）
- [ ] 字体是否使用正确的排版类（`font-title*`, `font-body-md` 等）或基础字号类（`text-sm` 等）
- [ ] 行高是否使用正确的类（`leading-sm` 等）
- [ ] 字重是否使用正确的类（`font-regular`, `font-medium`, `font-semibold`）
- [ ] 阴影是否使用 `shadow-sm` 或 `shadow-md`

---

## 附录：完整示例

```tsx
import { cn } from '@/lib/utils';

// Primary 按钮组件
export const Button = ({ children, className, variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active',
    secondary: 'bg-surface-secondary text-heading hover:bg-surface-secondary-hover active:bg-surface-secondary-active',
    ghost: 'bg-transparent text-heading hover:bg-surface-ghost-hover active:bg-surface-ghost-active',
  };

  return (
    <button
      className={cn(
        'h-comp-lg px-spacing-md rounded-md font-body-md',
        'disabled:bg-brand-disabled disabled:text-gray-2',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// Input 组件
export const Input = ({ className, ...props }) => (
  <input
    className={cn(
      'h-comp-lg px-spacing-md rounded-md',
      'bg-background border border-divider text-body placeholder:text-disabled',
      'focus:outline-none focus:border-primary',
      'disabled:bg-surface-secondary disabled:text-disabled',
      className
    )}
    {...props}
  />
);

// Tag 组件
export const Tag = ({ children, variant = 'info', className }) => {
  const variants = {
    danger: 'bg-tag-danger-bg text-tag-danger-text',
    warning: 'bg-tag-warning-bg text-tag-warning-text',
    success: 'bg-tag-success-bg text-tag-success-text',
    info: 'bg-tag-info-bg text-tag-info-text',
    neutral: 'bg-tag-neutral-bg text-tag-neutral-text',
  };

  return (
    <span className={cn('px-spacing-sm py-2xs rounded-xs font-caption', variants[variant], className)}>
      {children}
    </span>
  );
};
```
