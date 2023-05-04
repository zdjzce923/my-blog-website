---
title: 阅读--TypeScript(2) 原始类型、对象类型
date: 2023-05-04 09:42:30
tags:
  - 阅读
  - 面试题
  - TypeScript
categories:
  - [阅读]
---

### 字面量类型
当描述接口返回值的时候会定义如下接口：
```ts
interface Response {
  code: number,
  status: string,
  data: any
}
```
但描述的其实不够准确，比如 code 可能是 200,400,500 等等，status 可能是 success 或者 failed。而上面只给出了宽泛的类型。
结合字面量类型可以将上面改造成：
```ts
interface Response {
  code: 200 | 400 | 500,
  status: 'success' | 'failed',
  data: any
}
```
在 TypeScript 中，这叫做字面量类型（Literal Types），它代表着比原始类型更精确的类型，同时也是原始类型的子类型。
字面量类型主要包括字符串字面量类型、数字字面量类型、布尔字面量类型和对象字面量类型，它们可以直接作为类型标注：

### 联合类型
联合类型可以理解为，一组可用的类型集合，只要赋值时是指定联合类型之一的类型，就合法。
```ts
interface Tmp {
  mixed: true | string | 599 | {} | (() => {}) | (1 | 2)
}
```
- 对于联合类型中的函数类型，需要使用括号()包裹起来
- 函数类型并不存在字面量类型，因此这里的 (() => {}) 就是一个合法的函数类型
- 你可以在联合类型中进一步嵌套联合类型，但这些嵌套的联合类型最终都会被展平到第一级中

联合类型通常用于实现互斥属性，即这个属性如果有字段1，就没有字段2。
```ts
interface Tmp {
  user:
    | {
        vip: true;
        expires: string;
      }
    | {
        vip: false;
        promotion: string;
      };
}

declare var tmp: Tmp;

if (tmp.user.vip) {
  console.log(tmp.user.expires);
}
```
在这个例子中， user 属性会满足普通用户与 vip 用户两种类型，这里 vip 属性的类型基于布尔字面量类型声明，在实际使用时可以通过判断此属性为 true。

