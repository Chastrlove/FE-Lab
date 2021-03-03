const targetOriginal = {
  id: 1,
};

const proxy = new Proxy(targetOriginal, {
  get(target, p, receiver) {
    if (p === "id") {
      return Reflect.get(...arguments) + "!!!!";
    }
    return 12;
  },
});

const proxy1 = new Proxy(targetOriginal, Reflect);

const a = proxy.id;


/**
 * test definedProperty
 * @type {{}}
 */

const ob = {} ;

const defined = Object.defineProperty(ob, "foo", {
  configurable:true,
  enumerable: true,
  // get set 不能与valau 或writable同时存在
  get() {
  },
});

const defined1 = Object.defineProperty(ob, "foo", {
  value:234,
  configurable:false,
/*  writable:false,*/
});

const proxyObject = new Proxy(defined1, {
  get(target, p, receiver) {
    return Reflect.get(...arguments) + "!!!!";
  },
});
/*try{
  console.log(proxyObject.foo)
}catch (e){
  console.log(e)
}*/

/**
 * 可撤销的Proxy
 */

const target112 = { foo: 'bar' };

const {proxy:reProxy,revoke} = Proxy.revocable(target112,{
  get(){
    return "13"
  }
})
console.log(reProxy.id)
revoke();
console.log(reProxy.foo)
