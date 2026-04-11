#!/usr/bin/env node

/**
 * Tailwind 规则自动生成器
 *
 * 功能：
 * 1. 扫描项目中的 Tailwind 配置文件
 * 2. 解析自定义的设计 Token（颜色、间距、圆角、字体等）
 * 3. 生成项目专属的 tailwind-rules.md 规则文件
 */

const fs = require('fs');
const path = require('path');

// ==================== 配置 ====================

const CONFIG = {
  // 要扫描的文件模式
  patterns: {
    tailwindConfig: [
      'tailwind.config.js',
      'tailwind.config.ts',
      'tailwind.config.cjs',
      'tailwind.config.mjs',
    ],
    cssFiles: [
      'src/**/globals.css',
      'src/**/theme.css',
      'src/index.css',
      'src/app/**/globals.css',
      'src/styles/**/*.css',
      'app/globals.css',
    ],
  },
  // 输出文件路径
  outputPath: '.cursor/rules/tailwind-rules.md',
  // 排除的文件模式
  excludes: ['**/*.module.css', '**/*.min.css'],
};

// ==================== 文件工具 ====================

/**
 * 检查文件是否存在
 */
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * 读取文件内容
 */
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.warn(`⚠️  无法读取文件: ${filePath}`);
    return null;
  }
}

/**
 * 写入文件
 */
function writeFile(filePath, content) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  } catch (error) {
    console.error(`❌ 写入文件失败: ${filePath}`, error.message);
    return false;
  }
}

// ==================== Tailwind 配置解析 ====================

/**
 * 解析 Tailwind 配置文件
 */
function parseTailwindConfig(configPath) {
  if (!fileExists(configPath)) {
    return null;
  }

  try {
    // 删除缓存，确保读取最新配置
    const fullPath = path.resolve(configPath);
    delete require.cache[require.resolve(fullPath)];

    const config = require(fullPath);
    return config.theme || {};
  } catch (error) {
    console.warn(`⚠️  解析 Tailwind 配置失败: ${configPath}`);
    console.warn(`   ${error.message}`);
    return null;
  }
}

// ==================== CSS 变量解析 ====================

/**
 * 解析 CSS 变量
 */
function parseCssVariables(cssContent) {
  if (!cssContent) return {};

  const variables = {};

  // 匹配 CSS 变量定义: --variable-name: value;
  const varRegex = /--([\w-]+)\s*:\s*([^;]+);/g;
  let match;

  while ((match = varRegex.exec(cssContent)) !== null) {
    const name = match[1];
    const value = match[2].trim();
    variables[name] = value;
  }

  return variables;
}

/**
 * 从 CSS 变量中提取设计 Token
 */
function extractTokensFromCssVariables(variables) {
  const tokens = {
    colors: {},
    spacing: {},
    borderRadius: {},
    fontSize: {},
    componentHeight: {},
  };

  for (const [name, value] of Object.entries(variables)) {
    // 颜色 Token
    if (name.startsWith('color-') || name.startsWith('text-') || name.startsWith('bg-') || name.startsWith('border-')) {
      const key = name.replace(/^(color-|text-|bg-|border-)/, '');
      tokens.colors[key] = { value, description: getVariableDescription(name) };
    }

    // 间距 Token
    else if (name.includes('spacing') || name.includes('space') || name.includes('gap')) {
      tokens.spacing[name] = { value, description: '间距' };
    }

    // 圆角 Token
    else if (name.includes('radius') || name.includes('rounded')) {
      tokens.borderRadius[name] = { value, description: '圆角' };
    }

    // 字号 Token
    else if (name.includes('font-size')) {
      tokens.fontSize[name] = { value, description: '字号' };
    }

    // 组件高度 Token
    else if (name.includes('comp-height') || name.includes('component-height')) {
      tokens.componentHeight[name] = { value, description: '组件高度' };
    }
  }

  return tokens;
}

/**
 * 获取变量的描述
 */
function getVariableDescription(variableName) {
  const descriptions = {
    'text-heading': '标题文字',
    'text-body': '正文文字',
    'text-secondary': '次要文字',
    'text-disabled': '禁用文字',
    'background': '主背景',
    'surface-secondary': '次级背景',
    'border': '标准边框',
    'divider': '分割线',
    'primary': '主要品牌色',
    'success': '成功状态色',
    'warning': '警告状态色',
    'error': '错误状态色',
  };
  return descriptions[variableName] || '';
}

// ==================== 设计 Token 分类 ====================

/**
 * 分类颜色 Token
 */
