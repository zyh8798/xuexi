---
name: commit-message-helper
description: 根据 git diff 生成符合约定式提交（Conventional Commits）的提交信息，提交后执行 push。在用户请求写提交信息、提交代码、查看暂存变更或提到 commit message 时使用。
---

# 提交信息助手

本技能帮助根据代码变更生成清晰、规范的 Git 提交信息。

## 约定式提交格式

使用以下格式：

```
<type>(<scope>): <subject>

<body>（可选）
```

### Type 类型

| 类型       | 说明           |
|------------|----------------|
| feat       | 新功能         |
| fix        | 修复 bug       |
| docs       | 文档           |
| style      | 格式（不影响逻辑） |
| refactor   | 重构           |
| test       | 测试           |
| chore      | 构建/工具等    |

### 规则

1. **subject**：不超过 50 字，祈使句、首字母小写、句末无句号。
2. **scope**：可选，表示影响范围（如模块名、文件名）。
3. **body**：可选，说明动机与改动细节，每行 72 字内。

## 工作流程

1. 查看暂存变更：`git diff --cached` 或用户提供的 diff。
2. 概括改动：识别修改的文件与逻辑。
3. 确定 type 和 scope。
4. 写出 subject，必要时加 body。
5. **执行提交**：`git add`（如有未暂存）→ `git commit -m "..."`。
6. **每次提交后执行 push**：`git push`。

## 示例

**输入**：新增了用户登录接口，使用 JWT 校验。

**输出**：
```
feat(auth): 添加 JWT 登录接口

- 新增 POST /api/login
- 返回 accessToken 与 refreshToken
```

**输入**：修复报表页日期在时区转换后显示错误。

**输出**：
```
fix(reports): 修正时区转换后的日期显示

统一使用 UTC 时间戳生成报表日期
```

## 注意事项

- 中文或英文均可，与项目现有风格一致即可。
- 一次提交只做一类改动；若 diff 包含多种改动，可建议拆成多次提交。
