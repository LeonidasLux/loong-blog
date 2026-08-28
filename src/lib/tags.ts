/** 标签聚合与排序工具(纯逻辑,不含 UI) */
import type { CollectionEntry } from 'astro:content';

export type AnyPost = CollectionEntry<'articles'> | CollectionEntry<'notes'>;

export interface TagInfo {
  name: string;
  count: number;
}

/** 合并文章+随笔,按 name 排序(中文优先拼音序) */
export function aggregateTags(posts: AnyPost[]): TagInfo[] {
  const counts = new Map<string, number>();
  for (const p of posts) {
    for (const name of p.data.tags ?? []) {
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'));
}

/** 按日期倒序(新在前);保留传入的具体 collection 类型 */
export function sortByDate<T extends AnyPost>(posts: T[]): T[] {
  return [...posts].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** 过滤草稿;保留传入的具体 collection 类型 */
export function withoutDrafts<T extends AnyPost>(posts: T[]): T[] {
  return posts.filter((p) => !p.data.draft);
}