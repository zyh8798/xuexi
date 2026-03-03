/**
 * Unit 5 - 深拷贝、防抖、节流示例
 * 运行：node 01-深拷贝与防抖节流.js
 */

// 简易深拷贝（含循环引用）
function deepClone(obj, map = new Map()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (map.has(obj)) return map.get(obj);
  const res = Array.isArray(obj) ? [] : {};
  map.set(obj, res);
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      res[key] = deepClone(obj[key], map);
    }
  }
  return res;
}

// 防抖
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 节流
function throttle(fn, delay) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn.apply(this, args);
    }
  };
}

// 测试深拷贝
const a = { x: 1 };
a.self = a;
const b = deepClone(a);
console.log(b.x, b.self === b);
