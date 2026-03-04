# AGENTS.md

本项目为前端进阶学习教程仓库，包含 JavaScript 基础学习示例和笔记。

## 项目结构

```
tenThoutsand/
├── 00-学习指南/          # 学习计划与工具使用指南
├── 01-JavaScript基础/   # JavaScript 核心知识
│   ├── Unit1-作用域闭包this/
│   ├── Unit2-原型链继承/
│   ├── Unit3-事件循环宏任务微任务/
│   ├── Unit4-Promise与async-await/
│   └── Unit5-数组对象API与手写题/
├── 04-网络知识/          # HTTP/网络协议学习
├── .cursor/skills/       # Cursor 增强技能
└── README.md
```

每个 Unit 目录结构：
- `notes.md` - 知识点笔记
- `examples/*.js` - 代码示例
- `quiz.md` - 测验题
- `exam-*.md` - 单元测试

---

## 运行与测试

### 运行 JavaScript 示例

```bash
# 运行单个示例文件
node 01-JavaScript基础/Unit1-作用域闭包this/examples/02-闭包.js

# 使用相对路径
cd 01-JavaScript基础/Unit1-作用域闭包this/examples
node 02-闭包.js
```

### 学习顺序

每个 Unit 的学习流程：
1. 阅读 `notes.md` 理解概念
2. 运行 `examples/*.js` 调试学习
3. 完成 `quiz.md` 自测
4. 完成 `exam-*.md` 单元测试

---

## 代码风格指南

本项目遵循以下 JavaScript 编码规范：

### 1. 文件命名

- 使用中文命名：`深拷贝与防抖节流.js`
- 示例编号前缀：`01-深拷贝.js`、`02-继承.js`

### 2. 注释规范

```javascript
/**
 * Unit 5 - 深拷贝、防抖、节流示例
 * 运行：node 01-深拷贝与防抖节流.js
 */

// 行内注释用于解释关键逻辑
const res = Array.isArray(obj) ? [] : {}; // 数组或对象
```

### 3. 函数定义

- 使用 `function` 声明或箭头函数
- 参数使用 `...args` 处理可变参数
- 保持函数单一职责

```javascript
// 防抖函数
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

### 4. 变量命名

- 变量/函数：camelCase (`deepClone`, `createCounter`)
- 常量：UPPER_SNAKE_CASE（如有）
- 私有变量：下划线前缀 `_money`（约定）

### 5. 对象操作

- 使用 `Object.prototype.hasOwnProperty.call()` 检查属性
- 使用 `Map` 处理循环引用

```javascript
for (const key in obj) {
  if (Object.prototype.hasOwnProperty.call(obj, key)) {
    res[key] = deepClone(obj[key], map);
  }
}
```

### 6. 错误处理

- 使用 `try-catch` 捕获异步错误
- 合理使用 `console.log` 输出调试信息

```javascript
try {
  const result = await asyncOperation();
  console.log('结果:', result);
} catch (error) {
  console.error('错误:', error.message);
}
```

### 7. 格式规范

- 缩进：2 空格
- 语句结尾不加分号（除必要时）
- 字符串优先使用单引号
- 模板字符串用于字符串拼接

### 8. ES6+ 特性

推荐使用：
- `const` / `let` 代替 `var`
- 箭头函数
- 模板字符串
- 解构赋值
- `async/await`
- 展开运算符 `...`

---

## Git 提交规范

### 约定式提交 (Conventional Commits)

使用以下格式：

```
<type>(<scope>): <subject>

<body>
```

### Type 类型

| 类型     | 说明                     |
|----------|--------------------------|
| feat     | 新功能                   |
| fix      | 修复 bug                 |
| docs     | 文档                     |
| style    | 格式（不影响逻辑）       |
| refactor | 重构                    |
| test     | 测试                    |
| chore    | 构建/工具等              |

### 规则

1. **subject**：不超过 50 字，祈使句、首字母小写、句末无句号
2. **scope**：可选，表示影响范围（如模块名）
3. **body**：可选，说明动机与改动细节，每行 72 字内
4. **⚠️ 每次提交后必须执行 `git push`**

### 示例

```
feat(unit1): 添加闭包示例代码

- 新增 createCounter 计数器示例
- 添加模块模式实现
```

```
fix(deepClone): 修复循环引用导致的栈溢出

使用 Map 记录已拷贝对象
```

---

## Cursor 工具使用

### 模式选择

| 需求                | 推荐模式 |
|---------------------|----------|
| 学习概念、问原理    | Ask      |
| 写代码、改文件      | Agent    |
| 快速对话、讨论思路  | Chat     |

### Agent 模式能力

- 读写文件、执行终端命令
- 安装依赖、运行测试
- 创建项目、批量修改

---

## 注意事项

1. **不要修改学习笔记内容** - 本仓库为学习记录
2. **保持示例代码简洁** - 专注于核心概念演示
3. **提交前检查** - 确认示例可正常运行
4. **中文/英文一致** - 保持项目风格统一
