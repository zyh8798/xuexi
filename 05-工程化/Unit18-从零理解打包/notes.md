# Unit 18：从零理解打包（Webpack 与 Vite）

> 目标：理解为什么要打包，以及 Webpack 和 Vite 的核心差异。

## 一、为什么要打包？

1. **模块化支持**：浏览器原生支持 ES Modules 较晚，且请求过多性能差。
2. **资源转化**：将 Sass/Less 转为 CSS，将 ES6+ 转为 ES5（兼容性）。
3. **性能优化**：压缩代码、合并请求、按需加载。

## 二、Webpack 核心概念

Webpack 是一个 **静态模块打包工具**。

| 概念 | 作用 |
|------|------|
| **Entry** | 入口，Webpack 从这里开始构建依赖图。 |
| **Output** | 输出，打包后的文件放在哪里。 |
| **Loader** | 翻译官，让 Webpack 能处理非 JS 文件（如 css-loader, babel-loader）。 |
| **Plugin** | 插件，执行更广泛的任务（如 HtmlWebpackPlugin 生成 HTML，UglifyJsPlugin 压缩代码）。 |
| **Mode** | 模式，development（开发）或 production（生产）。 |

### 打包流程简述
1. **初始化**：读取配置，加载插件。
2. **编译**：从入口出发，递归解析依赖，调用 Loader 转化模块。
3. **输出**：根据依赖图生成 Chunk（代码块），最后输出 Bundle（文件）。

## 三、Vite 为什么快？

Vite 是 **下一代前端构建工具**。

### 1. 开发环境（Dev Server）
- **Webpack**：先打包，再启动服务器。代码越多，启动越慢。
- **Vite**：直接启动服务器，利用浏览器原生的 **ES Modules (ESM)**。浏览器请求哪个文件，服务器就实时转化并返回哪个文件。**真正的按需加载**。

### 2. 生产环境（Build）
- Vite 生产环境使用 **Rollup** 进行打包。

## 四、面试高频追问

### 1. Loader 和 Plugin 的区别？
- **Loader**：专注于 **文件转换**（A 文件转 B 文件）。
- **Plugin**：专注于 **功能增强**（在打包的各个生命周期钩子中执行特定任务）。

### 2. 什么是 Tree Shaking？
- **摇树优化**：在打包时剔除没有用到的代码。
- **前提**：必须使用 ES Modules（import/export），因为 ESM 是静态分析的。

---

## 五、自测练习

1. 能否口述 Webpack 的 5 个核心概念？
2. 为什么 Vite 在开发环境下比 Webpack 快得多？
3. 解释一下 Babel 是做什么的？
