import { value, change } from "./b";
//value始终是引用导出的对象，不是拷贝
console.log(value);
change();
console.log(value);
