
import {cloneDeep} from "lodash"
const deepClone=(original,cache = new WeakMap())=>{
  let cloneObject;
  if(typeof original === "object"){
    cloneObject = Array.isArray(original) ? [] : {};
    if(cache.has(original)){
      return cache.get(original)
    }
    cache.set(original,cloneObject)
    for(let key in original){
      const clone = deepClone(original[key],cache);
      cloneObject[key] = clone;
    }
  }else{
    cloneObject=original
  }
  return cloneObject
}


let a = {
  name:1,
};

a.ccc = a;

const d = deepClone(a);

console.log(d)
