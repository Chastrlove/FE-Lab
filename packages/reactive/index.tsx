import { effect, reactive } from "@vue/reactivity";

const react = reactive({ a: 1 });

effect(()=>{
    console.log(react.a)
})

react.a=123

