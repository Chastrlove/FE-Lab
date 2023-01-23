const myNew = (fn, ...args) => {
  const context = Object.create(fn.prototype);
  const res = fn.apply(context, args);
  return typeof res === "object" ? res : context;
};

const d = myNew(fn, 2);

function fn(a) {
  this.a = a;
}
