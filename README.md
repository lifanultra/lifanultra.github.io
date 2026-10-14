# LIFANULTRA 博客

Hexo 8，默认主题 LIFANULTRA 0.2。

## 本地使用

```sh
npm ci
npm run server
npm run build
npm run deploy
```

源码分支为 `source`；GitHub Pages 从 `gh-pages` 发布。Vercel 应从 `source` 分支构建，项目根目录为仓库根目录，构建命令 `npm run build`，输出目录 `public`。不要把旧网站的 `main` 分支设为生产分支。

主题与字体说明见 `themes/LIFANULTRA/README.md`。
