#!/usr/bin/env node

/**
 * shadcn/ui 组件下载器
 *
 * 功能：
 * 1. 从 shadcn/ui 官方仓库下载组件
 * 2. 自动配置组件路径
 * 3. 更新 UI 包的导出
 *
 * 用法：
 *   node scripts/shadcn-downloader.js [component-name]
 *   node scripts/shadcn-downloader.js button input dialog
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// ==================== 配置 ====================

const CONFIG = {
  // shadcn/ui 官方仓库地址
  baseUrl: 'https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/registry',

  // UI 包目标路径
  uiPackagePath: 'packages/ui',

  // 组件列表（常用的基础组件）
  defaultComponents: [
    'button',
    'input',
    'label',
    'select',
    'checkbox',
    'radio-group',
    'switch',
    'slider',
    'dialog',
    'dropdown-menu',
    'popover',
    'tooltip',
    'toast',
    'table',
    'card',
    'badge',
    'avatar',
    'separator',
    'tabs',
    'accordion',
    'alert',
    'scroll-area',
    'command',
  ],
};

// ==================== 文件工具 ====================

/**
 * 确保目录存在
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * 写入文件
 */
function writeFile(filePath, content) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      ensureDir(dir);
    }
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  } catch (error) {
    console.error(`❌ 写入文件失败: ${filePath}`, error.message);
    return false;
  }
}

/**
 * 读取文件内容
 */
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

// ==================== HTTP 下载工具 ====================

/**
 * 下载文件内容
 */
