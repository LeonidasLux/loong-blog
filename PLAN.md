# loong-blog 开发计划文档

> 状态:已确认 ✅ | 更新:2026 年 8 月 | 托管:GitHub Pages

## 1. 项目概述

在 GitHub Pages 上托管一个个人博客,支持**文章(articles)**与**随笔(notes)**两种内容类型,采用 2026 年博客生态最主流的技术方案:静态优先、零 JS 依赖、类型安全的内容管理。

- 访问地址:`https://LeonidasLux.github.io/loong-blog/`(项目站点)
- 仓库:`LeonidasLux/loong-blog`,分支 `main` 为源码,Pages 由 GitHub Actions 构建部署

## 2. 技术选型(2026 年 8 月最新版本基线)

### 2.1 框架:Astro 7.2 + TypeScript

当前最新为 **Astro 7.2**(7.0 于 2026 年 6 月发布)。相比 Next.js(偏 SSR 应用)、Hugo(Go 模板老派)、Hexo(维护趋缓)、Jekyll(已停滞),Astro 是 2026 年内容类站点的绝对主流:

| 特性 | 说明 |
|---|---|
| **Rust 编译器 + Rust Markdown 流水线** | 构建速度比 v6 提升最高 61%,AST 处理更快 |
| **底层 Vite 8(Rolldown 打包器)** | 打包性能与产物质量全面提升 |
| **Content Layer API(唯一内容方式)** | Astro 7 已移除 legacy content collections,`defineCollection` + `glob()` loader + Zod schema 是唯一官方内容管理方式,frontmatter 编译期类型检查 |
| **默认零 JS + Islands 架构** | 静态输出 HTML;需要交互时才按需注入脚本 |
| **View Transitions** | 原生页面切换动画,博客浏览接近 SPA 体验 |

- **Node 要求**:≥ 22.12,推荐 **Node 24 LTS(当前 Active LTS,24.20.x)**,CI 与本地统一
- 包管理器:pnpm(最新稳定版,锁文件、速度快)

### 2.2 样式:Tailwind CSS v4.3(定制设计)

- 当前最新 **Tailwind CSS v4.3**(2026 年仍在 v4 主线迭代:4.2 引入 Webpack 插件、新色板、逻辑属性工具类;4.3 新增视觉类工具)
- 通过 `@tailwindcss/vite` 插件接入(**注意**:`astro add tailwind` 与 v4 不兼容,需手动配置)
- v4 的 CSS-first 配置:用 `@theme` 定义设计令牌(色板、字体、间距),不再需要 `tailwind.config.js`
- 暗色模式:使用 `@custom-variant dark (&:where(.dark, .dark *))` 以 class 策略切换,配无闪烁内联脚本 + `localStorage` 记忆

### 2.3 内容模型:两种文档类型

在 `src/content/` 下建两个 collection(Content Layer API + `glob` loader),各自独立 Zod schema:

| Collection | frontmatter 字段 | 定位 |
|---|---|---|
| `articles`(文章) | `title / date / tags / series / seriesOrder / description / draft / cover?` | 长文、技术博客、系列教程,默认展示 TOC |
| `notes`(随笔) | `title / date / tags / draft`(极简) | 短内容、碎碎念、灵感记录,不需要 TOC |

### 2.4 功能清单

| 功能 | 方案 | 说明 |
|---|---|---|
| giscus 评论 | giscus(GitHub Discussions 驱动) | 零后端;需在仓库启用 Discussions 并完成 giscus 一次性配置 |
| 全文搜索 | **Pagefind 1.5.x** | 构建后索引静态 HTML,前端自定义搜索弹窗(Pagefind JS API),无需后端 |
| RSS 订阅 | `@astrojs/rss` | `src/pages/rss.xml.ts` 生成,合并文章+随笔 |
| Sitemap / SEO | `@astrojs/sitemap` + 手写 meta | OpenGraph、Twitter Card、canonical |
| 暗色模式 | Tailwind v4 class 策略 | 明暗切换,记忆偏好 |
| 系列文章 | frontmatter `series` + `seriesOrder` | 文章详情页显示系列导航,系列聚合页 |
| 标签/归档 | 静态生成 `/tags/[tag]` 与 `/archives` | 按时间线归档 |
| 目录 TOC | Content Layer 渲染返回的 `headings` | 文章页自动生成,滚动联动可选 |
| 文章/随笔两种列表 | 首页 Tab 或分区 | 两种类型分开展示 |

### 2.5 部署:GitHub Actions 官方模式

