const o = {};

try {
  Object.defineProperty(o, "foo", { value: "bar" });
  console.log("success");
} catch (e) {
  console.log(e, "failure");
}

const o1 = {};

Object.defineProperty(o1, "foo", { value: "bar" });

if (Reflect.defineProperty(o1, "foo", { value: "bar1" })) {
  console.log("success");
} else {
  console.log("failure");
}

/**
 * 多重代理
 * @type {{name: number}}
 */

const origin = { name: 123 };

const proxy1 = new Proxy(origin, {
  get(target, p, receiver) {
    return Reflect.get(...arguments) + 45;
  },
});

const proxy2 = new Proxy(proxy1, {
  get(target, p, receiver) {
    return Reflect.get(...arguments) + 45;
  },
});

console.log(proxy1.name);

console.log(proxy2.name);

/**
 * 代理的this
 * @type {WeakMap<object, any>}
 */

const wm = new WeakMap();

class User {
  constructor(userId) {
    wm.set(this, userId);
  }

  set id(userId) {
    wm.set(this, userId);
  }

  get id() {
    return wm.get(this);
  }
}

const user = new User(123);
console.log(user.id); // 123

const userInstanceProxy = new Proxy(user, {});
console.log(userInstanceProxy.id); // undefined

const fc = new Date(12);

const proxyFc = new Proxy(fc, {});

console.log(proxyFc instanceof Date);

proxyFc.getDate(); //Date 类型方法的执行依赖 this 值上的 内部槽位[[NumberDate]]。
