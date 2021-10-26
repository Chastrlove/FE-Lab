const fs = require('fs');

const js_code = fs.readFileSync("../demos/还原逗号.js", {
    encoding: "utf-8"
});

const parser = require("@babel/parser");

const t = require("@babel/types");

const traverse = require("@babel/traverse").default;

const generator = require("@babel/generator").default;

const ast = parser.parse(js_code)

traverse(ast, {
    SequenceExpression: {
        // 因为可能存在嵌套的情况 所以我们在遍历退出的时候进行判断
        exit(path){
            let expressions = path.node.expressions;
            // 从expressions数组尾部弹出最后一个表达式
            let finalExpression = expressions.pop();
            // 寻找最近的一个父级的statement语句
            let statement = path.getStatementParent();
            // 把此时expressions数组中的path放到 statement语句前面
            expressions.map(function (v){
                statement.insertBefore(t.expressionStatement(v));
            });
            // 用刚刚取出的最后一个表达式替换sequenceExpression
            path.replaceInline(finalExpression);
            let code = generator(ast).code;
            console.log(code);
        }
    }
});



let code = generator(ast).code;
console.log(code);

