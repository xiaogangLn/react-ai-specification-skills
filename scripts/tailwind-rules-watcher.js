#!/usr/bin/env node

/**
 * Tailwind 规则文件监控器
 *
 * 功能：
 * 1. 监控 Tailwind 配置文件和 CSS 文件的变化
 * 2. 文件变化时自动重新生成规则文件
 */

const path = require('path');

// 动态导入 chokidar（如果可用）
let chokidar;
try {
  chokidar = require('chokidar');
} catch (e) {
  console.error('❌ 需要安装 chokidar 依赖');
  console.error('');
  console.error('请运行以下命令安装:');
  console.error('  npm install chokidar --save-dev');
  console.error('  或');
  console.error('  pnpm add chokidar -D');
  console.error('');
  process.exit(1);
}

// 导入生成器
const { generate, CONFIG } = require('./tailwind-rules-generator.js');

// ==================== 配置 ====================

const WATCH_PATTERNS = [
  'tailwind.config.js',
  'tailwind.config.ts',
  'tailwind.config.cjs',
  'tailwind.config.mjs',
  'src/**/*.css',
  'app/**/*.css',
  'styles/**/*.css',
  'globals.css',
  'theme.css',
];

const IGNORED_PATTERNS = [
  '**/node_modules/**',
  '**/*.module.css',
  '**/*.min.css',
  '**/dist/**',
  '**/build/**',
];

// ==================== 监控器 ====================

let isGenerating = false;
let pendingGeneration = false;

/**
 * 防抖生成
 */
function debouncedGenerate(reason) {
  if (isGenerating) {
    pendingGeneration = true;
    return;
  }

  isGenerating = true;
  console.log('');
  console.log(`🔄 ${reason}`);
  console.log('');

  try {
    generate();
  } catch (error) {
    console.error('❌ 生成失败:', error.message);
  } finally {
    isGenerating = false;

    // 如果在生成过程中有新的变化，再次生成
    if (pendingGeneration) {
      pendingGeneration = false;
      setTimeout(() => debouncedGenerate('检测到更多变化'), 100);
    }
  }
}

/**
 * 启动监控
 */
function startWatcher() {
  console.log('🚀 Tailwind 规则监控器启动');
  console.log('');
  console.log('📁 监控的文件模式:');
  WATCH_PATTERNS.forEach(p => console.log(`   ${p}`));
  console.log('');
  console.log('🚫 忽略的模式:');
  IGNORED_PATTERNS.forEach(p => console.log(`   ${p}`));
  console.log('');

  // 首次生成
  console.log('📝 首次生成规则...');
  generate();
  console.log('');
  console.log('👀 开始监控文件变化...');
  console.log('   按 Ctrl+C 停止监控');
  console.log('');

  // 创建监控器
  const watcher = chokidar.watch(WATCH_PATTERNS, {
    ignored: IGNORED_PATTERNS,
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 300,
      pollInterval: 100,
    },
  });

  // 事件处理
  watcher
    .on('add', filePath => {
      debouncedGenerate(`文件添加: ${filePath}`);
    })
    .on('change', filePath => {
      debouncedGenerate(`文件修改: ${filePath}`);
    })
    .on('unlink', filePath => {
      debouncedGenerate(`文件删除: ${filePath}`);
    })
    .on('error', error => {
      console.error('❌ 监控器错误:', error);
    });

  // 优雅退出
  process.on('SIGINT', () => {
    console.log('');
    console.log('👋 停止监控...');
    watcher.close().then(() => {
      console.log('✅ 监控已停止');
      process.exit(0);
    });
  });

  process.on('SIGTERM', () => {
    watcher.close().then(() => {
      process.exit(0);
    });
  });
}

// ==================== 命令行入口 ====================

if (require.main === module) {
  startWatcher();
}

module.exports = { startWatcher };
