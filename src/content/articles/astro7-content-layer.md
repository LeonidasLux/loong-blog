---
title: 'Astro 7 内容层:Content Layer API 从零上手'
date: 2026-08-21
tags: ['Astro', '前端']
description: 'Astro 7 移除了 legacy content collections,Content Layer API 成为唯一的内容管理方式。这篇文章用一个真实博客的例子,走完定义 schema、加载内容、类型安全查询的全流程。'
---

Astro 7 在 2026 年 6 月正式发布,最大的变化之一是彻底移除了 legacy content collections。此前基于 `src/content/config.ts` 的旧写法退出历史舞台,`defineCollection` + `glob()` loader 成为唯一官方的内容管理方式。这篇文章用当前这个博客的例子,走一遍完整流程。

## 为什么是 Content Layer API

旧版 content collections 把「文件位置」和「数据类型」绑在一起——文章必须放在固定的目录下,字段校验在编译期完成,但灵活度有限。Content Layer API 把「数据从哪里来」与「数据长什么样」彻底解耦:数据可以来自本地 Markdown、远程 API、甚至数据库,loader 负责加载,Zod schema 负责校验。

对个人博客来说,最直接的好处是:frontmatter 写错了类型,构建直接报错,不会带着错误上线。类型安全从编译期开始。

## 定义集合 Schema

```ts
import { defineCollection, glob } from 'astro:content';
import { z } from 'astro:schema';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles, notes };
```

字段都被显式声明:`title` 必须是字符串,`date` 会被自动转成 Date,`tags` 默认空数组,`draft` 控制是否发布。随笔集合的 schema 更简,只有 title、date、tags、draft 四项。

## 用 glob() 加载内容

loader 是这套 API 的核心。glob loader 接收一个 glob 模式,把所有匹配的 Markdown 文件加载成 entry,并替你处理 frontmatter 解析、相对路径、图片导入等杂活。

| 能力 | 旧 collections | Content Layer API |
|---|---|---|
| 数据来源 | 仅本地文件 | 本地 + 远程 + 数据库 |
| 字段校验 | Zod schema | Zod schema |
| 自定义 loader | 不支持 | 支持任意数据源 |
| 图片处理 | 内置 | 内置 + image() |

## 在页面中类型安全地查询

```ts
import { getCollection } from 'astro:content';

const posts = await getCollection('articles', ({ data }) => !data.draft);
posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
```

查询结果自带完整类型——`data.title` 是 string,`data.date` 是 Date,IDE 补全与编译期检查同时生效。列表页、标签页、归档页的聚合逻辑都可以从这里长出来。

## 小结

> 类型安全不是约束,而是脚手架——它让我敢写更长的文章,因为结构性问题在构建期就暴露了。

Astro 7 的内容层把这个体验做到了默认配置:没有迁移负担,没有额外插件,新建一篇 Markdown 就自动进入类型系统。下一篇我会写 Tailwind v4 与 Astro 的集成,把它接到这个博客上。