function def(target: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: Boolean(enumerable),
    value: val,
    writable: true
  });
}

function makeMap(str: string, useLowerCase: boolean = false) {
  const list = str.split(",");
  const map = Object.create(null);
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }

  return useLowerCase
    ? (val: string) => map[val.toLowerCase()]
    : (val: string) => map[val];
}

export {makeMap, def};
