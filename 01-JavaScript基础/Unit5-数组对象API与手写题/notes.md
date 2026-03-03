# Unit 5 笔记：数组/对象 API、类型判断、深拷贝

## 一、类型判断

### 1. typeof

- 返回值：`"string"` | `"number"` | `"boolean"` | `"undefined"` | `"function"` | `"object"` | `"symbol"` | `"bigint"`
- **null、数组、普通对象** 都是 `"object"`
- 函数是 `"function"`

### 2. instanceof

- 判断**原型链**上是否存在某构造函数的 `prototype`
- `[] instanceof Array` → true；`[] instanceof Object` → true

### 3. Object.prototype.toString.call(x)

- 得到 `"[object 类型名]"`，如 `"[object Array]"`、`"[object Date]"`
- 可区分 Array、Date、RegExp、null 等，面试常用

---

## 二、深拷贝要点

- 递归复制对象/数组；基本类型直接返回
- 处理 **循环引用**：用 Map 存已访问对象，遇到则返回
- 特殊类型：Date、RegExp、Map、Set 等需单独 new 或克隆

---

## 三、防抖（debounce）

- **含义**：连续触发时，只在**最后一次**触发后等待 delay 再执行
- **场景**：搜索框输入、窗口 resize

---

## 四、节流（throttle）

- **含义**：在**固定时间间隔**内最多执行一次
- **场景**：滚动、按钮连点

---

## 五、数组/对象 API 常考

- 数组：map、filter、reduce、some、every、find、flat、includes
- 对象：Object.keys、Object.values、Object.entries、Object.assign
- 是否改变原数组：push/pop/splice 会改；slice、map、filter 不改