function downloadFile(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    client.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        // 处理重定向
        return downloadFile(res.headers.location).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${url}`));
        return;
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

/**
 * 下载组件文件
 */
async function downloadComponent(componentName) {
  console.log(`📥 下载组件: ${componentName}`);

  // 组件文件 URL
  const componentUrl = `${CONFIG.baseUrl}/new-york/ui/${componentName}.tsx`;
  const libUrl = `${CONFIG.baseUrl}/default/lib/utils.ts`;

  try {
    // 1. 确保目录存在
    const componentDir = path.join(CONFIG.uiPackagePath, 'src/components/ui', componentName);
    ensureDir(componentDir);

    // 2. 下载组件文件
    const componentContent = await downloadFile(componentUrl);
    const componentPath = path.join(componentDir, `${componentName}.tsx`);
    writeFile(componentPath, componentContent);
    console.log(`  ✓ ${componentPath}`);

    // 3. 确保 lib 目录存在并下载 utils
    const libDir = path.join(CONFIG.uiPackagePath, 'src/lib');
    ensureDir(libDir);
    const utilsPath = path.join(libDir, 'utils.ts');

    if (!fs.existsSync(utilsPath)) {
      const utilsContent = await downloadFile(libUrl);
      writeFile(utilsPath, utilsContent);
      console.log(`  ✓ ${utilsPath}`);
    }

    return true;
  } catch (error) {
    console.error(`  ❌ 下载失败: ${error.message}`);
    return false;
  }
}

/**
 * 下载组件的注册表信息
 */
async function downloadRegistry(componentName) {
  const registryUrl = `${CONFIG.baseUrl}/new-york/ui/${componentName}.json`;

  try {
    const content = await downloadFile(registryUrl);
    return JSON.parse(content);
  } catch (error) {
    console.warn(`  ⚠️  无法下载注册表信息: ${error.message}`);
    return null;
  }
}

// ==================== 组件管理 ====================

/**
 * 更新 UI 包的导出
 */
function updateUiExports(components) {
  const indexPath = path.join(CONFIG.uiPackagePath, 'src', 'index.ts');
  let content = readFile(indexPath) || '// UI Components\n\nexport * from \'@repo/utils\';\n';

  // 为每个组件添加导出
  components.forEach(component => {
    const exportLine = `export * from './components/ui/${component}/${component}';`;

    if (!content.includes(exportLine)) {
      // 按字母顺序插入
      const lines = content.split('\n');
      let insertIndex = lines.length;

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('export * from \'./components/ui/')) {
          const existingComponent = lines[i].match(/\.\/components\/ui\/([^\/]+)/)?.[1];
          if (existingComponent && existingComponent > component) {
            insertIndex = i;
            break;
          }
          insertIndex = i + 1;
        }
      }

      lines.splice(insertIndex, 0, exportLine);
      content = lines.join('\n');
    }
  });

  writeFile(indexPath, content);
  console.log(`✓ 更新导出文件: ${indexPath}`);
}

/**
 * 下载多个组件
 */
async function downloadComponents(componentNames) {
  console.log('');
  console.log('🚀 开始下载 shadcn/ui 组件...');
  console.log('');

  const results = {
    success: [],
    failed: [],
  };

  for (const component of componentNames) {
    const success = await downloadComponent(component);
    if (success) {
      results.success.push(component);
    } else {
      results.failed.push(component);
    }
  }

  // 更新导出
  if (results.success.length > 0) {
    updateUiExports(results.success);
  }

  // 输出结果
  console.log('');
  console.log('📊 下载结果:');
  console.log(`  ✅ 成功: ${results.success.length} 个`);
  console.log(`  ❌ 失败: ${results.failed.length} 个`);

  if (results.success.length > 0) {
    console.log(`  ${results.success.map(c => `    - ${c}`).join('\n')}`);
  }

  if (results.failed.length > 0) {
    console.log(`  ${results.failed.map(c => `    - ${c}`).join('\n')}`);
  }

  console.log('');
  console.log('✅ 完成！现在可以在应用中使用这些组件：');
  console.log(`   import { ${results.success[0] || 'Button' } } from '@repo/ui';`);
  console.log('');

  return results;
}

/**
 * 下载所有默认组件
 */
async function downloadAllDefaultComponents() {
  console.log('');
  console.log('🚀 下载所有默认 shadcn/ui 组件...');
  console.log('');

  return downloadComponents(CONFIG.defaultComponents);
}

/**
 * 列出可用的组件
 */
function listAvailableComponents() {
  console.log('');
  console.log('📋 可用的 shadcn/ui 组件:');
  console.log('');
  CONFIG.defaultComponents.forEach(component => {
    console.log(`  - ${component}`);
  });
  console.log('');
  console.log('用法:');
  console.log('  node scripts/shadcn-downloader.js button input dialog');
  console.log('  node scripts/shadcn-downloader.js --all');
  console.log('');
}

// ==================== 命令行入口 ====================

async function main() {
  const args = process.argv.slice(2);

  // 帮助信息
  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    console.log('');
    console.log('shadcn/ui 组件下载器');
    console.log('');
    console.log('用法:');
    console.log('  node scripts/shadcn-downloader.js [component-name] [...more-names]');
    console.log('  node scripts/shadcn-downloader.js --all          # 下载所有默认组件');
    console.log('  node scripts/shadcn-downloader.js --list         # 列出可用组件');
    console.log('  node scripts/shadcn-downloader.js --help         # 显示帮助');
    console.log('');
    return;
  }

  // 列出可用组件
  if (args.includes('--list')) {
    listAvailableComponents();
    return;
  }

  // 下载所有默认组件
  if (args.includes('--all')) {
    await downloadAllDefaultComponents();
    return;
  }

  // 下载指定的组件（过滤掉选项参数）
  const components = args.filter(arg => !arg.startsWith('--'));
  if (components.length === 0) {
    console.log('');
    console.log('⚠️  请指定要下载的组件名称');
    console.log('   使用 --list 查看可用组件列表');
    console.log('   使用 --all 下载所有默认组件');
    console.log('');
    return;
  }

  await downloadComponents(components);
}

if (require.main === module) {
  main().catch(error => {
    console.error('');
    console.error('❌ 发生错误:', error.message);
    process.exit(1);
  });
}

// 导出供其他模块使用
module.exports = {
  downloadComponent,
  downloadComponents,
  downloadAllDefaultComponents,
  listAvailableComponents,
  CONFIG,
};
