#!/usr/bin/env node

/**
 * Monorepo 初始化脚本
 *
 * 功能：
 * 1. 生成标准的 Monorepo 目录结构
 * 2. 创建 pnpm workspace 配置
 * 3. 生成各个包的 package.json
 * 4. 初始化 shadcn/ui 配置
 * 5. 创建基础项目文件
 */

const fs = require('fs');
const path = require('path');

// ==================== 配置 ====================

const CONFIG = {
  // 项目名称
  projectName: 'react-monorepo',

  // 包管理器
  packageManager: 'pnpm',

  // 工作空间包别名
  workspaceAlias: '@repo',

  // shadcn/ui 版本
  shadcnVersion: 'latest',

  // 默认应用列表
  defaultApps: ['web', 'admin'],

  // 默认包列表
  defaultPackages: ['ui', 'utils', 'config', 'types'],

  // 基础依赖版本
  dependencies: {
    react: '^18.3.1',
    'react-dom': '^18.3.1',
  },

  devDependencies: {
    vite: '^5.0.0',
    typescript: '^5.3.0',
    '@types/react': '^18.2.0',
    '@types/react-dom': '^18.2.0',
    tailwindcss: '^3.4.0',
    autoprefixer: '^10.4.0',
    postcss: '^8.4.0',
  },
};

// ==================== 文件工具 ====================

/**
 * 检查目录是否存在
 */
function dirExists(dirPath) {
  try {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  } catch {
    return false;
  }
}

/**
 * 确保目录存在，不存在则创建
 */
