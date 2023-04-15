---
title: 网络面试题
date: 2023-04-15 11:06:20
tags:
  - JavaScript
  - 面试题
categories:
  - [面试题]
---

### 1. JS 数据类型，区别
JS 共有八种数据类型， Undefined, Null, Boolean, Number, String, Object, Symbol, BigInt。

其中 **Symbol** 和 **BigInt** 是 ES6 新增的数据类型：

1. Symbol 代表创造后独一无二不可变的数据类型，解决可能出现的全局变量冲突的问题。（举例：代码判断时耦合的情况，全局创建Symbol Symbol.for() keyFor 查找全局注册表对应的symbol）
2. BigInit 存储和操作大数。

数据类型又可以分为**原始数据类型**和**引用数据类型**
1. **栈**：原始数据类型
2. **堆**：引用数据类型（对象，数组，函数）
  他们的区别在于：
    1. 原始数据大小固定，占的空间小。引用类型占据空间大，大小不固定，引用类型在栈中存储了指针，指针指向堆中的地址。
    2. 栈后进先出，堆是一个优先队列，按照优先级来排序的。
  
### 2. 数据类型检测
1. typeof （数组、对象、null会被判断为 object）
2. instanceof (不能检测原始类型，查看对象原型链中是否存在构造函数的 prototype 属性)
3. constructor 通过对象实例的 construcotr 判断类型或查看实例的构造函数
  ```
   function Fn(){};
 
   Fn.prototype = new Array();

   var f = new Fn();

   console.log(f.constructor===Fn);    // false
   console.log(f.constructor===Array); // true
  ```
4. 通过 **Object.prototype.toString().call** 用对象上的原型方法来判断任意的数据类型，Array 和 Function 都有自己的toString 方法，所以使用对象原型方法。


### 3. Null 和 undefined 区别
Null是空对象，undefined是未定义。

### 4. instanceof 的实现原理
```
function myInstanceof(left, right) {
  // 获取对象的原型
  let proto = Object.getPrototypeOf(left)
  // 获取构造函数的 prototype 对象
  let prototype = right.prototype; 
 
  // 判断构造函数的 prototype 对象是否在对象的原型链上
  while (true) {
    if (!proto) return false;
    if (proto === prototype) return true;
    // 如果没有找到，就继续从其原型上找，Object.getPrototypeOf方法用来获取指定对象的原型
    proto = Object.getPrototypeOf(proto);
  }
}

```

### 5. 0.1 + 0.2 !== 0.3
在计算机中最后会被转换为无限循环的二进制数，而在JS中只有一个类型表示数字就是Number，它是基于 IEEE754 标准实现的
只支持双精度浮点数，也就是只支持52位的小数，如果超过会舍去然后转成10进制，相加后也就是 **0.30000000000000004** 
ES6中提供了 **Number.EPSILON**。这个属性其实是设置了一个误差范围。查看判断的数是否小于这个属性，小于则满足条件。

### 6. let、const、var 的区别
1. **块级作用域**：解决了 1. 内部变量可能覆盖外层变量 2. 计数的循环变量泄露为全局变量
2. **变量提升**： var 存在变量提升，let 和 const 不存在变量提升，let const 只能在声明之后使用，否则报错
3. **给全局添加属性**：var 声明的变量会成为全局变量，浏览器中是window，node是global
4. **重复声明**：var 声明变量可以重复声明，后面的会覆盖前面的。const 和 let 不允许重复声明。
5. **暂时性死区**：在使用let、const声明变量之前都是不可用的，var就不存在。
6. **初始值**：var，let不用设置初始值，const必须设置。
7. **重新赋值**：var，let可以重新赋值，const不可以

### 7. 箭头函数与普通函数的区别
1. 箭头函数比较简洁
2. 没有自己的this
   不会创建自己的 this，只会继承作用域的上一层this。定义的时候已经确定不会改变。使用 call apply bind 也没有用。
3. 不能作为构造函数使用。
4. 没有自己的 arguments
5. 没有 prototype

### 8. JS 的包装类型
在js中基础类型是没有属性跟方法的，为了便于操作，在调用属性或方法时，js在后台隐式地将基本类型值转换为对象。


### 9. 扩展运算符
##### 1. 对象扩展运算符
   1. 对象扩展运算符，取出对象中的可遍历属性加到当前对象之中，是浅拷贝，类似于 Object.assign
   2. 同名属性后面覆盖前面的

##### 2. 数组扩展运算符
1. 可以将数组元素进行展开，只能展开一层
```
  console.log(...[1, 2, 3])
  // 1 2 3
  console.log(...[1, [2, 3, 4], 5])
  // 1 [2, 3, 4] 5
```
2. 合并数组
  扩展运算符与解构赋值结合起来，用于生成数组
  ```
  const [first, ...rest] = [1, 2, 3, 4, 5];
  first // 1
  rest  // [2, 3, 4, 5]
  ```
  **注意**：解构赋值时，展开运算符必须放在最后
3. 将字符串转为数组
```
   [...'hello']
```

4. 用于替换es5中的Array.prototype.slice.call(arguments)写法。
5. 任何 Iterator 接口的对象，都可以用扩展运算符转为真正的数组