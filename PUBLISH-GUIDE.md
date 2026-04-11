# 发布指南

本指南帮助你将 `react-ai-monorepo` 发布到 npm 包管理平台。

## 前置准备

### 1. 注册 npm 账号

访问 [npmjs.com](https://www.npmjs.com/) 注册账号。

### 2. 登录 npm

```bash
npm login
```

### 3. 确认包名是否可用

访问 [npmjs.com](https://www.npmjs.com/) 搜索你想要的包名，确认未被占用。

## 修改配置

### 更新 package.json

编辑 `package.json`，修改以下字段：

```json
{
  "name": "your-package-name",           // 修改为你的包名
  "version": "1.0.0",                 // 确保版本号正确
  "description": "你的包描述",
  "author": "Your Name <email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/your-repo.git"
  },
  "bugs": {
    "url": "https://github.com/your-username/your-repo/issues"
  },
  "homepage": "https://github.com/your-username/your-repo#readme"
}
```

### 包名命名规范

- 简单名称: `react-ai-mono`
- Scope 名称: `@your-scope/react-ai-mono`（需要付费才能发布私有包，公开包需使用 `--access public`）

建议使用: `react-ai-monorepo` 或你的 scope

### 更新 CLI 入口文件

编辑 `cli.js`，修改包名：

```javascript
const CONFIG = {
  name: 'your-package-name',  // 修改为你的包名
  version: require('../package.json').version,
};
```

## 发布前检查

### 1. 检查要发布的文件

```bash
# 查看将要发布的文件列表
npm pack --dry-run

# 或使用
npx publish-dry-run
```

### 2. 本地测试

```bash
# 全局安装本地包测试
npm install -g .

# 测试命令
your-package-name init
your-package-name shadcn button

# 或使用 npx 测试
npx . init
```

### 3. 确保依赖正确

```bash
# 安装依赖
npm install

# 运行测试
npm test
```

## 发布

### 发布公开包

```bash
npm publish
```

如果你的包使用了 scope（如 `@your-scope/name`），需要显式声明公开：

```bash
npm publish --access public
```

### 发布 beta 版本

```bash
# 修改 package.json 中的版本号为 beta
# "version": "1.0.0-beta.1"

npm publish --tag beta
```

### 发布 alpha 版本

```bash
# "version": "1.0.0-alpha.1"

npm publish --tag alpha
```

## 版本管理

### 版本号格式

遵循 [语义化版本规范 (SemVer)](https://semver.org/):

- `1.0.0` - 主版本号.次版本号.修订号
- `1.0.1` - Bug 修复
- `1.1.0` - 新功能，向下兼容
- `2.0.0` - 重大变更，可能不兼容

### 更新版本

```bash
# 自动递增版本号
npm version patch    # 1.0.0 -> 1.0.1
npm version minor    # 1.0.0 -> 1.1.0
npm version major    # 1.0.0 -> 2.0.0

# 或指定版本号
npm version 1.2.3
```

然后重新发布：

```bash
npm publish
```

## 发布后验证

### 1. 在 npm 上查看

访问 https://www.npmjs.com/package/your-package-name

### 2. 使用 npx 测试

```bash
# 在新目录中测试
cd /tmp
mkdir test-project && cd test-project

npx your-package-name init
```

### 3. 检查版本

```bash
npm view your-package-name
```

## 使用

### 全局安装后使用

```bash
npm install -g your-package-name

your-package-name init
your-package-name shadcn button
```

### 使用 npx（推荐）

```bash
npx your-package-name init
```

### 在项目中使用

```bash
# 在项目中安装
npm install -D your-package-name

# 使用
npx your-package-name init
```

## 更新已发布的包

1. 修改代码
2. 更新 `package.json` 中的版本号
3. 提交代码到 Git
4. 创建 Git tag（可选）
5. 运行 `npm publish`

## 撤回发布

### 撤回最新版本（24小时内）

```bash
npm unpublish your-package-name@1.0.0
```

### 撤回整个包（72小时内）

```bash
npm unpublish your-package-name --force
```

⚠️ **注意**: npm 限制撤回功能，请谨慎发布。

## 故障排除

### 版本号冲突

如果遇到版本号冲突，更新 package.json 中的版本号：

```json
{
  "version": "1.0.1"
}
```

### 需要两步验证

如果 npm 要求两步验证：

1. 访问 [npm 账户设置](https://www.npmjs.com/settings/authentication)
2. 启用两步验证
3. 生成并使用一次性密码

### 权限问题

确保你有发布该包的权限：

```bash
npm whoami  # 查看当前登录的用户
npm owner ls your-package-name  # 查看包的所有者
```

## CI/CD 自动发布

### GitHub Actions 示例

创建 `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

在 GitHub 仓库设置中添加 `NPM_TOKEN` secret。

## 参考资料

- [npm 官方文档](https://docs.npmjs.com/)
- [语义化版本规范](https://semver.org/)
- [package.json 配置](https://docs.npmjs.com/cli/v9/configuring-npm/package-json)
