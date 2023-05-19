interface ComesFromString {
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

console.log(makeObj(MadeFromString).name);