function classifyColors(colors) {
  const classified = {
    brand: {}, // 品牌色
    text: {},  // 文本色
    background: {}, // 背景色
    border: {}, // 边框色
    state: {},  // 状态色
    tag: {},    // 标签色
    other: {},  // 其他
  };

  for (const [key, config] of Object.entries(colors)) {
    if (key.startsWith('primary') || key.startsWith('secondary')) {
      classified.brand[key] = config;
    } else if (key.startsWith('text-')) {
      classified.text[key] = config;
    } else if (key.startsWith('bg-') || key.startsWith('background')) {
      classified.background[key] = config;
    } else if (key.startsWith('border-') || key.startsWith('divider')) {
      classified.border[key] = config;
    } else if (['success', 'warning', 'error', 'danger'].includes(key)) {
      classified.state[key] = config;
    } else if (key.startsWith('tag-')) {
      classified.tag[key] = config;
    } else {
      classified.other[key] = config;
    }
  }

  return classified;
}

// ==================== 规则生成 ====================

/**
 * 生成 Tailwind 规则 Markdown
 */
function generateRules(tokens) {
  const lines = [];

  // 头部
  lines.push('---');
  lines.push('name: tailwind-rules');
  lines.push('description: Tailwind CSS 样式使用规范（自动生成）');
  lines.push('---');
  lines.push('');
  lines.push('# Tailwind CSS 样式使用规范（自动生成）');
  lines.push('');
  lines.push('> 本文件由 Tailwind 规则自动生成器生成');
  lines.push('> 修改配置文件后，规则会自动更新');
  lines.push('');
  lines.push('---');
  lines.push('');

  // 颜色规范
  if (Object.keys(tokens.colors).length > 0) {
    const classified = classifyColors(tokens.colors);
    lines.push('# 1. 颜色规范（项目特定）');
    lines.push('');
    lines.push('## 1.1 品牌色');
    lines.push('');
    lines.push('```tsx');
    for (const [key] of Object.entries(classified.brand)) {
      lines.push(`className="bg-${key} text-${key}-foreground"`);
    }
    lines.push('```');
    lines.push('');

    if (Object.keys(classified.text).length > 0) {
      lines.push('## 1.2 文本色');
      lines.push('');
      lines.push('```tsx');
      for (const [key] of Object.entries(classified.text)) {
        lines.push(`className="text-${key}"`);
      }
      lines.push('```');
      lines.push('');
    }

    if (Object.keys(classified.background).length > 0) {
      lines.push('## 1.3 背景色');
      lines.push('');
      lines.push('```tsx');
      for (const [key] of Object.entries(classified.background)) {
        lines.push(`className="bg-${key}"`);
      }
      lines.push('```');
      lines.push('');
    }

    if (Object.keys(classified.state).length > 0) {
      lines.push('## 1.4 状态色');
      lines.push('');
      lines.push('```tsx');
      for (const [key] of Object.entries(classified.state)) {
        lines.push(`className="text-${key} bg-${key}/10"`);
      }
      lines.push('```');
      lines.push('');
    }
  }

  // 间距规范
  if (Object.keys(tokens.spacing).length > 0) {
    lines.push('# 2. 间距规范（项目特定）');
    lines.push('');
    lines.push('## 2.1 自定义间距 Token');
    lines.push('');
    lines.push('| Token | 值 | 用途 |');
    lines.push('|-------|-----|------|');
    for (const [key, config] of Object.entries(tokens.spacing)) {
      lines.push(`| ${key} | ${config.value} | ${config.description} |`);
    }
    lines.push('');
    lines.push('```tsx');
    lines.push('// 使用示例');
    for (const [key] of Object.keys(tokens.spacing).slice(0, 3)) {
      lines.push(`className="p-${key} gap-${key}"`);
    }
    lines.push('```');
    lines.push('');
  }

  // 圆角规范
  if (Object.keys(tokens.borderRadius).length > 0) {
    lines.push('# 3. 圆角规范（项目特定）');
    lines.push('');
    lines.push('## 3.1 自定义圆角 Token');
    lines.push('');
    lines.push('| Token | 值 | 用途 |');
    lines.push('|-------|-----|------|');
    for (const [key, config] of Object.entries(tokens.borderRadius)) {
      lines.push(`| ${key} | ${config.value} | ${config.description} |`);
    }
    lines.push('');
  }

  // 字体规范
  if (Object.keys(tokens.fontSize).length > 0) {
    lines.push('# 4. 字体规范（项目特定）');
    lines.push('');
    lines.push('## 4.1 自定义字号 Token');
    lines.push('');
    lines.push('| Token | 值 | 用途 |');
    lines.push('|-------|-----|------|');
    for (const [key, config] of Object.entries(tokens.fontSize)) {
      lines.push(`| ${key} | ${config.value} | ${config.description} |`);
    }
    lines.push('');
  }

  // 组件高度规范
  if (Object.keys(tokens.componentHeight).length > 0) {
    lines.push('# 5. 组件高度规范（项目特定）');
    lines.push('');
    lines.push('## 5.1 自定义组件高度 Token');
    lines.push('');
    lines.push('| Token | 值 | 用途 |');
    lines.push('|-------|-----|------|');
    for (const [key, config] of Object.entries(tokens.componentHeight)) {
      lines.push(`| ${key} | ${config.value} | ${config.description} |`);
    }
    lines.push('');
  }

  // 通用规则
  lines.push('# 6. 通用规则');
  lines.push('');
  lines.push('## 6.1 必须使用语义化 Token');
  lines.push('');
  lines.push('```tsx');
  lines.push('// ✅ 正确');
  if (Object.keys(tokens.colors).length > 0) {
    lines.push(`className="bg-${Object.keys(tokens.colors)[0]}"`);
  }
  if (Object.keys(tokens.spacing).length > 0) {
    lines.push(`className="p-${Object.keys(tokens.spacing)[0]}"`);
  }
  lines.push('');
  lines.push('// ❌ 错误');
  lines.push('className="bg-[#3377FF] p-[13px]"');
  lines.push('```');
  lines.push('');

  lines.push('## 6.2 必须使用 cn 工具');
  lines.push('');
  lines.push('```tsx');
  lines.push("import { cn } from '@/lib/utils';");
  lines.push('');
  lines.push('className={cn("base-class", className)}');
  lines.push('```');
  lines.push('');

  lines.push('## 6.3 禁止行为');
  lines.push('');
  lines.push('- ❌ 使用硬编码颜色值');
  lines.push('- ❌ 使用硬编码间距');
  lines.push('- ❌ 使用内联 style');
  lines.push('- ❌ 使用 CSS Modules');
  lines.push('- ❌ 使用 styled-components');
  lines.push('- ❌ 使用 !important');
  lines.push('');

  // AI 行为约束
  lines.push('# 7. AI 行为约束（关键）');
  lines.push('');
  lines.push('AI 生成样式必须：');
  lines.push('');
  if (Object.keys(tokens.colors).length > 0) {
    lines.push('- 自动使用项目定义的颜色 Token');
  }
  if (Object.keys(tokens.spacing).length > 0) {
    lines.push('- 自动使用项目定义的间距 Token');
  }
  if (Object.keys(tokens.borderRadius).length > 0) {
    lines.push('- 自动使用项目定义的圆角 Token');
  }
  lines.push('- 自动使用 cn 合并 className');
  lines.push('- 自动添加交互状态样式');
  lines.push('- 自动避免硬编码值');
  lines.push('');

  // 自检清单
  lines.push('# 8. 自检清单（必须）');
  lines.push('');
  if (Object.keys(tokens.colors).length > 0) {
    lines.push('- [ ] 是否使用项目定义的颜色 Token');
  }
  if (Object.keys(tokens.spacing).length > 0) {
    lines.push('- [ ] 是否使用项目定义的间距 Token');
  }
  if (Object.keys(tokens.borderRadius).length > 0) {
    lines.push('- [ ] 是否使用项目定义的圆角 Token');
  }
  lines.push('- [ ] 是否使用 cn 合并 className');
  lines.push('- [ ] 是否有硬编码值');
  lines.push('- [ ] 是否有内联 style');
  lines.push('- [ ] 是否添加交互状态');
  lines.push('');

  return lines.join('\n');
}

