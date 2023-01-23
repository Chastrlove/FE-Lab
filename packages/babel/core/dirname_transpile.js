const traverse = require('@babel/traverse').default;
const { parse } = require('@babel/parser');
const t = require('@babel/types');
const fs = require('fs');
const generator = require("@babel/generator").default;

const content = fs.readFileSync('../demos/dirName.js', 'utf8');

const ast = parse(content);

traverse(ast, {
  CallExpression(path,state) {
    const [...args] = path.get('arguments');
    const argValues = args.map(a => {
      const result = a.evaluate()
      console.log(result.value)
      return result.value
    })
  },
});

const b =  generator(ast)

console.log(b.code)
