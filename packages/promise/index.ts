const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

class Promiser {
  constructor(cb) {
    try {
      cb(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }

  static all(promises) {
    return new Promiser((resolve, reject) => {
      const success = new Array(promises.length);
      let successCount = 0;
      const processResultByKey = (value, index) => {
        success[index] = value;
        if (++successCount === promises.length) {
          resolve(success);
        }
      };

      for (let index in promises) {
        const promise = promises[index];
        if (promise && typeof promise.then === "function") {
          promise.then((value) => {
            processResultByKey(value, index);
          }, (err)=>{
            reject(err)
          });
        } else {
          processResultByKey(promise, index);
        }
      }
    });
  }

  static reject(reason) {
    return new Promiser((resolve, reject) => {
      reject(reason);
    });
  }

  static resolve(value) {
    if (value && value instanceof Promiser) {
      return value;
    }
    return new Promiser((resolve) => {
      resolve(value);
    });
  }

  status = PENDING;

  value;
  reason;

  resolveQueue = [];
  rejectQueue = [];
  resolve = (data) => {
    this.value = data;
    if (this.status === PENDING) {
      this.status = FULFILLED;
      queueMicrotask(() => {
        this.resolveQueue.forEach((cb) => {
          cb(data);
        });
      });
    }
  };

  reject = (error) => {
    this.reason = error;
    if (this.status === PENDING) {
      this.status = REJECTED;
      queueMicrotask(() => {
        this.rejectQueue.forEach((cb) => {
          cb(error);
        });
      });
    }
  };

  then = (onFulfilled?, onRejected?) => {
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };
    const promise = new Promiser((resolve, reject) => {
      if (this.status === FULFILLED) {
        queueMicrotask(() => {
          try {
            const value = onFulfilled(this.value);
            resolvePromise(promise, value, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
        return;
      }

      if (this.status === REJECTED) {
        queueMicrotask(() => {
          try {
            const value = onRejected(this.reason);
            resolvePromise(promise, value, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
        return;
      }

      this.resolveQueue.push((value) => {
        try {
          const returnValue = onFulfilled(value);
          resolvePromise(promise, returnValue, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
      this.rejectQueue.push((reason) => {
        try {
          const returnValue = onRejected(reason);
          resolvePromise(promise, returnValue, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    });
    return promise;
  };

  catch = (errorCallback) => {
    return this.then(null, errorCallback);
  };

  finally = (finalCallback) => {
    return this.then(
      (value) => {
        return Promise.resolve(finalCallback()).then(() => value);
      },
      (reason) => {
        return Promise.resolve(finalCallback()).then(() => reason);
      },
    );
  };
}

function resolvePromise(promise2, x, resolve, reject) {
  let then;
  let thenCalledOrThrow = false;

  if (promise2 === x) {
    // 对应标准2.3.1节
    return reject(new TypeError("Chaining cycle detected for promise!"));
  }

  if (x instanceof Promiser) {
    x.then(function (value) {
      resolvePromise(promise2, value, resolve, reject);
    }, reject);
    return;
  }

  //即使不是Promise,只要有then就要兼容
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    // 2.3.3
    try {
      // 2.3.3.1 因为x.then有可能是一个getter，这种情况下多次读取就有可能产生副作用
      // 即要判断它的类型，又要调用它，这就是两次读取
      then = x.then;
      if (typeof then === "function") {
        // 2.3.3.3
        then.call(
          x,
          function rs(y) {
            // 2.3.3.3.1
            if (thenCalledOrThrow) return; // 2.3.3.3.3 即这三处谁选执行就以谁的结果为准
            thenCalledOrThrow = true;
            return resolvePromise(promise2, y, resolve, reject); // 2.3.3.3.1
          },
          function rj(r) {
            // 2.3.3.3.2
            if (thenCalledOrThrow) return; // 2.3.3.3.3 即这三处谁选执行就以谁的结果为准
            thenCalledOrThrow = true;
            return reject(r);
          },
        );
      } else {
        // 2.3.3.4
        resolve(x);
      }
    } catch (e) {
      // 2.3.3.2
      if (thenCalledOrThrow) return; // 2.3.3.3.3 即这三处谁选执行就以谁的结果为准
      thenCalledOrThrow = true;
      return reject(e);
    }
  } else {
    // 2.3.4
    resolve(x);
  }
}


Promiser.all([1, Promiser.reject(1222), Promiser.resolve(222)])
  .then((daa) => {console.log(daa)})
  .catch((error) => {
    console.error(error);
  });
// new Promiser((resolve, reject) => {
//   resolve(123);
// })
//   .then(
//     async (data) => {
//       console.log(data);
//       return 222;
//     },
//     (error) => {
//       console.log("err", error);
//     },
//   )
//   .then(() => {
//     console.log("then");
//   })
//   .catch((error) => {
//     console.log("catch", error);
//   });
// .then(
//   (data) => {
//     console.log(data);
//   },
//   (reason) => {
//     console.log("2 then", reason);
//   },
// );
