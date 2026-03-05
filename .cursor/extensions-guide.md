# Cursor 已安装扩展说明

按用途分类，方便你了解每个插件是干什么的。

---

## 语言 / 框架支持

| 扩展 ID | 作用 |
|---------|------|
| **ms-python.python** | Python 语言支持（运行、调试、环境管理） |
| **ms-python.vscode-pylance** | Python 智能提示、类型检查、跳转定义 |
| **anysphere.cursorpyright** | Cursor 内置的 Python 类型检查（Pyright） |
| **ms-python.debugpy** | Python 调试器 |
| **vue.volar** | Vue 3 语言支持（语法高亮、补全、类型检查） |
| **dart-code.dart-code** | Dart 语言支持 |
| **amandeepmittal.pug** | Pug 模板语言支持（原 Jade） |
| **mgmcdermott.vscode-language-babel** | Babel 支持的 JS/TS 语法高亮 |
| **sysoev.language-stylus** | Stylus CSS 预处理器语法 |
| **syler.sass-indented** | Sass 缩进语法支持 |

---

## 代码片段 / 补全

| 扩展 ID | 作用 |
|---------|------|
| **abusaidm.html-snippets** | HTML 常用标签片段 |
| **xabikos.javascriptsnippets** | JavaScript 常用代码片段 |
| **hollowtree.vue-snippets** | Vue 基础片段 |
| **sdras.vue-vscode-snippets** | Vue 官方推荐片段（较全） |
| **nicholashsiang.vscode-vue2-snippets** | Vue 2 专用片段 |
| **mrmlnc.vscode-jade-snippets** | Jade/Pug 模板片段 |
| **yzhang.dictionary-completion** | 英文单词补全（类似字典） |
| **ecmel.vscode-html-css** | HTML/CSS 类名、选择器补全 |

---

## 格式化 / 美化

| 扩展 ID | 作用 |
|---------|------|
| **formulahendry.auto-close-tag** | 输入 `</` 时自动补全闭合标签 |
| **mrmlnc.vscode-pugbeautify** | Pug 代码格式化 |
| **keraun.vue-beautify2** | Vue 单文件组件格式化 |
| **iceworks-team.iceworks-style-helper** | 阿里飞冰：CSS/样式相关辅助 |

---

## Git / 版本控制

| 扩展 ID | 作用 |
|---------|------|
| **eamodio.gitlens** | Git 增强：行内 blame、历史、对比等 |
| **donjayamanne.githistory** | 查看 Git 提交历史、diff |

---

## Jupyter / 笔记本

| 扩展 ID | 作用 |
|---------|------|
| **ms-toolsai.jupyter** | Jupyter 笔记本支持（运行、调试） |
| **ms-toolsai.jupyter-keymap** | Jupyter 快捷键 |
| **ms-toolsai.jupyter-renderers** | 渲染 Mermaid、Plotly 等 |
| **ms-toolsai.vscode-jupyter-cell-tags** | 单元格标签 |
| **ms-toolsai.vscode-jupyter-slideshow** | 幻灯片模式 |

---

## 其他工具

| 扩展 ID | 作用 |
|---------|------|
| **christian-kohler.path-intellisense** | 写 `import`、`src` 时路径自动补全 |
| **techer.open-in-browser** | 右键用浏览器打开 HTML |
| **davidanson.vscode-markdownlint** | Markdown 语法/风格检查 |
| **yzhang.markdown-all-in-one** | Markdown 快捷键、预览、目录等 |
| **dbaeumer.vscode-eslint** | ESLint 代码检查 |
| **vscode-icons-team.vscode-icons** | 文件/文件夹图标主题 |
| **ms-ceintl.vscode-language-pack-zh-hans** | 界面中文语言包 |
| **bierner.markdown-preview-github-styles** | Markdown 预览使用 GitHub 样式 |

---

## 可能已弃用 / 重复

| 扩展 ID | 说明 |
|---------|------|
| **coenraads.bracket-pair-colorizer-2** | 括号配色，新版 VS Code/Cursor 已内置，可卸载 |
| **aminer.codegeex** | CodeGeex AI 补全，若已用 Cursor 可考虑禁用 |
| **mrmaoddxxaa.create-uniapp-view** | 创建 uni-app 页面模板，不用 uni-app 可禁用 |

---

## 建议

- **不用 Vue**：可禁用 hollowtree、sdras、nicholashsiang、keraun、volar
- **不用 Python/Jupyter**：可禁用 ms-python.*、ms-toolsai.*、cursorpyright
- **不用 Pug/Jade**：可禁用 amandeepmittal.pug、mrmlnc.*
- **想减少 HTML 提示**：可禁用 abusaidm.html-snippets、ecmel.vscode-html-css
