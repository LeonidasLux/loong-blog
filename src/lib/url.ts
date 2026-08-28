/** URL 工具:项目站点 GitHub Pages base 路径安全拼接 */

/**
 * 把应用内绝对路径接到 BASE_URL 上。
 * GitHub Pages 项目站点下 base = '/loong-blog/',页面内链接必须带该前缀,
 * 否则部署后 404。例:withBase('/archives') → '/loong-blog/archives'
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const b = base.endsWith('/') ? base : base + '/';
  return b + path.replace(/^\/+/, '');
}

/** 生成文章/随笔详情页绝对路径(<a href> 用) */
export function postHref(type: 'articles' | 'notes', slug: string): string {
  return withBase(`/${type}/${slug}`);
}