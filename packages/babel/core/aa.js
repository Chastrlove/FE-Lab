
const fs = require('fs');
const parser    = require("@babel/parser");
const traverse  = require("@babel/traverse").default;
const types     = require("@babel/types");
const generator = require("@babel/generator").default;

//将源代码解析为AST
process.argv.length > 2 ? encodeFile = process.argv[2]: encodeFile ="../demos/wenshu.js";
process.argv.length > 3 ? decodeFile = process.argv[3]: decodeFile ="./decode_result.js";

let sourceCode = fs.readFileSync(encodeFile, {encoding: "utf-8"});
let ast    = parser.parse(sourceCode);

function getLastConsequent(consequents)
{
    let len = consequents.length;
    if (types.isBreakStatement(consequents[len-1]))
    {
        consequents.pop();
    }
    return consequents;
}

function getSwitchNodes(scope,name)
{
    let switchNodes = [];
    scope.traverse(scope.block,{
        SwitchStatement({node})
        {
            let {discriminant,cases} = node;
            if (discriminant.name != name) return;
            for (let i = 0; i < cases.length;i++)
            {
                switchNodes[i] = getLastConsequent(cases[i].consequent);
            }
        },
    })

    return switchNodes;
}



function DealWithConditionalExpression(right,stopValue,resList, stack)
{
    var controlValue;

    let {test, consequent, alternate} = right;
    let ifValue = consequent.value;
    let elseValue = alternate.value;

    let index = resList.lastIndexOf(test);
    if (index != -1)
    {//如果循环结束，index后面的所有节点组成的是while循环的BLOCK节点
        let BlockNode = types.BlockStatement(resList.slice(index + 1));
        //与test一起组成 While节点
        let WhileNode = types.WhileStatement(test, BlockNode);

        //替换index及后面所有节点为While节点
        resList.splice(index,resList.length);
        resList.push(WhileNode);

        //节点退出，处理条件表达式 为假的流程，此时应该退出。
        controlValue = stopValue;
    }

    else
    {//循环还没结束，继续遍历条件为真的节点，
        controlValue = ifValue;
        //将test压入保存的节点，用于判断是否有循环
        resList.push(test);
        //条件为假的controlValue压入堆栈。
        stack.push(elseValue);
    }

    return controlValue;
}

function DealWithNodes(nodes,controlName,stopValue,resList, stack)
{
    var controlValue = stopValue;
    for(let item of nodes)
    {
        if (types.isExpressionStatement(item) &&
            types.isAssignmentExpression(item.expression))
        {
            let {left,right} = item.expression;
            if (types.isIdentifier(left,{name:controlName}))
            {
                if (types.isNumericLiteral(right))
                {
                    controlValue = right.value;
                    continue;
                }
                if (types.isConditionalExpression(right))
                {
                    controlValue = DealWithConditionalExpression(right,stopValue,resList,stack);
                    continue;
                }
            }
        }
        resList.push(item);
    }
    return controlValue;
}


/******************************************************************
 Function: seekWhile
 Description: 去while-switch控制流
 Input:
 mainCases:还原前Switch表达式中的各case关键节点
 controlName:分发器名称，例子中的 cW
 controlValue:下一个case语句值
 stopValue:退出while循环的判断值
 Return: 还原后的节点，Array类型
 ******************************************************************/

function seekWhile(mainCases,controlName,controlValue, stopValue)
{
    var stack  = [];             //类似二叉树的前序遍历，stack存放else分支
    var resList = [];             //返回还原后的所有节点

    while (controlValue !== stopValue || stack.length > 0)
    {
        while (controlValue !== stopValue)
        {
            controlValue = DealWithNodes(mainCases[controlValue-1],controlName,stopValue,resList, stack);
        }
        if (stack.length > 0)
        {//遍历else分支
            controlValue = stack.pop();
        }
    }
    return resList;
}

const traverseWhile = {
    WhileStatement(path)
    {
        let {test,body} = path.node;
        if (!types.isBinaryExpression(test) || body.body.length != 1) return;
        let {left,operator,right} = test;
        let initName = left.name;
        let binding = path.scope.getBinding(initName);
        if (!binding || !binding.path) return;
        let bindPath = binding.path;
        if (!bindPath.isVariableDeclarator()) return;
        let {id,init} = bindPath.node;
        if (!types.isNumericLiteral(init)) return;
        let initValue = bindPath.node.init.value;
        switchNodes = getSwitchNodes(path.scope,initName);

        let stopValue = right.value;
        let retBody = seekWhile(switchNodes,initName,initValue,stopValue);
        path.replaceWithMultiple(retBody);
        bindPath.remove();
    }
}
traverse(ast, traverseWhile);





let {code} = generator(ast,opts = {jsescOption:{"minimal":true}});

fs.writeFile(decodeFile, code, (err) => {});
