---
title: 阅读--TypeScript(6) TypeScript 类型工具(2)
date: 2023-06-04 20:42:30
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

每流过一个 if 分支，后续联合类型的分支就少了一个，因为这个类型已经在分支处理过了，不会进入下一个分支：
```ts
declare const strOrNumOrBool: string | number | boolean;

if (typeof strOrNumOrBool === "string") {
  // 一定是字符串！
  strOrNumOrBool.charAt(1);
} else if (typeof strOrNumOrBool === "number") {
  // 一定是数字！
  strOrNumOrBool.toFixed();
} else if (typeof strOrNumOrBool === "boolean") {
  // 一定是布尔值！
  strOrNumOrBool === true;
} else {
  // 要是走到这里就说明有问题！
  const _exhaustiveCheck: never = strOrNumOrBool;
  throw new Error(`Unknown input type: ${_exhaustiveCheck}`);
}

```

但如果把类型判断抽离成函数，则会发现报错，这是因为函数在另一个地方，内部逻辑并不在函数 foo 中，这样的类型控制流分析做不到跨函数上下文来进行类型的信息收集。
```ts
function isString(input: unknown): boolean {
  return typeof input === "string";
}

function foo(input: string | number) {
  if (isString(input)) {
    // 类型“string | number”上不存在属性“replace”。
    (input).replace("zd", "zd")
  }
  if (typeof input === 'number') { }
  // ...
}
```

实际上，将判断逻辑封装起来很常见，TS 也引入了 **is** 关键字来显式提供类型信息：
```ts
function isString(input: unknown): input is string {
  return typeof input === "string";
}

function foo(input: string | number) {
  if (isString(input)) {
    // 类型“string | number”上不存在属性“replace”。
    (input).replace("zd", "zd")
  }
  if (typeof input === 'number') { }
  // ...
}
```
isString 函数称为类型守卫在它的返回值中，不再用 boolean 作为类型标注，而是使用 input is string。拆看来看是这样的：

- input函数的某个参数
- is string，即 is 关键字 + 预期类型。如果这个函数返回 true，那么 is 关键字前入参的类型，就会被后续的类型控制流分析收集到。

类型守卫有些类似于类型断言，但类型守卫更宽容，你指定什么类型，就是什么类型。还可以在类型守卫中使用对象类型，联合类型，以下是常用的类型守卫：
```ts
export type Falsy = false | "" | 0 | null | undefined;

export const isFalsy = (val: unknown): val is Falsy => !val;

// 不包括不常用的 symbol 和 bigint
export type Primitive = string | number | boolean | undefined;

export const isPrimitive = (val: unknown): val is Primitive => ['string', 'number', 'boolean' , 'undefined'].includes(typeof val);
```

### 基于 in 与 instanceof 的类型保护
