class EventEmitter {
  constructor() {}

  listeners = new Map();

  on(typeName, listener) {
    const typeListeners = this.listeners.get(typeName);
    const currentListener = listener;
    if (typeListeners) {
      typeListeners.push(currentListener);
    } else {
      this.listeners.set(typeName, [currentListener]);
    }
  }
  once(typeName, listener) {
    const onceListener = (content) => {
      listener(content);
      this.off(typeName, onceListener);
    };
    this.on(typeName, onceListener);
  }

  off(typeName, listener) {
    const typeListeners = this.listeners.get(typeName);
    const index = typeListeners.indexOf(listener);
    if (index > -1) {
      typeListeners.splice(index, 1);
    }
  }
  emit(typeName, content) {
    const typeListeners = this.listeners.get(typeName);
    if (typeListeners) {
      typeListeners.forEach((cb) => {
        cb(content);
      });
    }
  }
}

let event1 = new EventEmitter();

event1.on("say", function (str) {
  console.log(str);
});

event1.once("say", function (str) {
  console.log("这是once:" + str);
});

event1.emit("say", "visa");
event1.emit("say", "visa222");
event1.emit("say", "visa333");