// ==================== 主流程 ====================

/**
 * 查找 Tailwind 配置文件
 */
function findTailwindConfig() {
  for (const pattern of CONFIG.patterns.tailwindConfig) {
    if (fileExists(pattern)) {
      console.log(`✓ 找到 Tailwind 配置: ${pattern}`);
      return pattern;
    }
  }
  return null;
}

/**
 * 查找 CSS 文件
 */
function findCssFiles() {
  const foundFiles = [];

  for (const pattern of CONFIG.patterns.cssFiles) {
    // 简化处理：只检查固定路径
    const commonPaths = [
      'src/app/globals.css',
      'src/styles/globals.css',
      'src/index.css',
      'src/theme.css',
      'app/globals.css',
      'globals.css',
    ];

    for (const filePath of commonPaths) {
      if (fileExists(filePath) && !CONFIG.excludes.some(exclude => filePath.includes(exclude.replace('**/', '')))) {
        if (!foundFiles.includes(filePath)) {
          foundFiles.push(filePath);
        }
      }
    }
  }

  return foundFiles;
}

/**
 * 主函数：生成规则
 */
function generate() {
  console.log('🔍 扫描 Tailwind 配置...');

  const tokens = {
    colors: {},
    spacing: {},
    borderRadius: {},
    fontSize: {},
    componentHeight: {},
  };

  // 1. 解析 Tailwind 配置文件
  const tailwindConfigPath = findTailwindConfig();
  if (tailwindConfigPath) {
    const theme = parseTailwindConfig(tailwindConfigPath);
    if (theme) {
      console.log(`  - 解析配置: ${Object.keys(theme).length} 个主题配置`);

      // 提取颜色
      if (theme.colors) {
        for (const [key, value] of Object.entries(theme.colors)) {
          if (typeof value === 'string') {
            tokens.colors[key] = { value, description: '' };
          } else if (typeof value === 'object') {
            // 嵌套颜色（如 primary: { light: '...', DEFAULT: '...', dark: '...' }）
            for (const [subKey, subValue] of Object.entries(value)) {
              const fullKey = subKey === 'DEFAULT' ? key : `${key}-${subKey}`;
              tokens.colors[fullKey] = { value: subValue, description: '' };
            }
          }
        }
      }

      // 提取间距
      if (theme.spacing) {
        for (const [key, value] of Object.entries(theme.spacing)) {
          tokens.spacing[key] = { value, description: '间距' };
        }
      }

      // 提取圆角
      if (theme.borderRadius) {
        for (const [key, value] of Object.entries(theme.borderRadius)) {
          tokens.borderRadius[`radius-${key}`] = { value, description: '圆角' };
        }
      }

      // 提取字号
      if (theme.fontSize) {
        for (const [key, value] of Object.entries(theme.fontSize)) {
          const fontSizeValue = typeof value === 'string' ? value : value[0];
          tokens.fontSize[`text-${key}`] = { value: fontSizeValue, description: '字号' };
        }
      }

      // 提取扩展配置
      if (theme.extend) {
        if (theme.extend.colors) {
          for (const [key, value] of Object.entries(theme.extend.colors)) {
            if (typeof value === 'string') {
              tokens.colors[key] = { value, description: '' };
            } else if (typeof value === 'object') {
              for (const [subKey, subValue] of Object.entries(value)) {
                const fullKey = subKey === 'DEFAULT' ? key : `${key}-${subKey}`;
                tokens.colors[fullKey] = { value: subValue, description: '' };
              }
            }
          }
        }

        if (theme.extend.spacing) {
          for (const [key, value] of Object.entries(theme.extend.spacing)) {
            tokens.spacing[key] = { value, description: '间距' };
          }
        }

        if (theme.extend.borderRadius) {
          for (const [key, value] of Object.entries(theme.extend.borderRadius)) {
            tokens.borderRadius[`radius-${key}`] = { value, description: '圆角' };
          }
        }
      }
    }
  } else {
    console.log('  ℹ️  未找到 Tailwind 配置文件');
  }

  // 2. 解析 CSS 文件
  const cssFiles = findCssFiles();
  console.log(`🔍 扫描 CSS 文件...`);
  for (const filePath of cssFiles) {
    console.log(`  - 读取: ${filePath}`);
    const cssContent = readFile(filePath);
    if (cssContent) {
      const variables = parseCssVariables(cssContent);
      console.log(`    找到 ${Object.keys(variables).length} 个 CSS 变量`);

      const cssTokens = extractTokensFromCssVariables(variables);
      Object.assign(tokens.colors, cssTokens.colors);
      Object.assign(tokens.spacing, cssTokens.spacing);
      Object.assign(tokens.borderRadius, cssTokens.borderRadius);
      Object.assign(tokens.fontSize, cssTokens.fontSize);
      Object.assign(tokens.componentHeight, cssTokens.componentHeight);
    }
  }

  // 统计
  console.log('');
  console.log('📊 提取的 Token 数量:');
  console.log(`  - 颜色: ${Object.keys(tokens.colors).length}`);
  console.log(`  - 间距: ${Object.keys(tokens.spacing).length}`);
  console.log(`  - 圆角: ${Object.keys(tokens.borderRadius).length}`);
  console.log(`  - 字号: ${Object.keys(tokens.fontSize).length}`);
  console.log(`  - 组件高度: ${Object.keys(tokens.componentHeight).length}`);

  // 3. 生成规则文件
  console.log('');
  console.log(`📝 生成规则文件: ${CONFIG.outputPath}`);
  const rulesContent = generateRules(tokens);

  const success = writeFile(CONFIG.outputPath, rulesContent);

  if (success) {
    console.log('');
    console.log('✅ 规则文件生成成功！');
    console.log('');
  } else {
    console.log('');
    console.log('❌ 规则文件生成失败');
    process.exit(1);
  }
}

// ==================== 命令行入口 ====================

if (require.main === module) {
  generate();
}

// 导出供其他模块使用
module.exports = {
  generate,
  CONFIG,
};
