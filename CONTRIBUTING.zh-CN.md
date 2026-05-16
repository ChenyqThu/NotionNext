# 贡献指南（中文）

- [仓库与组织](#仓库与组织)
- [环境准备](#环境准备)
- [新建主题](#新建主题)
- [新增语言](#新增语言)
- [环境变量](#环境变量)

感谢你愿意为 NotionNext 做贡献！

## 仓库与组织

本仓库已由**个人账号**托管转为 **[GitHub 组织 notionnext-org](https://github.com/notionnext-org)** 管理，canonical 地址为：

**https://github.com/notionnext-org/NotionNext**

若你希望参与长期维护、CI 或组织内协作，可关注组织主页说明并申请加入（具体以组织公告为准）。**欢迎加入组织**，与维护者一起推进项目。

若你仍在使用转让前克隆的本地仓库，建议将默认远端改为组织地址，避免长期依赖旧 URL 重定向：

```bash
git remote set-url origin https://github.com/notionnext-org/NotionNext.git
git remote -v
```

Fork 开发与向 `main` 提 PR 的流程不变；PR 的目标仓库请选择 **notionnext-org/NotionNext**。

## 环境准备

请按以下流程参与开发：

1. 在 GitHub 上 Fork 仓库。
2. 克隆到本地（或使用 Codespaces）。
3. 为本次任务创建独立分支。
4. 完成功能或修复并本地验证。
5. 提交并推送分支。
6. 发起 PR 到 NotionNext 的 `main` 分支。

常用命令：

- `yarn`：安装依赖
- `yarn dev`：本地开发
- `yarn build`：生产构建
- `yarn start`：生产模式运行

## 必须遵守的协作规则

1. 每个任务使用独立分支，禁止直接提交到 `main`。
2. PR 保持聚焦，避免把无关重构混在一起。
3. 不要提交个人本地文件（如 `.env.local`）。
4. 不要提交会影响他人的个性化默认配置。
5. 提交前至少执行 lint / type-check / 必要测试。

维护者与高频贡献者请阅读 [维护与变更尺度（共识）](./docs/MAINTENANCE_PHILOSOPHY.zh-CN.md)，避免大范围、难回滚的改动影响主线稳定。

更多文档导航：

- [文档导航入口（中文）](./docs/README.md)
- [Docs Navigation (English)](./docs/README.en.md)
- [主题迁移指南（中文）](./docs/THEME_MIGRATION_GUIDE.zh-CN.md)
- [Theme Migration Guide (English)](./docs/THEME_MIGRATION_GUIDE.md)

## 新建主题

如果要贡献新主题，请以 `themes/example` 为基础复制一个新目录，目录名即主题 key。

## 新增语言

如需新增本地化语言：

1. 复制 `lib/lang/en-US.js` 并按语言代码重命名（如 `zh-CN.js`）。
2. 完成文本翻译。
3. 在 `lib/lang.js` 注册该语言。
4. 提交 PR。

## 环境变量

1. 复制 `.env.example` 为 `.env.local`。
2. 按需填写配置。
3. 不要提交 `.env.local`。

配置优先级：

1. Notion 配置表（最高）
2. 环境变量
3. `blog.config.js`（最低）
