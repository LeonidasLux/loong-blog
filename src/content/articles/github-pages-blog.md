---
title: '在 GitHub Pages 上免费托管你的博客'
date: 2026-07-30
tags: ['部署', 'Astro']
description: '静态站托管,GitHub Pages 是成本最低的选项。用 Actions 官方模式部署,而不是把构建产物直接推到分支。'
---

静态站托管,GitHub Pages 是成本最低的选项:免费、可绑定域名、自带 CDN。关键在于用 Actions 官方模式部署,而不是把构建产物直接推到分支。

```yaml
permissions:
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false

# checkout + setup-node(Node 24) + pnpm build
# + upload-pages-artifact + deploy-pages
```

部署流水线的关键点:

1. **产物来自 Actions**:`dist/` 不提交进仓库,由流水线构建后上传
2. **权限最小化**:只给 `pages: write` 与 `id-token: write`
3. **并发控制**:`concurrency.group: pages` 避免互相覆盖

2026 年 Pages Actions 升级到 v5 线(基于 Node 24 运行时),初期有部署异常的社区反馈。先验证 v5,异常就回退到 v4 组合并记录在案。