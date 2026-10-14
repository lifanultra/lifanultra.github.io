# LIFANULTRA

版本：0.2（package version 0.2.0）。本站默认主题。

保留响应式布局、定时深浅模式、绿色链接、公文字体层级、代码复制与数学公式。主题目录为 `themes/LIFANULTRA`，站点配置为 `theme: LIFANULTRA`。

浏览器使用的脚本、样式和字体均随主题发布：jQuery、Clipboard、Font Awesome、Justified Gallery 位于 `source/lib/`；MathJax 2.7.5 的完整运行资源位于 `source/lib/mathjax/`，包括配置、扩展、字体和按需加载模块。

公文字体切片保存在 `source/fonts/document/`，由 `source/css/fonts-local.css` 引用，保留原有字体别名、字重、字符范围与本机字体优先规则。文件大小和 SHA-256 校验值见 `source/fonts/local-assets.json`。构建无需下载 CDN 资源。浏览器将第三方脚本、样式、字体及 MathJax 后续模块的本地地址与固定版本 CDN 同时请求，采用先完整下载成功的一份，并取消另一份。脚本只执行一次，依赖按顺序执行；单侧失败不会抢占成功结果。竞争使用 Service Worker，不支持或禁用此能力时直接使用本地资源。

原始代码的版权及 MIT 许可保存在 LICENSE 中。
