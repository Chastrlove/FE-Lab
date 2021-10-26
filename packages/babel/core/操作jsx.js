const fs = require("fs");
const parser = require("@babel/parser");
const { default: generator } = require("@babel/generator");
const t = require("@babel/types");
const js_code = fs.readFileSync("../demos/JSX操作.jsx", {
  encoding: "utf-8",
});

let ast = parser.parse(js_code, {
  plugins: ["jsx"],
});
const traverse = require("@babel/traverse").default;

traverse(ast, {
  JSXAttribute(path) {
    const { name, value } = path.node;
    if (name.name === "x-if") {
      if (t.isJSXIdentifier(name) && t.isJSXExpressionContainer(value)) {
        const idt = value.expression;
        const node = t.jsxExpressionContainer(
          t.logicalExpression("&&", idt, path.parentPath.parent)
        );
        path.replaceWith(node);
      }
    }
  },
});

let code = generator(ast).code;
console.log(code);
