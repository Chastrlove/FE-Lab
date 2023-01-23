const traverse = require('@babel/traverse').default;
const types = require('@babel/types');
const parser = require('@babel/parser');
const fs = require('fs');
const path = require('path');
const file = fs.readFileSync(path.join(__dirname,'../demos/isg.tsx'), 'utf8');
const ast = parser.parse(file);
const generator = require('@babel/generator').default;
const { isBaseLiteral } = require('./plugins')
const resolveParams =
  {
    CallExpression(path) {
      let callee = path.get('callee');
      let arguments = path.get('arguments');
      if (!callee.isFunctionExpression() || arguments.length == 0) {
        return;
      }
      let scope = callee.scope;
      let params = callee.get('params');


      for (let i = 0; i < arguments.length; i++) {
        let paramsPath = params[i];
        let argumentPath = arguments[i];
        const binding = scope.getBinding(paramsPath.node.name);
        if (!binding || !binding.constant) {
          continue;
        }

        let canRemoved = true;

        for (let referPath of binding.referencePaths) {
          if (argumentPath.isIdentifier() || isBaseLiteral(argumentPath)) {
            referPath.replaceWith(argumentPath.node);
          } else if (argumentPath.isArrayExpression()) {
            let parentPath = referPath.parentPath;
            if (!parentPath.isMemberExpression()) {
              canRemoved = false;
              continue;
            }
            let { property } = parentPath.node;
            if (!types.isNumericLiteral(property)) {
              canRemoved = false;
              continue;
            }
            let index = property.value;
            if (index > argumentPath.length) {
              canRemoved = false;
              continue;
            }
            let arrEle = argumentPath.node.elements[index];
            parentPath.replaceWith(arrEle);
          } else {
            canRemoved = false;
            break;
          }
        }
        if (canRemoved) {
          paramsPath.remove();
          argumentPath.remove();
        }
      }
    },
  };

traverse(ast, resolveParams);


let code = generator(ast).code;
console.log(code);
