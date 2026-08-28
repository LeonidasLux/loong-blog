// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * loong-blog · Astro 7 配置
 * - site/base:GitHub Pages 项目站点路径 /loong-blog/
 * - tailwind v4 手动接入(不走 astro add,与 v4 兼容)
 * - sitemap:构建时自动生成 sitemap-index.xml
 *
 * View Transitions 不在 config 中配置,由布局内的 <ClientRouter /> 组件提供。
 */
export default defineConfig({
  site: 'https://LeonidasLux.github.io',
  base: '/loong-blog/',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      // 双主题:html.dark 下代码块自动切换暗色配色
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
});