import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { withBase } from '../lib/url';
import { sortByDate, withoutDrafts } from '../lib/tags';

export async function GET(context: APIContext) {
  const [articles, notes] = await Promise.all([
    getCollection('articles'),
    getCollection('notes'),
  ]);
  const posts = sortByDate(withoutDrafts([...articles, ...notes]));

  return rss({
    title: 'loong-blog',
    description: '关于 Astro、前端工程与长期主义的记录——长文沉下去,随笔浮上来。',
    site: context.site ?? 'https://LeonidasLux.github.io',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: withBase(`/${post.collection}/${post.id}`),
      categories: post.data.tags,
    })),
    customData: '<language>zh-CN</language>',
  });
}