/**
 * 内容模型:Articles(文章) 与 Notes(随笔) 双 collection。
 * Astro 7 Content Layer API:defineCollection + glob loader + Zod schema。
 * frontmatter 编译期类型检查,两套 schema 各自独立。
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    /** 系列文章:系列名 */
    series: z.string().optional(),
    /** 系列内序号(从 1 起) */
    seriesOrder: z.number().optional(),
    draft: z.boolean().default(false),
    /** 封面图相对路径(可选,暂未展示) */
    cover: z.string().optional(),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles, notes };