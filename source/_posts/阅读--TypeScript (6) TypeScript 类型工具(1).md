---
title: 阅读--TypeScript(6) TypeScript 类型工具(1)
date: 2023-06-04 17:02:30
tags:
  - 阅读
  - 面试题
  - TypeScript
categories:
  - [阅读]
---

### 类型查询操作符： typeof
JS 中的 typeof 运用于检查变量类型，TS 中的 typeof返回的是一个 TS 类型:
```ts
const str = "zdj";

const obj = { name: "zdj" };

const nullVar = null;
const undefinedVar = undefined;

const func = (input: string) => {
  return input.length > 10;
}

type Str = typeof str; // "zdj"
type Obj = typeof obj; // { name: string; }
type Null = typeof nullVar; // null
type Undefined = typeof undefined; // undefined
type Func = typeof func; // (input: string) => boolean

```

可以在类型标注中使用 typeof，也可以在工具类型中使用 typeof:
```ts
const func = (input: string) => {
  return input.length > 10;
}

// const func: (input: string) => boolean
const func2: typeof func = (name: string) => {
  return name === 'zdj'
}
```

如果需要一个函数的返回值类型，可以使用 ReturnType
```ts
type FuncReturnType = ReturnType<typeof func>
```
typeof 返回的类型就是推导后的类型，并且是最窄的推导程度。也不必担心混用 js 的 typeof，在逻辑中使用的 typeof 一定是 js 的。而类型代码中使用的一定是 TS 的。


### 类型守卫
TS 中提供了非常强大的类型推导能力，它会随着代码逻辑不断尝试收窄类型。这一能力称之为类型的控制流分析（类型推导）。
就好像有一条河流，它有很多支流，在一定条件下会流向不同的支流，类似于 if else
```ts
function foo (input: string | number) {
  if (typeof input === 'string') {}
  if (typeof input === 'number') {}
}

```

