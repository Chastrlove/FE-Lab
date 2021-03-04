import { reactive, effect } from "@vue/reactivity";

const proxy = reactive({ a: 1 });

effect(() => {
  console.log(proxy.a);
});

proxy.a = 123;
