 <div align="center">

<img src="https://github.com/user-attachments/assets/c111204d-2016-4343-92e4-83357cac4b19" width="96" height="96" alt="NotionNext Logo" />

# NotionNext

一个使用 Next.js + Notion API 构建的高颜值静态博客系统

为 Notion 与所有创作者设计 ✨

<p>
  <a href="https://preview.tangly1024.com/">
    在线预览
  </a>
  ·
  <a href="https://docs.tangly1024.com/">
    文档
  </a>
  ·
  <a href="./CONTRIBUTING.md">
    参与贡献
  </a>
</p>

</div>

---
# 帮助教程

> 本项目为免费、公开资源，仅限个人学习使用，禁止利用本教程建立的博客发布非法内容、进行违法犯罪活动。

Notion是一个能让效率暴涨的生产力引擎，可以帮你书写文档、管理笔记，搭建知识库，甚至可以为你规划项目、时间管理、组织团队、提高生产力、还有当前最强大的AI技术加持。

# NotionNext

<p>
  <a aria-label="GitHub commit activity" href="https://github.com/notionnext-org/NotionNext/commits/main" title="GitHub commit activity">
    <img src="https://img.shields.io/github/commit-activity/m/notionnext-org/NotionNext?style=for-the-badge"/>
  </a>
  <a aria-label="GitHub contributors" href="https://github.com/notionnext-org/NotionNext/graphs/contributors" title="GitHub contributors">
    <img src="https://img.shields.io/github/contributors/notionnext-org/NotionNext?color=orange&style=for-the-badge"/>
  </a>
  <a aria-label="Build status" href="#" title="Build status">
    <img src="https://img.shields.io/github/deployments/notionnext-org/NotionNext/Production?logo=Vercel&style=for-the-badge"/>
  </a>
  <a aria-label="Powered by Vercel" href="https://vercel.com?utm_source=Craigary&utm_campaign=oss" title="Powered by Vercel">
    <img src="https://www.datocms-assets.com/31049/1618983297-powered-by-vercel.svg" height="28"/>
  </a>
</p>

中文文档 | [README in English](./README_EN.md)

<hr/>

一个使用 NextJS + Notion API 实现的，部署在 Vercel 上的静态博客系统。为Notion和所有创作者设计。

**仓库托管：** 主仓库现由 GitHub 组织 **[notionnext-org](https://github.com/notionnext-org)** 维护（canonical：`https://github.com/notionnext-org/NotionNext`）。欢迎参与贡献并关注组织内协作说明；若在转让前已克隆本地仓库，建议执行 `git remote set-url origin https://github.com/notionnext-org/NotionNext.git` 后使用 `git remote -v` 确认。

支持多种部署方案

## 新开发者 3 分钟上手

```bash
# 1) 使用 Node 20（建议先安装 nvm）
nvm use || nvm install

# 2) 安装 Yarn（若未安装）
npm i -g yarn

# 3) 安装依赖并启动开发
yarn
yarn dev
```

常用命令：

- 本地开发：`yarn dev`
- 打包构建：`yarn build`
- 静态导出：`yarn export`

说明：本地开发保持简单（`yarn` 即可）；锁文件一致性由 CI 严格校验。

## 开发者文档导航

为方便新贡献者快速上手，项目已补充文档导航与协作规范：

- [文档导航入口（中文）](./docs/README.md)
- [社区官网能力扩展路线](./docs/COMMUNITY_SITE_ROADMAP.md)
- [Docs Navigation (English)](./docs/README.en.md)
- [主题迁移指南（中文）](./docs/THEME_MIGRATION_GUIDE.zh-CN.md)
- [Theme Migration Guide (English)](./docs/THEME_MIGRATION_GUIDE.md)
- [贡献入口（中文）](./CONTRIBUTING.zh-CN.md)
- [贡献入口（英文）](./CONTRIBUTING.md)
- [维护与变更尺度（中文）](./docs/MAINTENANCE_PHILOSOPHY.zh-CN.md)
- [Maintenance & change control (English)](./docs/MAINTENANCE_PHILOSOPHY.en.md)

## 预览效果

在线演示：[https://preview.tangly1024.com/](https://preview.tangly1024.com/) ，点击左下角挂件可以切换主题，没找到喜欢的主题？[贡献](/CONTRIBUTING.md)一个吧~

| Next                                                                                                  | Medium                                                                                                      | Hexo                                                                                                  | Fukasawa                                                                                                          |
| ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| <img src='./docs/theme-next.png' width='300'/> [预览NEXT](https://preview.tangly1024.com/?theme=next) | <img src='./docs/theme-medium.png' width='300'/> [预览MEDIUM](https://preview.tangly1024.com/?theme=medium) | <img src='./docs/theme-hexo.png' width='300'/> [预览HEXO](https://preview.tangly1024.com/?theme=hexo) | <img src='./docs/theme-fukasawa.png' width='300'/> [预览FUKASAWA](https://preview.tangly1024.com/?theme=fukasawa) |

## 致谢

感谢Craig Hart发起的Nobelium项目

<table><tr align="left">
  <td align="center"><a href="https://github.com/craigary" title="Craig Hart"><img src="https://avatars.githubusercontent.com/u/10571717" width="64px;"alt="Craig Hart"/></a><br/><a href="https://github.com/craigary" title="Craig Hart">Craig Hart</a></td>
</tr></table>

## 贡献者

致敬每一位开发者！

[![Contributors](https://contrib.rocks/image?repo=notionnext-org/NotionNext)](https://github.com/notionnext-org/NotionNext/graphs/contributors)

## 引用技术

- **框架**: [Next.js](https://nextjs.org)
- **样式**: [Tailwind CSS](https://www.tailwindcss.cn/)
- **渲染**: [React-notion-x](https://github.com/NotionX/react-notion-x)
- **评论**: [Twikoo](https://github.com/imaegoo/twikoo), [Giscus](https://giscus.app/zh-CN), [Gitalk](https://gitalk.github.io), [Cusdis](https://cusdis.com), [Utterances](https://utteranc.es)
- **图标**: [Fontawesome](https://fontawesome.com/v6/icons/)

## 🔗 友情链接

- [Elog](https://github.com/LetTTGACO/elog) Markdown 批量导出工具、开放式跨平台博客解决方案，随意组合写作平台(语雀/Notion/FlowUs/飞书)和博客平台(Hexo/Vitepress/Halo/Confluence/WordPress等)

## License

The MIT License.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=notionnext-org/NotionNext&type=Date)](https://star-history.com/#notionnext-org/NotionNext&Date)