function ensureDir(dirPath) {
  if (!dirExists(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * 写入文件
 */
function writeFile(filePath, content) {
  try {
    const dir = path.dirname(filePath);
    if (!dirExists(dir)) {
      ensureDir(dir);
    }
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  } catch (error) {
    console.error(`❌ 写入文件失败: ${filePath}`, error.message);
    return false;
  }
}

// ==================== 生成器 ====================

/**
 * 生成 pnpm-workspace.yaml
 */
function generateWorkspaceYaml() {
  const content = `packages:
  - 'apps/*'
  - 'packages/*'
`;

  writeFile('pnpm-workspace.yaml', content);
  console.log('✓ 生成 pnpm-workspace.yaml');
}

/**
 * 生成根 package.json
 */
function generateRootPackageJson() {
  const packageJson = {
    name: CONFIG.projectName,
    version: '0.1.0',
    private: true,
    description: 'React Monorepo 项目',
    scripts: {
      dev: 'pnpm --filter "@repo/web" dev',
      'dev:all': 'pnpm --parallel --filter "@repo/*" dev',
      build: 'pnpm --filter "@repo/*" build',
      'build:ui': 'pnpm --filter "@repo/ui" build',
      preview: 'pnpm --filter "@repo/web" preview',
      lint: 'pnpm --filter "@repo/*" lint',
      clean: 'pnpm --filter "@repo/*" clean && rm -rf node_modules',
      format: 'prettier --write "**/*.{ts,tsx,js,jsx,json,md}"',
    },
    devDependencies: {
      prettier: '^3.0.0',
      ...CONFIG.devDependencies,
    },
    engines: {
      node: '>=18.0.0',
      pnpm: '>=8.0.0',
    },
  };

  writeFile('package.json', JSON.stringify(packageJson, null, 2));
  console.log('✓ 生成根 package.json');
}

/**
 * 生成应用的 package.json
 */
function generateAppPackageJson(appName) {
  const packageJson = {
    name: `@repo/${appName}`,
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'tsc && vite build',
      preview: 'vite preview',
      lint: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
      clean: 'rm -rf dist',
    },
    dependencies: {
      ...CONFIG.dependencies,
      '@repo/ui': 'workspace:*',
      '@repo/utils': 'workspace:*',
      '@repo/types': 'workspace:*',
      '@repo/config': 'workspace:*',
    },
    devDependencies: {
      ...CONFIG.devDependencies,
      '@vitejs/plugin-react': '^4.2.0',
      eslint: '^8.55.0',
      'eslint-plugin-react-hooks': '^4.6.0',
      'eslint-plugin-react-refresh': '^0.4.0',
    },
  };

  const filePath = `apps/${appName}/package.json`;
  writeFile(filePath, JSON.stringify(packageJson, null, 2));
  console.log(`✓ 生成 ${filePath}`);
}

/**
 * 生成包的 package.json
 */
function generatePackagePackageJson(packageName) {
  const packageJson = {
    name: `@repo/${packageName}`,
    version: '0.1.0',
    private: true,
    type: 'module',
    main: './src/index.ts',
    types: './src/index.ts',
    scripts: {
      lint: 'eslint . --ext ts,tsx --max-warnings 0',
      clean: 'rm -rf dist',
    },
    dependencies: {},
    devDependencies: {
      typescript: CONFIG.devDependencies.typescript,
    },
  };

  // ui 包需要特殊处理
  if (packageName === 'ui') {
    packageJson.dependencies = {
      '@radix-ui/react-slot': '^1.0.2',
      'class-variance-authority': '^0.7.0',
      'clsx': '^2.0.0',
      'lucide-react': '^0.300.0',
      'tailwind-merge': '^2.2.0',
      tailwindcss: CONFIG.devDependencies.tailwindcss,
    };
    packageJson.devDependencies = {
      typescript: CONFIG.devDependencies.typescript,
    };
  }

  // utils 包需要特殊处理
  if (packageName === 'utils') {
    packageJson.dependencies = {
      'clsx': '^2.0.0',
      'tailwind-merge': '^2.2.0',
    };
  }

  const filePath = `packages/${packageName}/package.json`;
  writeFile(filePath, JSON.stringify(packageJson, null, 2));
  console.log(`✓ 生成 ${filePath}`);
}

/**
 * 生成应用基础文件结构
 */
function generateAppStructure(appName) {
  // Vite 配置
  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@repo/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@repo/utils': path.resolve(__dirname, '../../packages/utils/src'),
      '@repo/types': path.resolve(__dirname, '../../packages/types/src'),
      '@repo/config': path.resolve(__dirname, '../../packages/config/src'),
    },
  },
  server: {
    port: ${appName === 'web' ? 3000 : 3001},
  },
});
`;

  writeFile(`apps/${appName}/vite.config.ts`, viteConfig);

  // TypeScript 配置
  const tsConfig = `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@repo/ui": ["../../packages/ui/src"],
      "@repo/utils": ["../../packages/utils/src"],
      "@repo/types": ["../../packages/types/src"],
      "@repo/config": ["../../packages/config/src"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
`;

  writeFile(`apps/${appName}/tsconfig.json`, tsConfig);
  writeFile(`apps/${appName}/tsconfig.node.json`, JSON.stringify({
    compilerOptions: {
      composite: true,
      skipLibCheck: true,
      module: 'ESNext',
      moduleResolution: 'bundler',
      allowSyntheticDefaultImports: true,
    },
    include: ['vite.config.ts'],
  }, null, 2));

  // Tailwind 配置
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
`;

  writeFile(`apps/${appName}/tailwind.config.js`, tailwindConfig);

  // PostCSS 配置
  const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;

  writeFile(`apps/${appName}/postcss.config.js`, postcssConfig);

  // 全局样式
  const globalCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`;

  writeFile(`apps/${appName}/src/index.css`, globalCss);

  // 主入口
  const mainTsx = `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`;

  writeFile(`apps/${appName}/src/main.tsx`, mainTsx);

  // App 组件
  const appTsx = `import { Button } from '@repo/ui';

export default function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-foreground">
          Welcome to @repo/${appName}
        </h1>
        <p className="text-muted-foreground">
          This is a React Monorepo powered by Vite + pnpm workspace
        </p>
        <div className="flex gap-4">
          <Button>Click me</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </div>
    </div>
  );
}
`;

  writeFile(`apps/${appName}/src/App.tsx`, appTsx);

  // index.html
  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>@repo/${appName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

  writeFile(`apps/${appName}/index.html`, indexHtml);

  console.log(`✓ 生成 apps/${appName} 基础文件结构`);
}

/**
 * 生成包的基础文件结构
 */
function generatePackageStructure(packageName) {
  // TypeScript 配置
  const tsConfig = `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "bundler",
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "jsx": "react-jsx",
  },
  "include": ["src"],
  "exclude": ["dist", "node_modules"]
}
`;

  writeFile(`packages/${packageName}/tsconfig.json`, tsConfig);

  // index.ts
  const indexTs = `// ${packageName} package

export * from './';
`;

  writeFile(`packages/${packageName}/src/index.ts`, indexTs);

  console.log(`✓ 生成 packages/${packageName} 基础文件结构`);
}

/**
 * 生成 shadcn/ui 配置
 */
function generateShadcnConfig() {
  const componentsJson = `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
`;

  writeFile('components.json', componentsJson);
  console.log('✓ 生成 components.json (shadcn 配置)');
}

/**
 * 生成 utils 包的 cn 工具
 */
function generateUtils() {
  const cnUtil = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

  writeFile('packages/utils/src/cn.ts', cnUtil);

  // 更新 index.ts
  const indexContent = `export * from './cn';
