import { makeObservable, observable } from "mobx";
class Store {
  @observable
  propertyA: null | string = null;
  propertyB?: string;

  constructor() {
    makeObservable(this);
  }
}

const a = new Store();
console.log(a.propertyB)
