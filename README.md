# loong-blog

个人博客:长文(**articles**)与随笔(**notes**)两种内容,基于 **Astro 7 + Tailwind v4**,托管于 **GitHub Pages**。

- 在线地址:`https://LeonidasLux.github.io/loong-blog/`
- 开发规划见 [`PLAN.md`](./PLAN.md)
- 视觉原型:`Web-Prototype/` 目录(editorial-monocle 设计方向)

## 技术栈

| 组件 | 版本 | 说明 |
|---|---|---|
| Astro | 7.x | Content Layer API + Zod schema,静态输出、零 JS 默认 |
| Tailwind CSS | 4.x | CSS-first 配置,`@theme` 设计令牌 + class 暗色策略 |
| Pagefind | 1.5.x | 构建后全文索引,前端搜索弹窗 |
| giscus | — | GitHub Discussions 评论(待仓库启用后接入) |
| Node.js | 24 LTS | CI 与本地统一(需 ≥ 22.12) |
| pnpm | 10.x | 包管理 |

## 本地开发

```bash
pnpm install        # 安装依赖
pnpm dev            # 启动开发服务器(http://localhost:4321/loong-blog/)
pnpm build          # 构建 + 生成 pagefind 索引(dist/)
pnpm preview        # 预览构建产物
pnpm check          # astro 类型检查(astro check)
```

## ✍️ 写作指南

### 新建一篇文章

在 `src/content/articles/` 下新建 `.md` 文件(文件名即 slug,如 `my-first-post.md`):

```md
---
title: '我的第一篇文章'
date: 2026-08-28
description: '一句话摘要,用于详情页导语与 SEO 描述。'
tags: ['Astro', '前端']
draft: false          # 可选:true 则不发布
---

正文用 Markdown 写。二级/三级标题会自动生成目录(TOC)。
```

### 新建一篇随笔

在 `src/content/notes/` 下新建 `.md`,frontmatter 更简(`title / date / tags / draft`,可选 `description`),正文不需要长文结构。

### 常用 frontmatter 字段

| 字段 | 类型 | articles | notes | 说明 |
|---|---|---|---|---|
| `title` | string | ✅ | ✅ | 标题 |
| `date` | string(YYYY-MM-DD) | ✅ | ✅ | 发布日期 |
| `description` | string | 可选 | 可选 | 详情页导语 / SEO 描述 |
| `tags` | string[] | ✅ | ✅ | 标签 |
| `draft` | boolean | 可选 | 可选 | 草稿不发布 |

> 字段校验在构建期自动执行(Content Layer API + Zod),类型写错会直接报错。

## 内容发布

1. 写完 Markdown 后 `pnpm build` 本地验证
2. `git add . && git commit -m "新增文章:xxx"`
3. `git push` → GitHub Actions 自动构建部署到 Pages

## 仓库设置(一次性)

### 1. 启用 GitHub Pages

Settings → Pages → **Source 选 `GitHub Actions`**(部署已由 `.github/workflows/deploy.yml` 流水线接管)。

### 2. 接入 giscus 评论(可选,需捐赠配置)

1. 仓库 Settings → General → 开启 **Discussions**
2. 在 https://giscus.app 完成向导,得到四个配置值
3. 在 GitHub Actions 的 **Settings → Secrets and variables → Actions** 添加 Repository secrets:
   - `GISCUS_REPO` = `owner/repo`
   - `GISCUS_REPO_ID`
   - `GISCUS_CATEGORY`
   - `GISCUS_CATEGORY_ID`
4. 未配置时评论区域自动显示占位说明,不加载任何第三方脚本。

### 3. 自定义域名(可选)

绑定域名后修改 `astro.config.mjs` 的 `site` 值即可。

## 目录结构

```
src/
├── content.config.ts       # 双 collection schema(Content Layer API)
├── content/articles/       # 文章 Markdown
├── content/notes/          # 随笔 Markdown
├── layouts/BaseLayout.astro# 全站骨架(导航/主题切换/SEO)
├── components/             # PostCard / Toc / ThemeToggle / SearchDialog / Giscus / TagList / ActivityHeatmap
├── lib/                    # 纯逻辑(date/url/tags/reading)
├── pages/                  # 首页、归档、标签、关于、RSS、详情页
└── styles/                 # CSS 按职责拆分(theme/base/typography/utilities/global)
```

## 约定

- **CSS 拆分**:`global.css` 只做入口聚合;组件/页面样式写在各 `.astro` 的 scoped `<style>` 内;跨页面复用进 `src/styles/`
- **组件拆组**:组件只收 Props,数据获取集中在页面层;纯逻辑抽到 `src/lib/`
- 新增样式先判断归属文件,禁止无脑追加到 `global.css`