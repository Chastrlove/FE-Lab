/**
 * 证明commonjs是浅拷贝
 */

const { value, change } = require("./b");
console.log(value);
change();
console.log(value);
