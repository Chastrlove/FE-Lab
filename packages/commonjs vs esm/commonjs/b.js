let value = { a: 123 };
const change = () => {
  value.a = 123123;
  //此处更改value不生效，因为commonjs导出的value是浅拷贝
  //类似 let value={a:123}; let copy = value; value = {a:12223} ;此时copy还是{a:123}
  // value={a:122223}
};
module.exports = {
  value,
  change,
};
