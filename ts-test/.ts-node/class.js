"use strict";
/* interface ComesFromString {
  name: string;
}

interface StringConstructable {
  new(n: string): ComesFromString;
}

class MadeFromString implements ComesFromString {
  constructor (public name: string) {
      console.log('ctor invoked');
  }
}

function makeObj(n: StringConstructable) {
  return new n('hello!');
}

console.log(makeObj(MadeFromString).name); */
function justThrow() {
    throw new Error();
}
function testA() {
    justThrow();
    console.log('123'); // 不会执行 因为上面执行完后，已经无效
}
//# sourceMappingURL=class.js.map