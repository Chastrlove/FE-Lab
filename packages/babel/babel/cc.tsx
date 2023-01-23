"use strict";

var _mobx = require("mobx");
var _class, _descriptor;
function _initializerDefineProperty(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0,
  });
}
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object.keys(descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;
  if ("value" in desc || desc.initializer) {
    desc.writable = true;
  }
  desc = decorators
    .slice()
    .reverse()
    .reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);
  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }
  if (desc.initializer === void 0) {
    Object.defineProperty(target, property, desc);
    desc = null;
  }
  return desc;
}
function _initializerWarningHelper(descriptor, context) {
  throw new Error(
    "Decorating class property failed. Please ensure that " +
      "proposal-class-properties is enabled and runs after the decorators transform.",
  );
}
let Store =
  ((_class = class Store {
    constructor() {
      _initializerDefineProperty(this, "propertyA", _descriptor, this);
      this.propertyB = void 0;
      (0, _mobx.makeObservable)(this, {
        propertyB: _mobx.observable,
        propertyA: _mobx.observable,
      });
    }
  }),
  (_descriptor = _applyDecoratedDescriptor(_class.prototype, "propertyA", [_mobx.observable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return null;
    },
  })),
  _class);
const a = new Store();
console.log(a.propertyB);
