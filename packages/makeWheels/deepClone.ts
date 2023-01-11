import { cloneDeep, isSet } from "lodash";
const deepClone = (original, cache = new WeakMap()) => {
  if (typeof original === "object") {
    let cloneObject = Array.isArray(original) ? [] : {};
    if (cache.has(original)) {
      return cache.get(original);
    }
    cache.set(original, cloneObject);

    if (original instanceof Set) {
      cloneObject = new Set();
      original.forEach((value) => {
        const clone = deepClone(value, cache);
        cloneObject.add(clone);
      });
      return cloneObject;
    }

    if (original instanceof Map) {
      cloneObject = new Map();
      original.forEach((value, key) => {
        const clone = deepClone(value, cache);
        cloneObject.set(key, clone);
      });
      return cloneObject;
    }

    for (let key in original) {
      const clone = deepClone(original[key], cache);
      cloneObject[key] = clone;
    }
    return cloneObject;
  } else {
    return original;
  }
};

let a = {
  dd: Symbol(213),
  name: new Set([12, 22]),
};

a.ccc = a;

const d = deepClone(a);

console.log(d);
