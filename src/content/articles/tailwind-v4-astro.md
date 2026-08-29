---
title: 'Tailwind CSS v4 与 Astro 的正确集成方式'
date: 2026-08-14
tags: ['Tailwind', 'Astro']
description: 'astro add tailwind 在 v4 时代已经不适用。CSS-first 配置、@theme 设计令牌与 class 暗色策略,一条路走通。'
---

`astro add tailwind` 在 v4 时代已经不适用了。v4 采用 CSS-first 配置,把一切交还给 CSS 文件。集成方式变成手动安装两个包,并在 `astro.config.mjs` 里挂上 Vite 插件。

```bash
npm install tailwindcss @tailwindcss/vite
```

```js
// astro.config.mjs
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: { plugins: [tailwindcss()] },
});
```

之后,设计令牌全部写进 `@theme` 块,不再需要 `tailwind.config.js`。暗色模式用 `@custom-variant dark` 加 class 策略实现,配合首帧内联脚本记忆偏好、杜绝闪烁。

三步即可完成:

1. **安装依赖**:`tailwindcss` 与 `@tailwindcss/vite` 两个包
2. **挂载插件**:在 Astro 的 Vite 配置中启用
3. **定义令牌**:在 `@theme` 与 `@custom-variant` 中宣告设计与暗色策略

这套组合让「CSS 文件即配置」成为现实——字体、颜色、间距、圆角全部集中在设计令牌里,视觉一致性不再是靠纪律,而是靠结构。