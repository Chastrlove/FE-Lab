const types = require('@babel/types');

//判断节点元素是否为字面量
//eg.  ++123,-456,"789";
function isBaseLiteral(path) {
  if (path.isLiteral()) {
    return true;
  }
  if (
    path.isUnaryExpression({ operator: '-' }) ||
    path.isUnaryExpression({ operator: '+' })
  ) {
    return isBaseLiteral(path.get('argument'));
  }
  return false;
}

//判断节点元素[Arrays]是否全部为字面量
function isElementsLiteral(path) {
  let key = null;

  if (path.isArrayExpression()) {
    key = 'elements';
  } else if (path.isObjectExpression()) {
    key = 'properties';
  } else if (path.isCallExpression()) {
    key = 'arguments';
  } else {
    return false;
  }

  let elements = path.get(key);

  if (elements.length == 0) return false;

  if (key == 'properties') {
    return elements.every((element) => isBaseLiteral(element.get('value')));
  }

  return elements.every((element) => isBaseLiteral(element));
}

//规范For循环和While循环
const standardLoop = {
  'ForStatement|WhileStatement'({ node }) {
    if (types.isExpressionStatement(node.body)) {
      node.body = types.BlockStatement([node.body]);
    }
  },
};

//处理逗号表达式
const resolveSequence = {
  SequenceExpression: {
    exit(path) {
      let CondintionPath = path.findParent((p) => p.isConditionalExpression());
      let statement = path.getStatementParent();
      if (!statement) return;
      if (CondintionPath) {
        let nextCondintionPath = statement.findParent((p) =>
          p.isConditionalExpression(),
        );
        if (nextCondintionPath != CondintionPath) return;
      }
      let expressions = path.get('expressions');
      let lastExpression = expressions.pop();
      for (let expression of expressions) {
        if (expression.isLiteral() || expression.isIdentifier()) {
          expression.remove();
          continue;
        }
        statement.insertBefore(
          types.ExpressionStatement((expression = expression.node)),
        );
      }
      path.replaceInline(lastExpression);
    },
  },
};

const simplifyLiteral = {
  NumericLiteral({ node }) {
    if (node.extra && /^0[obx]/i.test(node.extra.raw)) {
      node.extra = undefined;
    }
  },
  StringLiteral({ node }) {
    if (node.extra && /\\[ux]/gi.test(node.extra.raw)) {
      node.extra = undefined;
    }
  },
};

const constantFold = {
  'BinaryExpression|UnaryExpression|ConditionalExpression|CallExpression'(
    path,
  ) {
    if (
      path.isUnaryExpression({ operator: '-' }) ||
      path.isUnaryExpression({ operator: 'void' })
    ) {
      return;
    }
    const { confident, value } = path.evaluate();
    if (value == 'Infinity' || !confident) return;
    path.replaceInline(types.valueToNode(value));
  },
};

//删除重复定义且未被改变初始值的变量
const deleteRepeatDefine = {
  'VariableDeclarator|FunctionDeclaration'(path) {
    let { node, scope } = path;
    if (path.isFunctionDeclaration()) {
      scope = path.parentPath.scope;
    }
    let name = node.id.name;
    const binding = scope.getBinding(name);
    if (!binding || !binding.constant) return;

    scope.traverse(scope.block, {
      VariableDeclarator(path) {
        let { node, scope } = path;
        let { id, init } = node;
        if (!types.isIdentifier(init, { name: name })) return;

        if (!path.get('id').isConstantExpression()) return;

        scope.rename(id.name, name);
        path.remove();
      },
    });
  },
};

const keyToLiteral = {
  MemberExpression: {
    exit({ node }) {
      const prop = node.property;
      if (!node.computed && types.isIdentifier(prop)) {
        node.property = types.StringLiteral(prop.name);
        node.computed = true;
      }
    },
  },
  ObjectProperty: {
    exit({ node }) {
      const key = node.key;
      if (!node.computed && types.isIdentifier(key)) {
        node.key = types.StringLiteral(key.name);
      }
    },
  },
};

const preDecodeObject = {
  VariableDeclarator({ node, parentPath }) {
    const { id, init } = node;
    if (!types.isObjectExpression(init)) return;
    let name = id.name;

    let properties = init.properties;
    let allNextSiblings = parentPath.getAllNextSiblings();
    for (let nextSibling of allNextSiblings) {
      if (!nextSibling.isExpressionStatement()) break;

      let expression = nextSibling.get('expression');
      if (!expression.isAssignmentExpression({ operator: '=' })) break;

      let { left, right } = expression.node;
      if (!types.isMemberExpression(left)) break;

      let { object, property } = left;
      if (
        !types.isIdentifier(object, { name: name }) ||
        !types.isStringLiteral(property)
      ) {
        break;
      }

      properties.push(types.ObjectProperty(property, right));
      nextSibling.remove();
    }
  },
};

const removeDeadCode = {
  'IfStatement|ConditionalExpression'(path) {
    let { consequent, alternate } = path.node;
    let testPath = path.get('test');
    const evaluateTest = testPath.evaluateTruthy();
    if (evaluateTest === true) {
      path.replaceWithMultiple(consequent);
    } else if (evaluateTest === false) {
      if (alternate != null) {
        path.replaceWithMultiple(alternate);
      } else {
        path.remove();
      }
    }
  },
  EmptyStatement(path) {
    path.remove();
  },
  'VariableDeclarator|FunctionDeclaration'(path) {
    //在setTimeout函数或者eval函数里无法检测是否被引用，所以慎用。
    let { node, scope } = path;
    let binding = scope.getBinding(node.id.name);
    if (binding && !binding.referenced && binding.constant) {
      //没有被引用，也没有被改变
      path.remove();
    }
  },
};

exports.constantFold = constantFold;
exports.keyToLiteral = keyToLiteral;
exports.standardLoop = standardLoop;
exports.removeDeadCode = removeDeadCode;
exports.preDecodeObject = preDecodeObject;
exports.simplifyLiteral = simplifyLiteral;
exports.resolveSequence = resolveSequence;
exports.isElementsLiteral = isElementsLiteral;
exports.deleteRepeatDefine = deleteRepeatDefine;
exports.isBaseLiteral = isBaseLiteral;

const {
  list,                  // array of required modules
  targets,               // object with targets for each module
} = require('core-js-compat')({   // browserslist query or object of minimum environment versions to support
  filter: /^(es|web)\.promise/, // optional filter - string-prefix, regexp or list of modules   // used `core-js` version, by default - the latest
});

console.log(list,targets);