```yaml
# .github/workflows/deploy.yml 要点(以官方 starter-workflows 为准,实施时锁定当时最新稳定版本)
permissions:
  pages: write        # 部署 Pages
  id-token: write     # 换取 Pages 部署令牌
concurrency:
  group: pages
  cancel-in-progress: false
steps:
  - checkout + setup-node(Node 24)+ pnpm install
  - pnpm build        # 含 pagefind 索引生成
  - actions/configure-pages
  - actions/upload-pages-artifact
  - actions/deploy-pages
```

**版本注意**:Pages Actions 系列 2026 年已升级到 **v5 线(基于 Node 24 运行时)**,但社区反馈 v5 上线初期存在部署异常,不少项目回滚到 v4(`configure-pages@v5`/`upload-pages-artifact@v4`/`deploy-pages@v4` 组合)。实施 M1 时以官方 [starter-workflows 的 static.yml](https://github.com/actions/starter-workflows/tree/main/pages) 为准,先验证 v5;若部署异常则回退 v4 并记录。

- `astro.config.mjs` 必须设置 `site` 与 `base: '/loong-blog/'`(项目站点路径)
- 仓库 Settings → Pages 选择 **GitHub Actions** 为发布来源

## 3. 项目结构规划

```
loong-blog/
├── .github/workflows/deploy.yml   # Pages 部署流水线
├── public/                        # favicon、og 图等静态资源
├── src/
│   ├── content/
│   │   ├── articles/              # 文章 Markdown
│   │   ├── notes/                 # 随笔 Markdown
│   │   └── config.ts              # 双 collection schema(Content Layer API)
│   ├── layouts/
│   │   └── BaseLayout.astro       # 全站骨架:header/footer/主题切换/ViewTransitions
│   ├── components/
│   │   ├── PostCard.astro         # 列表卡片(文章/随笔共用)
│   │   ├── TagList.astro          # 标签展示
│   │   ├── Toc.astro              # 文章目录
│   │   ├── SeriesNav.astro        # 系列导航
│   │   ├── ThemeToggle.astro      # 主题切换
│   │   ├── SearchDialog.astro     # 搜索弹窗(Pagefind)
│   │   └── Giscus.astro           # 评论
│   ├── lib/                       # 可复用纯逻辑/工具(不含 UI)
│   │   ├── date.ts                # 日期格式化
│   │   ├── url.ts                 # BASE_URL 安全拼接
│   │   └── tags.ts                # 标签聚合/排序
│   ├── pages/
│   │   ├── index.astro            # 首页(双类型列表)
│   │   ├── about.astro
│   │   ├── archives.astro         # 归档
│   │   ├── tags/[tag].astro       # 标签页
│   │   ├── series/index.astro     # 系列聚合
│   │   ├── rss.xml.ts
│   │   └── articles/[...slug].astro / notes/[...slug].astro  # 详情页
│   └── styles/                    # 样式按职责拆分,禁止全部堆入单个文件
│       ├── global.css             # 入口:仅 @import "tailwindcss" + 分片引入
│       ├── theme.css              # @theme 设计令牌 + @custom-variant 暗色
│       ├── base.css               # reset、全局基础排版、滚动条等
│       ├── typography.css         # 文章正文排版(prose)、代码块、表格
│       └── utilities.css          # 少量全局工具类扩展
├── astro.config.mjs
├── package.json
└── PLAN.md
```

### 3.1 工程约定:CSS 拆分与组件拆分

**CSS 拆分原则**(`src/styles/` 按职责分文件):

1. 单文件职责单一:`global.css` 只做入口聚合;设计令牌(`theme.css`)、基础样式(`base.css`)、正文排版(`typography.css`)、工具类(`utilities.css`)各自独立,后续新增样式先判断归属文件,禁止无脑追加到 `global.css`
2. **组件/页面级样式写在各自 `.astro` 文件的 `<style>` 内**(Astro 自带 scoped 作用域,自动加 hash,不会互相污染),只有跨页面复用的样式才进 `src/styles/`
3. 全局共享样式用 Tailwind v4 的 `@layer` 组织,保持优先级可控
4. Markdown 正文排版是重头戏,单独 `typography.css` 承载(标题层级、行高、代码块、引用块),不与其他样式混在一起

**组件拆分原则**(`src/components/`):

1. **单一职责**:每个组件只做一件事(列表项、目录、系列导航、主题切换、搜索弹窗、评论…),一个组件一个 `.astro` 文件,文件内同时携带自身 scoped 样式
2. **布局与页面分离**:`BaseLayout.astro` 只负责全站骨架(header/footer/主题切换/ViewTransitions),页面文件只组装布局 + 组件 + 数据
3. **数据与展示分离**:组件通过 Props 接收数据,不直接查 content collection;数据获取集中在页面/布局层(`getStaticPaths` 或前端脚本),组件保持纯展示、可复用
4. 列表项组件(如 `PostCard`)做到文章/随笔两种类型共用,差异用 Props 或判别字段控制
5. **可复用纯逻辑抽到 `src/lib/`**(日期格式化、URL 拼接、标签聚合),组件内不写重复工具函数
6. 组件 Props 一律用 TypeScript 接口显式声明,类型不明确时用 `satisfies`/联合类型约束

## 4. 里程碑规划

### M1 骨架搭建(目标:线上能打开)
- [ ] pnpm 初始化 + 安装 `astro@7`、`@tailwindcss/vite`、`tailwindcss@4`、`typescript`
- [ ] `astro.config.mjs`:site/base/viewTransitions/@tailwindcss/vite 插件
- [ ] `styles/` 拆分目录建立:`global.css`(入口)+ `theme.css`(@theme 设计令牌、暗色 `@custom-variant`)+ `base.css` + `typography.css` + `utilities.css`
- [ ] BaseLayout + 首页骨架 + 导航(页面/布局分离,首个组件拆分落地:`ThemeToggle` 等)
- [ ] deploy.yml 流水线 + 仓库 Pages 设置 → **第一次部署成功**(验证 Pages Actions v5,异常则回退 v4)

### M2 内容基建(目标:能写文章)
- [ ] content config:articles / notes 双 schema(Content Layer API)
- [ ] 组件拆分落地:`PostCard`(双类型共用)、`TagList`、`Toc`,数据获取在页面层、组件只收 Props
- [ ] 列表页与详情页(文章含 TOC、随笔简洁版)
- [ ] 标签页、归档页、about 页
- [ ] 写 1~2 篇示例文章验证全流程

### M3 功能完善(目标:博客功能齐全)
- [ ] 暗色模式切换(无闪烁)
- [ ] RSS + Sitemap + SEO meta
- [ ] giscus 评论(需要仓库启用 Discussions + giscus 配置)
- [ ] Pagefind 搜索(构建钩子 + 搜索弹窗)
- [ ] 系列文章:frontmatter、详情页导航、系列聚合页

### M4 打磨发布(目标:正式上线)
- [ ] 排版细节(font-feature、行高、代码块样式、阅读宽度)
- [ ] 性能检查(Lighthouse、图片优化 `astro:assets`)
- [ ] README 更新(写作指南:如何新建文章/随笔)
- [ ] 正式发布并验证部署产物

## 5. 待用户配合的事项

1. **启用 Discussions**:仓库 Settings → General → Discussions(开启后 giscus 才能工作)
2. **Pages 设置**:Settings → Pages → Source 选 **GitHub Actions**
3. **自定义域名**(可选):若绑域名,告知后调整 `site` 配置
4. **博客名/标语**:首页展示文案,当前暂用 "loong-blog",可随时改

## 6. 风险与对策

| 风险 | 对策 |
|---|---|
| Tailwind v4 与 Astro 集成坑 | 不走 `astro add`,手动装 `@tailwindcss/vite`;计划已记录 |
| Astro 7 新架构(legacy collections 移除)不熟悉 | 项目全新起步,直接按 Content Layer API 官方范式开发,无迁移负担 |
| Pages Actions v5 部署异常(社区已有多例回滚) | M1 先验证 v5;异常即回退 v4 组合并记录在案 |
| Pagefind 在 GitHub Actions 中索引失败 | 构建脚本内集成 `pagefind --site dist`,并在本地预演 |
| giscus 依赖仓库配置 | 提前启用 Discussions;未配置时评论组件优雅隐藏 |
| 项目站点 404 路径问题 | 严格使用 `base` + `import.meta.env.BASE_URL` 拼接资源路径 |

## 7. 版本基线(2026-08 核实)

| 组件 | 版本 | 备注 |
|---|---|---|
| Astro | 7.2.x | 7.0 起 Rust 编译器 + Rust Markdown + Vite 8 |
| Vite | 8.x | Rolldown 打包器内核 |
| Tailwind CSS | 4.3.x | v4 CSS-first 配置线 |
| Pagefind | 1.5.x | 静态站全文索引 |
| Node.js | 24 LTS(24.20.x) | 当前 Active LTS |
| @astrojs/rss / @astrojs/sitemap | 最新 | 随 Astro 7 配套版本 |
| GitHub Pages Actions | v5 线(备选 v4) | 2026-04 前后升级 Node 24,曾有回滚案例 |

> 说明:实施各里程碑时,以实际 `npm view <pkg> version` 输出的最新稳定版为准,上述为调研快照基线。