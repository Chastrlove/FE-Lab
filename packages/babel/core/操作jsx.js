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
  JSXElement(path) {
    const { node, parentPath } = path;
    const { openingElement } = node;
    const { attributes } = openingElement;
    for (let attrIndex in attributes) {
      const attrNode = attributes[attrIndex];
      const { name, value } = attrNode;
      if (name.name === "x-if") {
        attributes.splice(attrIndex, 1);
        if (t.isJSXIdentifier(name) && t.isJSXExpressionContainer(value)) {
          const idt = value.expression;
          const callExp = t.logicalExpression("&&", idt, path.node);
          if (t.isJSXElement(parentPath) || t.isJSXFragment(parentPath)) {
            path.replaceWith(t.jsxExpressionContainer(callExp));
          } else {
            path.replaceWith(callExp);
          }
        }
        break;
      }
    }
  },
});

let code = generator(ast).code;
console.log(code);
