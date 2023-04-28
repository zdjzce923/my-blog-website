---
title: JS 面试题（二）
date: 2023-04-15 11:06:20
tags:
  - JavaScript
  - 面试题
categories:
  - [面试题]
---

### 21. 数组去重
1. 利用对象属性唯一保证不重复
2. 使用 new Set
3. includes  indexOf 两层循环splice

### 22. 类的继承
很长一段时间 js 用的都是组合继承，这种继承也被成为伪经典继承，使用原型链和构造函数的方式趋势线。

1. 组合继承最大的问题时效率问题，父类的构造函数始终会被调用两次，第一次在创建子类型调用，另一次在子类构造函数中调用。
2. 圣杯继承
TODO

### 23. 事件循环
JS 任务分为同步任务和异步任务，如果是同步任务，就在JS引擎线程上执行，形成一个执行栈。如果遇到异步任务，就会把它们交给异步模块（浏览器）去处理，然后主线程继续执行后面的同步任务。
异步任务有了结果就会在异步任务队列里放一个事件。
一旦执行栈中所有的同步任务执行完毕，就会读取任务队列，将可以运行的异步任务添加到执行栈开始执行。
在 JS 中，任务队列中的任务又可以分为宏任务微任务。
在执行完主线程会查看是否有微任务有就会优先执行，然后才是宏任务。


### 24. Node.js 中的时间循环机制
Node.js 在主线程里维护了一个事件队列，当接到请求后，就将该请求作为一个事件放入这个队列中，然后继续接收其他请求。当主线程空闲时（没有请求接入时），就开始循环事件队列，检查队列中是否有要处理的事件，这时要分两种情况：如果是非 I/O 任务，就亲自处理，并通过回调函数返回到上层调用；如果是 I/O 任务，就从线程池中拿出一个线程来处理这个事件，并指定回调函数，然后继续循环队列中的其他事件。
当线程中的 I/O 任务完成以后，就执行指定的回调函数，并把这个完成的事件放到事件队列的尾部，等待事件循环，当主线程再次循环到该事件时，就直接处理并返回给上层调用。 这个过程就叫 事件循环 (Event Loop)。
无论是 Linux 平台还是 Windows 平台，Node.js 内部都是通过线程池来完成异步 I/O 操作的，而 LIBUV 针对不同平台的差异性实现了统一调用。因此，Node.js 的单线程仅仅是指 JavaScript 运行在单线程中，而并非 Node.js 是单线程。

### 25. 函数柯里化
函数柯里化又称部分求值。一个函数会首先接受一些参数，但是不会立刻求值，而是返回另外一个函数。把接受多个参数的函数变成单一参数的函数。

### 26. Promise.all
是 promise 的方法，他接受多个 promise 组成的数组作为参数，并且返回一个新的 promise 实例。
返回值会按照参数内的顺序排列。
如果全部成功，状态变为resolve，才会返回一个数组传给回调。有一个失败，就会变成 rejected。

### 27. 事件委托及冒泡
在 JS 中，添加到页面上的事件处理程序数量越多性能越差。
对事件处理程序过多的解决方案就是事件委托。
他利用了事件冒泡，只指定了一个事件处理程序，就可以管理某一种类型的所有事件。不必给每个可点击的元素分别添加事件处理程序。

### 28. 防抖和节流
防抖：指在一段时间内如果频繁触发某个事件，会重新计时，在时间过后才会执行事件。场景 resize 去重新渲染的时候。
```javascript
function debounceHandle (fn, delay) {
  let timer = null
  return function () {
    const that = this

    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      fn.apply(that, arguments)
    }, delay)
  }

}
```
节流：应用场景：用户频繁点击提交
```javascript
function throttle(fn, delay) {
  let freeze = false

  return function() {
    const that = this
    if (!freeze) {
      freeze = true
      fn.apply(that, arguments)

      setTimeout(() => {
        freeze = false
      }, delay)
    }
  }

}
```

### 29. 垃圾回收机制
1. 标记清除
   当变量进入环境，会做一个进入标记，当变量离开环境，会做一个离开的标记。标记离开就会被回收。
   工作流程：垃圾回收器会给存储在内存中的所有变量都加上标记。垃圾回收器会销毁那些带离开标记的值并回收他们所占用的内存空间。
2. 引用计数
   跟踪每个值被引用的次数。
   比如声明一个变量并将引用类型的值赋值给变量，那么引用类型的引用次数就 +1。
   如果这个变量又被赋值成其他值，那么引用类型的引用次数 -1。
   当引用次数变为 0，垃圾回收下一次运行，就会释放引用次数是 0 的值所占的内存。

### 30. 实现 call apply bind
call:
```javaScript
function test() {
  console.log(this.name)
}

Function.prototype.my_call = function(context, ...arg) {
  if (typeOf this != 'function') throw new TypeError('please use function')

  context = context || 'window'
  const fn = Symbol('fn')
  context.fn = this
  const result = context.fn(...arg)

  delete context.fn

  return result
}


const obj = {
  name: 'test name'
}

test.my_call(obj) // test name

```
apply: 与 call 差不多，传参改为数组就行
bind: 不立即执行，返回一个函数，使用 call 实现。
```javaScript

Function.prototype.my_bind(context, ...args) {

  const that = this
  return function() {
    this.call(context, ...args)
  }
}

```

### 31. 重绘和重排
1. 重绘：对DOM的修改导致了样式的变化，却没有影响到几何属性（比如修改颜色或背景色）浏览器直接为该元素绘制新的样式。
2. 重排（回流）：当我们对DOM的修改引发了DOM尺寸的变化，浏览器重新计算各节点和 CSS 具体的大小和位置，然后再将计算的结果绘制出来。
   重绘不一定导致重排，但是重排一定导致重绘
   
   优化思路：
   想要避免或者减少重绘和重排，需要从根源上解决，操作DOM是十分昂贵的。
   1. 把值缓存起来，比如每次循环获取DOM元素的 clientHeight，可以先获取 clientHeight 赋值给变量，在循环的时候再去更改变量，避免频繁获取这个属性导致回流。
   2. 不去直接更改元素的 style 而是给他添加类
   3. 浏览器的重排和重绘一定是发生在这个元素在页面上的时候，如果涉及到频繁修改DOM的操作，可以先给他添加个display:none，再去操作他，虽然也会引起回流，不过比起直接操作节省了不少性能。

  浏览器自身优化：
  浏览器并不会再每次DOM更改就回流或重绘，而是缓存了一个flush队列，把重绘和回流的任务都塞进去，等队列的任务变多或间隔一段时间，便去执行。
### 32. 