`;

  writeFile('packages/utils/src/index.ts', indexContent);

  console.log('✓ 生成 packages/utils/cn.ts');
}

/**
 * 生成 types 包基础类型
 */
function generateTypes() {
  // 更新 index.ts
  const indexContent = `// 通用类型定义

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface PageParams {
  page: number;
  pageSize: number;
}

export interface PageData<T = any> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}
`;

  writeFile('packages/types/src/index.ts', indexContent);

  console.log('✓ 生成 packages/types 基础类型');
}

/**
 * 生成 config 包基础配置
 */
function generateConfig() {
  // 更新 index.ts
  const indexContent = `// 项目配置

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const APP_NAME = '@repo/web';

export const ENV = import.meta.env.MODE;
`;

  writeFile('packages/config/src/index.ts', indexContent);

  console.log('✓ 生成 packages/config 基础配置');
}

/**
 * 生成 .gitignore
 */
function generateGitignore() {
  const content = `# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
dist/
build/
.next/
out/

# Misc
.DS_Store
*.pem
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
`;

  writeFile('.gitignore', content);
  console.log('✓ 生成 .gitignore');
}

/**
 * 生成 README.md
 */
function generateReadme() {
  const content = `# React Monorepo

基于 React + TypeScript + Vite + pnpm workspace 的 Monorepo 项目。

## 项目结构

\`\`\`
.
├── apps/              # 业务应用
│   ├── web/          # Web 应用
│   └── admin/        # 管理后台
├── packages/          # 共享库
│   ├── ui/           # UI 组件库 (shadcn/ui)
│   ├── utils/        # 工具函数
│   ├── types/        # 类型定义
│   └── config/       # 配置
├── pnpm-workspace.yaml
└── package.json
\`\`\`

## 快速开始

### 安装依赖

\`\`\`bash
pnpm install
\`\`\`

### 开发

\`\`\`bash
# 启动 web 应用
pnpm dev

# 启动所有应用
pnpm run dev:all

# 启动特定应用
pnpm --filter @repo/web dev
pnpm --filter @repo/admin dev
\`\`\`

### 构建

\`\`\`bash
pnpm build
\`\`\`

### 添加 shadcn/ui 组件

\`\`\`bash
# 在 packages/ui 目录下
cd packages/ui
npx shadcn@latest add [component-name]
\`\`\`

## 技术栈

- **框架**: React 18
- **语言**: TypeScript
- **构建工具**: Vite
- **包管理**: pnpm workspace
- **样式**: Tailwind CSS
- **UI 组件**: shadcn/ui
`;

  writeFile('README.md', content);
  console.log('✓ 生成 README.md');
}

// ==================== 主流程 ====================

/**
 * 初始化 Monorepo
 */
function initMonorepo() {
  console.log('');
  console.log('🚀 开始初始化 React Monorepo...');
  console.log('');

  // 1. 生成根目录配置文件
  console.log('📦 生成根目录配置文件...');
  generateWorkspaceYaml();
  generateRootPackageJson();
  generateGitignore();
  generateShadcnConfig();
  generateReadme();

  // 2. 生成应用结构
  console.log('');
  console.log('📱 生成应用结构...');
  for (const app of CONFIG.defaultApps) {
    ensureDir(`apps/${app}/src`);
    generateAppPackageJson(app);
    generateAppStructure(app);
  }

  // 3. 生成包结构
  console.log('');
  console.log('📦 生成包结构...');
  for (const pkg of CONFIG.defaultPackages) {
    ensureDir(`packages/${pkg}/src`);
    generatePackagePackageJson(pkg);
    generatePackageStructure(pkg);
  }

  // 4. 生成各包的特定内容
  console.log('');
  console.log('🔧 生成各包特定内容...');
  generateUtils();
  generateTypes();
  generateConfig();

  // 5. 生成 UI 包的 cn 工具（软链接到 utils）
  const uiIndex = `// UI Components
// shadcn/ui 组件将被添加到这里

export * from './cn';

// 导出 utils 包的 cn 工具
export { cn } from '@repo/utils';
`;
  writeFile('packages/ui/src/index.ts', uiIndex);

  console.log('');
  console.log('✅ Monorepo 初始化完成！');
  console.log('');
  console.log('📋 下一步操作：');
  console.log('   1. 安装依赖: pnpm install');
  console.log('   2. 添加 shadcn 组件: cd packages/ui && npx shadcn@latest add button');
  console.log('   3. 启动开发: pnpm dev');
  console.log('');
}

// ==================== 命令行入口 ====================

if (require.main === module) {
  initMonorepo();
}

// 导出供其他模块使用
module.exports = {
  initMonorepo,
  CONFIG,
};
