# LIFANULTRA's Blog

Hexo 8，默认主题 LIFANULTRA 0.2。

## 本地使用

```sh
npm ci
npm run server
npm run build
```

## 直接发布生产版本

仓库只使用 `main` 分支，完整源码、文章和主题都保存在此分支。

```sh
git add .
git commit -m "Update blog"
git push origin main
```

推送后 Vercel 自动更新正式网站；GitHub Actions 同时构建并发布 GitHub Pages。无需 `source` 或 `gh-pages` 分支，不生成预览部署。

提交后也可使用 `npm run deploy` 或 `hexo deploy` 推送 `main`；这两个命令不会创建新分支。Vercel 构建使用北京时间，输出目录为 `public`。

主题与字体说明见 `themes/LIFANULTRA/README.md`。
