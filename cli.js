#!/usr/bin/env node

/**
 * React AI Monorepo CLI
 *
 * 一键初始化 React + Vite + pnpm + shadcn/ui 的 Monorepo 项目
 *
 * 使用方式:
 *   npx react-ai-monorepo init
 *   npx react-ai-monorepo add-component button
 *   npx react-ai-monorepo shadcn
 */

const fs = require('fs');
const path = require('path');

// ==================== 配置 ====================

const CONFIG = {
  name: 'react-ai-monorepo',
  version: require('./package.json').version,
};

// ==================== 工具函数 ====================

/**
 * 打印带颜色的消息
 */
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function error(message) {
  log(`✗ ${message}`, colors.red);
}

function info(message) {
  log(`ℹ ${message}`, colors.blue);
}

function warn(message) {
  log(`⚠ ${message}`, colors.yellow);
}

// ==================== 模块导入 ====================

// 动态导入模块
function loadModule(modulePath) {
  try {
    const absolutePath = path.resolve(__dirname, modulePath);
    if (process.env.DEBUG) {
      console.log('DEBUG: Loading module from:', absolutePath);
      console.log('DEBUG: File exists:', fs.existsSync(absolutePath));
    }
    if (fs.existsSync(absolutePath)) {
      const mod = require(absolutePath);
      if (process.env.DEBUG) {
        console.log('DEBUG: Module loaded, exports:', Object.keys(mod || {}));
      }
      return mod;
    }
    if (process.env.DEBUG) {
      console.log('DEBUG: Module not found at:', absolutePath);
    }
    return null;
  } catch (err) {
    warn(`无法加载模块: ${modulePath} - ${err.message}`);
    if (process.env.DEBUG) {
      console.error(err.stack);
    }
    return null;
  }
}

// ==================== 命令处理器 ====================

const commands = {
  /**
   * init - 初始化 Monorepo 项目
   */
  init: {
    description: '初始化 Monorepo 项目结构',
    usage: 'react-ai-monorepo init',
    execute: async () => {
      log('', colors.cyan);
      log('🚀 React AI Monorepo CLI', colors.cyan);
      log(`   版本: ${CONFIG.version}`, colors.cyan);
      log('', colors.cyan);

      const { initMonorepo } = loadModule('./scripts/monorepo-init.js');

      if (!initMonorepo) {
        error('初始化模块加载失败');
        process.exit(1);
      }

      initMonorepo();
    }
  },

  /**
   * shadcn - 下载 shadcn/ui 组件
   */
  shadcn: {
    description: '下载 shadcn/ui 组件',
    usage: 'react-ai-monorepo shadcn [component-name] [--all|--list]',
    execute: async (args) => {
      const { downloadComponents, downloadAllDefaultComponents, listAvailableComponents } =
        loadModule('./scripts/shadcn-downloader.js');

      if (!downloadComponents) {
        error('shadcn 下载器加载失败');
        process.exit(1);
      }

      const components = args.filter(arg => !arg.startsWith('--'));

      if (args.includes('--list') || args.includes('-l')) {
        listAvailableComponents();
        return;
      }

      if (args.includes('--all') || args.includes('-a')) {
        await downloadAllDefaultComponents();
        return;
      }

      if (components.length === 0) {
        warn('请指定要下载的组件名称');
        info('使用 --list 查看可用组件列表');
        info('使用 --all 下载所有默认组件');
        return;
      }

      await downloadComponents(components);
    }
  },

  /**
   * add-component - 添加 shadcn/ui 组件（shadcn 的别名）
   */
  'add-component': {
    description: '添加组件（shadcn 别名）',
    usage: 'react-ai-monorepo add-component [component-name]',
    execute: async (args) => {
      commands.shadcn.execute(args);
    }
  },

  /**
   * component - component 的简写
   */
  component: {
    description: '组件命令（shadcn 别名）',
    usage: 'react-ai-monorepo component [component-name]',
    execute: async (args) => {
      commands.shadcn.execute(args);
    }
  },

  /**
   * tailwind - 生成 Tailwind 规则
   */
  tailwind: {
    description: '生成 Tailwind CSS 规则',
    usage: 'react-ai-monorepo tailwind',
    execute: async () => {
      const { generate } = loadModule('./scripts/tailwind-rules-generator.js');

      if (!generate) {
        error('Tailwind 规则生成器加载失败');
        process.exit(1);
      }

      generate();
    }
  },

  /**
   * help - 显示帮助信息
   */
  help: {
    description: '显示帮助信息',
    usage: 'react-ai-monorepo help [command]',
    execute: () => {
      showHelp();
    }
  },
};

// ==================== 帮助信息 ====================

function showHelp(commandName = null) {
  log('', colors.cyan);
  log(`🚀 React AI Monorepo CLI v${CONFIG.version}`, colors.cyan);
  log('', colors.cyan);

  if (commandName) {
    const command = commands[commandName];
    if (command && command.usage) {
      log(`命令: ${commandName}`, colors.yellow);
      log(`用法: ${command.usage}`, colors.white);
      if (command.description) {
        log(`\n${command.description}`, colors.white);
      }
    } else {
      error(`未知命令: ${commandName}`);
      log('\n使用 --help 查看所有可用命令', colors.white);
    }
    return;
  }

  log('用法:', colors.yellow);
  log('  npx react-ai-monorepo <command> [options]', colors.white);
  log('', colors.white);

  log('命令:', colors.yellow);
  log('', colors.white);

  const commandList = [
    { name: 'init', usage: 'init', desc: '初始化 Monorepo 项目结构' },
    { name: 'shadcn', usage: 'shadcn [component-name] [--all|--list]', desc: '下载 shadcn/ui 组件' },
    { name: 'add-component', usage: 'add-component [component-name]', desc: '添加组件（shadcn 别名）' },
    { name: 'component', usage: 'component [component-name]', desc: '组件命令（shadcn 别名）' },
    { name: 'tailwind', usage: 'tailwind', desc: '生成 Tailwind CSS 规则' },
    { name: 'help', usage: 'help [command]', desc: '显示帮助信息' },
  ];

  commandList.forEach(({ name, usage, desc }) => {
    log(`  ${name.padEnd(20)} ${desc}`, colors.white);
  });

  log('', colors.white);
  log('示例:', colors.yellow);
  log('  npx react-ai-monorepo init', colors.white);
  log('  npx react-ai-monorepo shadcn button input dialog', colors.white);
  log('  npx react-ai-monorepo shadcn --all', colors.white);
  log('  npx react-ai-monorepo tailwind', colors.white);
  log('', colors.white);
}

// ==================== 主流程 ====================

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h') || args[0] === 'help') {
    showHelp();
    return;
  }

  const commandName = args[0];
  const commandArgs = args.slice(1);

  const command = commands[commandName];

  if (!command) {
    error(`未知命令: ${commandName}`);
    info('使用 --help 查看可用命令');
    process.exit(1);
  }

  try {
    await command.execute(commandArgs);
  } catch (err) {
    error(`执行命令失败: ${err.message}`);
    if (process.env.DEBUG) {
      console.error(err);
    }
    process.exit(1);
  }
}

// ==================== 命令行入口 ====================

if (require.main === module) {
  main();
}

module.exports = {
  commands,
  run: main,
};
