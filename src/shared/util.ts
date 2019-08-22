const _toString = Object.prototype.toString;

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
/**
 * Create a cached version of a pure function.
 */
export function cached(fn: Function): Function {
  const cache = Object.create(null);
  return function cachedFn(str: string) {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

const camelizeRE = /-(\w)/g;
export function camelize(input: string) {
  return input.replace(camelizeRE, (_, c: string) =>
    c ? c.toUpperCase() : ""
  );
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
export function toNumber(val: string): number | string {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
}

/**
 * Convert an Array-like object to a real Array.
 */
export function toArray(list: any, start?: number): Array<any> {
  start = start || 0;
  let i = list.length - start;
  const ret: Array<any> = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret;
}

export function noop() {}
export function remove(arr: Array<any>, item: any): Array<any> | void {
  if (arr && arr.length) {
    const index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}
/**
 * Merge an Array of Objects into a single Object.
 */
function toObject(arr: Array<any>): Object {
  const res = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      Object.assign(res, arr[i]);
    }
  }
  return res;
}

function hasOwn(target: object, key: string | number) {
  return Object.hasOwnProperty.call(target, key);
}

function toString(val): string {
  return val == null
    ? ""
    : Array.isArray(val) || isPlainObject(val)
    ? JSON.stringify(val, null, 2)
    : String(val);
}

function triggerEvent(target: HTMLElement, name: string, process?: Function) {
  const e = document.createEvent("HTMLEvents");
  e.initEvent(name, true, true);
  if (name === "click") {
    (e as any).button = 0;
  }
  typeof process === "function" && process(e);
  target.dispatchEvent(e);
}

function isDef(val): boolean {
  return val !== null && val !== undefined;
}

function isObject(obj): boolean {
  return obj !== null && typeof obj === "object";
}

function isPlainObject(obj): boolean {
  return _toString.call(obj) === "[object Object]";
}

function isPrimitive(val): boolean {
  const typeStr = typeof val;
  return (
    typeStr === "number" ||
    typeStr === "boolean" ||
    typeStr === "string" ||
    typeStr === "symbol"
  );
}

function arrayRemove(arr: any[], selector: any | Function) {
  const idx =
    typeof selector === "function"
      ? arr.findIndex(selector)
      : arr.indexOf(selector);
  if (idx === -1) {
    return;
  }
  return arr.splice(idx, 1);
}
function waitForUpdate(cb: (val: any) => void): Promise<any> {
  return Promise.resolve().then(cb);
}
type nestTypeIfKeyExist<T, K> = K extends keyof T ? T[K] : T;
function getByPath<
  T0,
  K1 extends keyof T0,
  T1 extends nestTypeIfKeyExist<T0, K1>,
  K2 extends keyof T1,
  T2 extends nestTypeIfKeyExist<T1, K2>,
  K3 extends keyof T2,
  T3 extends nestTypeIfKeyExist<T2, K3>,
  K4 extends keyof T3,
  T4 extends nestTypeIfKeyExist<T3, K4>,
  K5 extends keyof T4,
  T5 extends nestTypeIfKeyExist<T4, K5>,
  K6 extends keyof T5
>(target: T0, path: [K1?, K2?, K3?, K4?, K5?, K6?]) {
  let i = 0,
    res: any = target;
  while (i < path.length && res != undefined) {
    res = res[path[i++]];
  }
  return res;
}
export {
  arrayRemove,
  makeMap,
  def,
  isDef,
  isObject,
  isPlainObject,
  isPrimitive,
  toString,
  hasOwn,
  toObject,
  waitForUpdate,
  triggerEvent,
  getByPath
};
