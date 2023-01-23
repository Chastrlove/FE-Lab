const traverse = require('@babel/traverse').default;
const parser = require('@babel/parser');
const types = require('@babel/types');
const generator  =require('@babel/generator').default;

function FormatMember(path) {
    // _0x19882c['removeCookie']['toString']()
    //  |
    //  |
    //  |
    //  v
    // _0x19882c.removeCookie.toString()
    var curNode = path.node;
    if (!types.isStringLiteral(curNode.property))
        return;
    if (curNode.computed === undefined || !curNode.computed === true)
        return;
    if (!/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(curNode.property.value))
        return;
    curNode.property = types.identifier(curNode.property.value);
    curNode.computed = false;
}

function TransCondition(path) {
    // a = m?11:22;
    //  |
    //  |
    //  |
    //  v
    // m ? a = 11 : a = 22;
    let {test, consequent, alternate} = path.node;
    const ParentPath = path.parentPath;
    if (ParentPath.isAssignmentExpression()) {
        let {operator, left} = ParentPath.node;
        if (operator === "=") {
            consequent = types.AssignmentExpression("=", left, consequent)
            alternate = types.AssignmentExpression("=", left, alternate)
            ParentPath.replaceWith(types.conditionalExpression(test, consequent, alternate))
        }
    }
}

function ConditionToIf(path) {
    // m ? a = 11 : a = 22;
    //  |
    //  |
    //  |
    //  v
    // if (m) {
    //   a = 11;
    // } else {
    //   a = 22;
    // }
    let {expression} = path.node;
    if (!types.isConditionalExpression(expression)) return;
    let {test, consequent, alternate} = expression;
    path.replaceWith(types.ifStatement(
        test,
        types.blockStatement([types.expressionStatement(consequent),]),
        types.blockStatement([types.expressionStatement(alternate),])
    ));
}

function ConditionVarToIf(path) {
    // var m ? a = 11 : a = 22;
    //  |
    //  |
    //  |
    //  v
    // if (m) {
    //   var a = 11;
    // } else {
    //   var a = 22;
    // }
    if (types.isForStatement(path.parentPath)) return;
    var decl = path.node.declarations
    var rpls = []
    var togg = false
    for (var i = 0; i < decl.length; i++) {
        if (types.isConditionalExpression(decl[i].init)) {
            togg = true
            let {test, consequent, alternate} = decl[i].init;
            rpls.push(types.ifStatement(
                test,
                types.blockStatement([types.variableDeclaration(path.node.kind, [types.variableDeclarator(decl[i].id, consequent)]),]),
                types.blockStatement([types.variableDeclaration(path.node.kind, [types.variableDeclarator(decl[i].id, alternate)]),])
            ))
        } else {
            rpls.push(types.VariableDeclaration(path.node.kind, [decl[i]]))
        }
    }
    if (togg) {
        path.replaceWithMultiple(rpls)
        path.stop()
    }
}

function RemoveComma(path) {
    // a = 1, b = ddd(), c = null;
    //  |
    //  |
    //  |
    //  v
    // a = 1;
    // b = ddd();
    // c = null;
    let {expression} = path.node
    if (!types.isSequenceExpression(expression))
        return;
    let body = []
    expression.expressions.forEach(
        express => {
            body.push(types.expressionStatement(express))
        }
    )
    path.replaceInline(body)
}

function RemoveVarComma(path) {
    // var a = 1, b = ddd(), c = null;
    //   |
    //   |
    //   |
    //   v
    // var a = 1;
    // var b = ddd();
    // var c = null;
    let {kind, declarations} = path.node;
    if (declarations.length < 2) return;
    if (types.isForStatement(path.parentPath)) return;
    temp = [];
    declarations.forEach(
        VariableDeclarator => {
            temp.push(types.variableDeclaration(kind, [VariableDeclarator]))
        }
    )
    path.replaceInline(temp);
}

function MergeObj(path) {
    // var _0xb28de8 = {};
    // _0xb28de8["abcd"] = function(_0x22293f, _0x5a165e) {
    //     return _0x22293f == _0x5a165e;
    // };
    // _0xb28de8.dbca = function(_0xfbac1e, _0x23462f, _0x556555) {
    //     return _0xfbac1e(_0x23462f, _0x556555);
    // };
    // _0xb28de8.aaa = function(_0x57e640) {
    //     return _0x57e640();
    // };
    // _0xb28de8["bbb"] = "eee";
    // var _0x15e145 = _0xb28de8;
    //  |
    //  |
    //  |
    //  v
    // var _0xb28de8 = {
    //   "abcd": function (_0x22293f, _0x5a165e) {
    //     return _0x22293f == _0x5a165e;
    //   },
    //   "dbca": function (_0xfbac1e, _0x23462f, _0x556555) {
    //     return _0xfbac1e(_0x23462f, _0x556555);
    //   },
    //   "aaa": function (_0x57e640) {
    //     return _0x57e640();
    //   },
    //   "bbb": "eee"
    // };
    const {id, init} = path.node;
    if (!types.isObjectExpression(init)) // 判断是否是定义对象
        return;
    let name = id.name;
    let properties = init.properties;
    let scope = path.scope;
    let binding = scope.getBinding(name);
    if (!binding || binding.constantViolations.length > 0) { // 确认该对象没有被多次定义
        return;
    }
    let paths = binding.referencePaths;
    scope.traverse(scope.block, {
        AssignmentExpression: function (_path) {
            const left = _path.get("left");
            const right = _path.get("right");
            if (!left.isMemberExpression())
                return;
            const object = left.get("object");
            const property = left.get("property");

            function _pas_path(_path, left) {
                if (_path.parentPath.node.type == 'VariableDeclarator' || _path.parentPath.node.type == 'AssignmentExpression') {
                    _path.replaceWith(left)
                } else {
                    _path.remove();
                }
            }

            if (object.isIdentifier({name: name}) && property.isStringLiteral() && _path.scope == scope) {
                properties.push(types.ObjectProperty(types.valueToNode(property.node.value), right.node));
                _pas_path(_path, left)
            }
            if (object.isIdentifier({name: name}) && property.isIdentifier() && _path.scope == scope) {
                properties.push(types.ObjectProperty(types.valueToNode(property.node.name), right.node));
                _pas_path(_path, left)
            }
        }
    })
    paths.map(function (refer_path) {
        try {
            let bindpath = refer_path.parentPath;
            if (!types.isVariableDeclarator(bindpath.node)) return;
            let bindname = bindpath.node.id.name;
            bindpath.scope.rename(bindname, name, bindpath.scope.block);
            bindpath.remove();
        } catch (e) {
        }
    });
}

function CallToStr(path) {
    // var _0xb28de8 = {
    //     "abcd": function(_0x22293f, _0x5a165e) {
    //         return _0x22293f == _0x5a165e;
    //     },
    //     "dbca": function(_0xfbac1e, _0x23462f, _0x556555) {
    //         return _0xfbac1e(_0x23462f, _0x556555);
    //     },
    //     "aaa": function(_0x57e640) {
    //         return _0x57e640();
    //     },
    //     "bbb": "eee"
    // };
    // var aa = _0xb28de8["abcd"](123, 456);
    // var bb = _0xb28de8["dbca"](bcd, 11, 22);
    // var cc = _0xb28de8["aaa"](dcb);
    // var dd = _0xb28de8["bbb"];
    //   |
    //   |
    //   |
    //   v
    // var aa = 123 == 456;
    // var bb = bcd(11, 22);
    // var cc = dcb();
    // var dd = "eee";
    var node = path.node;
    if (!types.isObjectExpression(node.init)) // 判断是否使用对象
        return;
    var objPropertiesList = node.init.properties;
    if (objPropertiesList.length == 0)
        return;
    var objName = node.id.name;
    // 是否可删除该对象：发生替换时可删除，否则不删除
    var del_flag = false
    var objkeys = {}
    var objlist = objPropertiesList.map(function (prop) {
        var key = prop.key.value
        if (types.isFunctionExpression(prop.value)) {
            var retStmt = prop.value.body.body[0];
            if (typeof retStmt == 'undefined') return;
            if (types.isBinaryExpression(retStmt.argument)) {
                var repfunc = function (_path, args) {
                    if (args.length == 2) {
                        _path.replaceWith(types.binaryExpression(retStmt.argument.operator, args[0], args[1]));
                    }
                }
            } else if (types.isLogicalExpression(retStmt.argument)) {
                var repfunc = function (_path, args) {
                    if (args.length == 2) {
                        _path.replaceWith(types.logicalExpression(retStmt.argument.operator, args[0], args[1]));
                    }
                }
            } else if (types.isCallExpression(retStmt.argument) && types.isIdentifier(retStmt.argument.callee)) {
                var repfunc = function (_path, args) {
                    _path.replaceWith(types.callExpression(args[0], args.slice(1)))
                }
            }
            objkeys[key] = repfunc
        } else if (types.isStringLiteral(prop.value)) {
            var retStmt = prop.value.value;
            objkeys[key] = function (_path) {
                _path.replaceWith(types.stringLiteral(retStmt))
            }
        }
    })
    var fnPath = path.getFunctionParent() || path.scope.path;
    fnPath.traverse({
        CallExpression: function (_path) {
            var _node = _path.node.callee;
            if (!types.isMemberExpression(_path.node.callee))
                return;
            if (!types.isIdentifier(_node.object) || _node.object.name !== objName)
                return;
            if (!(types.isStringLiteral(_node.property) || types.isIdentifier(_node.property)))
                return;
            if (!(objkeys[_node.property.value] || objkeys[_node.property.name]))
                return;
            var args = _path.node.arguments;
            var func = objkeys[_node.property.value] || objkeys[_node.property.name]
            func(_path, args)
            del_flag = true;
        },
        MemberExpression: function (_path) {
            var _node = _path.node;
            if (!types.isIdentifier(_node.object) || _node.object.name !== objName)
                return;
            if (!(types.isStringLiteral(_node.property) || types.isIdentifier(_node.property)))
                return;
            if (!(objkeys[_node.property.value] || objkeys[_node.property.name]))
                return;
            var func = objkeys[_node.property.value] || objkeys[_node.property.name]
            func(_path)
            del_flag = true;
        }
    })

    if (del_flag) {
        // 如果发生替换，则删除该对象, 该处可能出问题，因为字典的内容未必会饱和使用
        path.remove();
    }
}

function delExtra(path) {
    // ['\x49\x63\x4b\x72\x77\x70\x2f\x44\x6c\x67\x3d\x3d',0x123];
    //   |
    //   |
    //   |
    //   v
    // ["IcKrwp/Dlg==", 291];
    delete path.node.extra;
}

function ClearDeadCode(path) {
    function clear(path, toggle) {
        if (toggle) {
            if (path.node.consequent.type == 'BlockStatement') {
                path.replaceWithMultiple(path.node.consequent.body)
            } else {
                path.replaceWith(path.node.consequent)
            }
        } else {
            if (path.node.alternate) {
                if (path.node.alternate.type == 'BlockStatement') {
                    path.replaceWithMultiple(path.node.alternate.body)
                } else {
                    path.replaceWith(path.node.alternate)
                }
            } else {
                path.remove()
            }
        }
    }

    var temps = ['StringLiteral', 'NumericLiteral', 'BooleanLiteral']
    if (path.node.test.type === 'BinaryExpression') {
        if (temps.indexOf(path.node.test.left.type) !== -1 && temps.indexOf(path.node.test.right.type) !== -1) {
            var left = JSON.stringify(path.node.test.left.value)
            var right = JSON.stringify(path.node.test.right.value)
            clear(path, eval(left + path.node.test.operator + right))
        }
    } else if (temps.indexOf(path.node.test.type) !== -1) {
        clear(path, eval(JSON.stringify(path.node.test.value)))
    }
}

function And2If(path) {
    if (path.node.expression.type === 'LogicalExpression') {
        var left = path.node.expression.left
        var right = path.node.expression.right
        if (path.node.expression.operator == '&&') {
            path.replaceWith(types.IfStatement(left, types.BlockStatement([types.ExpressionStatement(right)])))
        }
    }
}

function calcBinary(path) {
    var tps = ['StringLiteral', 'BooleanLiteral', 'NumericLiteral']
    var nod = path.node

    function judge(e) {
        return (tps.indexOf(e.type) != -1) || (e.type == 'UnaryExpression' && tps.indexOf(e.argument.type) != -1)
    }

    function make_rep(e) {
        if (typeof e == 'number') {
            return types.NumericLiteral(e)
        }
        if (typeof e == 'string') {
            return types.StringLiteral(e)
        }
        if (typeof e == 'boolean') {
            return types.BooleanLiteral(e)
        }
        throw Error('unknown type' + typeof e)
    }

    if (judge(nod.left) && judge(nod.right)) {
        path.replaceWith(make_rep(eval(path + '')))
    }
}

function clearNotuseFunc(path) {
    var id = path.node.id;
    var binding = path.scope.getBinding(id.name);
    //如果变量被修改过，则不能进行删除动作。
    if (!binding || binding.constantViolations.length > 0) {
        return;
    }
    //长度为0，说明变量没有被使用过。
    if (binding.referencePaths.length === 0) {
        path.remove();
    }
}

function AddCatchLog(path) {
    var err_name = path.node.param.name
    path.node.body.body.unshift({
        "type": "ExpressionStatement",
        "expression": {
            "type": "CallExpression",
            "callee": {
                "type": "MemberExpression",
                "computed": false,
                "object": {
                    "type": "Identifier",
                    "name": "console"
                },
                "property": {
                    "type": "Identifier",
                    "name": "log"
                }
            },
            "arguments": [
                {
                    "type": "Identifier",
                    "name": err_name
                }
            ]
        }
    })
}


function get_sojson_enc(ast) {
    var first_idx = 0
    for (var i = 0; i < ast.program.body.length; i++) {
        if (ast.program.body[i].type != 'EmptyStatement') {
            first_idx = i;
            break
        }
    }
    var decrypt_code = ast.program.body.slice(first_idx, first_idx + 3)
    var rest_code = ast.program.body.slice(first_idx + 3)
    ast.program.body = decrypt_code
    var {code} = generator(ast, {
        compact: true
    })
    global_code = code
    decryptStr = decrypt_code[2].declarations[0].id.name
    ast.program.body = rest_code
    return ast
}

function pas_sojson_enc(ast) {
    eval(global_code)
    traverse(ast, {
        CallExpression: funToStr,
        StringLiteral: delExtra,
        NumericLiteral: delExtra,
    })
    return ast;

    function funToStr(path) {
        var node = path.node;
        if (!types.isIdentifier(node.callee, {name: decryptStr}))
            return;
        let value = eval(path.toString())
        // console.log("还原前：" + path.toString(), "还原后：" + value);
        path.replaceWith(types.valueToNode(value));
    }

    function delExtra(path) {
        delete path.node.extra;
    }
}

function ReplaceWhile(path) {
    var node = path.node;
    if (!(types.isBooleanLiteral(node.test) || types.isUnaryExpression(node.test) || types.isNumericLiteral(node.test,{value:1})))
        return;
    if (!(node.test.prefix || node.test.value))
        return;
    if (!types.isBlockStatement(node.body))
        return;
    var body = node.body.body;
    if (!types.isSwitchStatement(body[0]) || !types.isMemberExpression(body[0].discriminant) || !types.isBreakStatement(body[1]))
        return;
    var swithStm = body[0];
    var arrName = swithStm.discriminant.object.name;
    var argName = swithStm.discriminant.property.argument.name
    let arr = [];
    let all_presibling = path.getAllPrevSiblings();
    all_presibling.forEach(pre_path => {
        const {declarations} = pre_path.node;
        let {id, init} = declarations[0]
        if (arrName == id.name) {
            arr = init.callee.object.value.split('|');
            pre_path.remove()
        }
        if (argName == id.name) {
            pre_path.remove()
        }
    })
    var caseList = swithStm.cases;
    var resultBody = [];
    arr.map(targetIdx => {
        var targetBody = caseList[targetIdx].consequent;
        if (types.isContinueStatement(targetBody[targetBody.length - 1]))
            targetBody.pop();
        resultBody = resultBody.concat(targetBody)
    });
    path.replaceInline(resultBody);
}


function pas_ob_encfunc(ast) {
    // 找到关键的函数
    var obfuncstr = []
    var obdecname;
    var obsortname;

    function findobsortfunc(path) {
        if (!path.getFunctionParent()) {
            function get_obsort(path) {
                obsortname = path.node.arguments[0].name
                obfuncstr.push('!' + generator(path.node, {minified: true}).code)
                path.stop()
                path.remove()
            }

            path.traverse({CallExpression: get_obsort})
            path.stop()
        }
    }

    function findobsortlist(path) {
        if (path.node.id.name == obsortname) {
            obfuncstr.push(generator(path.node, {minified: true}).code)
            path.stop()
            path.remove()
        }
    }

    function findobfunc(path) {
        var t = path.node.body.body[0]
        if (t && t.type === 'VariableDeclaration') {
            var g = t.declarations[0].init
            if (g && g.type == 'CallExpression' && g.callee.name == obsortname) {
                obdecname = path.node.id.name
                obfuncstr.push(generator(path.node, {minified: true}).code)
                path.stop()
                path.remove()
            }
        }
    }

    traverse(ast, {ExpressionStatement: findobsortfunc})
    traverse(ast, {FunctionDeclaration: findobsortlist})
    traverse(ast, {FunctionDeclaration: findobfunc})
    eval(obfuncstr.join(';'))

    // 收集必要的函数进行批量还原
    var collects = []
    var collect_names = [obdecname]
    var collect_removes = []

    function judge(path) {
        return path.node.body.body.length == 1
            && path.node.body.body[0].type == 'ReturnStatement'
            && path.node.body.body[0].argument.type == 'CallExpression'
            && path.node.body.body[0].argument.callee.type == 'Identifier'
            // && path.node.params.length == 5
            && path.node.id
    }

    function collect_alldecfunc(path) {
        if (judge(path)) {
            var t = generator(path.node, {minified: true}).code
            if (collects.indexOf(t) == -1) {
                collects.push(t)
                collect_names.push(path.node.id.name)
            }
        }
    }

    var collect_removes_var = []

    function collect_alldecvars(path) {
        var left = path.node.id
        var right = path.node.init
        if (right && right.type == 'Identifier' && collect_names.indexOf(right.name) != -1) {
            var t = 'var ' + generator(path.node, {minified: true}).code
            if (collects.indexOf(t) == -1) {
                collects.push(t)
                collect_names.push(left.name)
            }
        }
    }

    traverse(ast, {FunctionDeclaration: collect_alldecfunc})
    traverse(ast, {VariableDeclarator: collect_alldecvars})
    eval(collects.join(';'))

    function parse_values(path) {
        var name = path.node.callee.name
        if (path.node.callee && collect_names.indexOf(path.node.callee.name) != -1) {
            try {
                path.replaceWith(types.StringLiteral(eval(path + '')))
                collect_removes.push(name)
            } catch (e) {
            }
        }
    }

    traverse(ast, {CallExpression: parse_values})

    function collect_removefunc(path) {
        if (judge(path) && collect_removes.indexOf(path.node.id.name) != -1) {
            path.remove()
        }
    }

    function collect_removevars(path) {
        var left = path.node.id
        var right = path.node.init
        if (right && right.type == 'Identifier' && collect_names.indexOf(right.name) != -1) {
            path.remove()
        }
    }

    traverse(ast, {FunctionDeclaration: collect_removefunc})
    traverse(ast, {VariableDeclarator: collect_removevars})
}

function del_sojson_extra(ast) {
    function get_root(path) {
        var list = [path]
        while (path.parentPath) {
            path = path.parentPath
            list.push(path)
        }
        return list[list.length - 2]
    }

    function remove_temp1(path, fname) {
        var bind = path.scope.getBinding(fname)
        for (var i = 0; i < bind.referencePaths.length; i++) {
            var root = get_root(bind.referencePaths[i])
            root.need_remove = true
            root.traverse({
                Identifier: function (path) {
                    var idbind = path.scope.getBinding(path.node.name)
                    if (!idbind) return
                    get_root(idbind.path).need_remove = true
                }
            })
        }
    }

    traverse(ast, {
        'FunctionDeclaration|FunctionExpression': function (path) {
            if (path.getFunctionParent() == null) {
                var ex1 = 0
                var ex2 = 0
                var ex3 = 0
                path.traverse({
                    StringLiteral: function (path) {
                        if (path.node.value == 'debugger') {
                            ex1 = 1
                        }
                        if (path.node.value == 'action') {
                            ex2 = 1
                        }
                        if (path.node.value == 'stateObject') {
                            ex3 = 1
                        }
                    }
                })
                if ((ex1 + ex2 + ex3) >= 2) {
                    if (path.node.id && path.node.id.name) {
                        remove_temp1(path, path.node.id.name)
                    }
                }
                var ex1 = 0
                var ex2 = 0
                var ex3 = 0
                path.traverse({
                    StringLiteral: function (path) {
                        if (path.node.value == "\\w+ *\\(\\) *{\\w+ *['|\"].+['|\"];? *}") {
                            ex1 = 1
                        }
                        if (path.node.value == "(\\\\[x|u](\\w){2,4})+") {
                            ex2 = 1
                        }
                        if (path.node.value == "window") {
                            ex3 = 1
                        }
                    }
                })
                if ((ex1 + ex2 + ex3) >= 2) {
                    get_root(path).need_remove = true
                    remove_temp1(path, path.parentPath.node.callee.name)
                    remove_temp1(path, path.parentPath.parentPath.node.id.name)
                }
                var ex1 = 0
                var ex2 = 0
                var ex3 = 0
                path.traverse({
                    StringLiteral: function (path) {
                        if (path.node.value == "return (function() {}.constructor(\"return this\")( ));") {
                            ex1 = 1
                        }
                        if (path.node.value == "debug") {
                            ex2 = 1
                        }
                        if (path.node.value == "exception") {
                            ex3 = 1
                        }
                    }
                })
                if ((ex1 + ex2 + ex3) >= 2) {
                    get_root(path).need_remove = true
                    remove_temp1(path, path.parentPath.node.callee.name)
                    remove_temp1(path, path.parentPath.parentPath.node.id.name)
                }
            }
        }
    })
    traverse(ast, {
        enter: function (path) {
            if (path.need_remove) {
                path.remove()
            }
        }
    })
}

function del_ob_extra(ast) {
    var setinterval_func;

    function find_gar_outfunc(path) {
        if (!path.getFunctionParent()) {
            function judge(path) {
                if (path.node.callee.type == 'MemberExpression'
                    && path.node.callee.property
                    && path.node.callee.property.type == 'Identifier'
                    && path.node.callee.property.name == 'apply'
                    && path.node.callee.object.type == 'CallExpression'
                    && path.node.callee.object.arguments
                    && path.node.callee.object.arguments[0]
                    && path.node.callee.object.arguments[0].value == 'debugger'
                    && path.node.arguments[0]
                    && path.node.arguments[0].value == 'stateObject'
                ) {
                    var func = path.getFunctionParent().getFunctionParent()
                    setinterval_func = func.node.id.name
                    func.remove()
                }
            }

            path.traverse({CallExpression: judge})
        }
    }

    function remove_setinterval_func(path) {
        if (!path.getFunctionParent() && path.node.callee.type == 'Identifier' && path.node.callee.name == 'setInterval') {
            function judge(path) {
                if (path.node.callee.type == 'Identifier' && path.node.callee.name == setinterval_func) {
                    path.getFunctionParent().parentPath.remove()
                }
            }

            path.traverse({CallExpression: judge})
        }
    }

    var once = false

    function remove_a(path) {
        if (path.node.value == '(((.+)+)+)+$'
            && path.parentPath.node.type == 'CallExpression'
            && path.parentPath.node.callee.type == 'MemberExpression'
            && path.parentPath.node.callee.property.type == 'Identifier'
            && path.parentPath.node.callee.property.name == 'search'
            && !once
        ) {
            var a = path.getFunctionParent().parentPath
            var b = a.parentPath
            var c = b.getFunctionParent()
            if (!c) {
                c = b
                while (c.parentPath) {
                    c = c.parentPath
                }
            }
            var ra = a.node.callee.name
            var rb = b.node.id.name

            function remove_a1(path) {
                if (path.node.id.name == ra && (path.getFunctionParent() == c || path.getFunctionParent() == null)) {
                    path.remove()
                }
            }

            function remove_a2(path) {
                if (path.node.callee.name == rb && (path.getFunctionParent() == c || path.getFunctionParent() == null)) {
                    path.remove()
                }
            }

            c.traverse({
                VariableDeclarator: remove_a1,
                CallExpression: remove_a2
            })
            try {
                b.remove()
            } catch (e) {
            }
            once = true
        }
    }

    function remove_b(path) {
        if (path.node.value == "\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)") {
            var a = path.getFunctionParent().parentPath
            var b = a.getFunctionParent()
            var c = b.getFunctionParent()
            if (!c) {
                c = b
                while (c.parentPath) {
                    c = c.parentPath
                }
            }
            if (!a.node.callee) {
                return
            }
            var ra = a.node.callee.name

            function remove_b1(path) {
                if (path.node.id.name == ra && (path.getFunctionParent() == c || path.getFunctionParent() == null)) {
                    path.remove()
                }
            }

            c.traverse({VariableDeclarator: remove_b1})
            try {
                b.parentPath.remove()
            } catch (e) {
            }
        }
    }

    function remove_c(path) {
        if (path.node.value == "return (function() {}.constructor(\"return this\")( ));") {
            var a = path.getFunctionParent().parentPath
            while (!a.node.callee) {
                a = a.parentPath
            }
            var b = a.parentPath
            var c = b.getFunctionParent()
            if (!c) {
                c = b
                while (c.parentPath) {
                    c = c.parentPath
                }
            }
            var ra = a.node.callee.name
            var rb = b.node.id.name

            function remove_a1(path) {
                if (path.node.id.name == ra && path.getFunctionParent() == c || path.getFunctionParent() == null) {
                    path.remove()
                }
            }

            function remove_a2(path) {
                if (path.node.callee.name == rb && path.getFunctionParent() == c || path.getFunctionParent() == null) {
                    path.remove()
                }
            }

            c.traverse({
                VariableDeclarator: remove_a1,
                CallExpression: remove_a2
            })
            try {
                b.remove()
            } catch (e) {
            }
            once = true
        }
    }

    try {
        traverse(ast, {FunctionDeclaration: find_gar_outfunc})
        traverse(ast, {CallExpression: remove_setinterval_func})
        traverse(ast, {StringLiteral: remove_a})
        traverse(ast, {StringLiteral: remove_b})
        traverse(ast, {StringLiteral: remove_c})
    } catch (e) {
        console.log('自动去除 ob 检测处理失败')
        console.log(e)
    }
}


function mk_atob_btoa(r) {
    var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        t = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
    return {
        atob: function (r) {
            r = r + '';
            var a, e, o, h, c, i, n;
            for (i = r.length, c = 0, n = ""; c < i;) {
                do {
                    a = t[255 & r.charCodeAt(c++)]
                } while (c < i && -1 == a);
                if (-1 == a) break;
                do {
                    e = t[255 & r.charCodeAt(c++)]
                } while (c < i && -1 == e);
                if (-1 == e) break;
                n += String.fromCharCode(a << 2 | (48 & e) >> 4);
                do {
                    if (61 == (o = 255 & r.charCodeAt(c++))) return n;
                    o = t[o]
                } while (c < i && -1 == o);
                if (-1 == o) break;
                n += String.fromCharCode((15 & e) << 4 | (60 & o) >> 2);
                do {
                    if (61 == (h = 255 & r.charCodeAt(c++))) return n;
                    h = t[h]
                } while (c < i && -1 == h);
                if (-1 == h) break;
                n += String.fromCharCode((3 & o) << 6 | h)
            }
            return n
        }, btoa: function (r) {
            r = r + '';
            var t, e, o, h, c, i;
            for (o = r.length, e = 0, t = ""; e < o;) {
                if (h = 255 & r.charCodeAt(e++), e == o) {
                    t += a.charAt(h >> 2), t += a.charAt((3 & h) << 4), t += "==";
                    break
                }
                if (c = r.charCodeAt(e++), e == o) {
                    t += a.charAt(h >> 2), t += a.charAt((3 & h) << 4 | (240 & c) >> 4), t += a.charAt((15 & c) << 2), t += "=";
                    break
                }
                i = r.charCodeAt(e++), t += a.charAt(h >> 2), t += a.charAt((3 & h) << 4 | (240 & c) >> 4), t += a.charAt((15 & c) << 2 | (192 & i) >> 6), t += a.charAt(63 & i)
            }
            return t
        }
    }
}

var atob_btoa = mk_atob_btoa()
if (typeof global !== 'undefined') {
    global.btoa = atob_btoa.btoa
    global.atob = atob_btoa.atob
}

function v_packtype(value) {
    if (typeof value == 'number') {
        return types.NumericLiteral(value)
    }
    if (typeof value == 'string') {
        return types.StringLiteral(value)
    }
    if (typeof value == 'boolean') {
        return types.BooleanLiteral(value)
    }
    if (value === undefined) {
        return types.Identifier('undefined')
    }
    throw TypeError(`not find value type ${typeof value}`)
}

var jsfuck_toggle = 0

function v_Unary1(path) {
    try {
        path.replaceWith(v_packtype(eval(path + '')));
        jsfuck_toggle += 1
    } catch (e) {
    }
}

function v_Binary1(path) {
    try {
        path.replaceWith(v_packtype(eval(path + '')));
        jsfuck_toggle += 1
    } catch (e) {
    }
}

function v_Member1(path) {
    try {
        path.replaceWith(v_packtype(eval(path + '')));
        jsfuck_toggle += 1
    } catch (e) {
    }
}

function v_Call1(path) {
    var location = 'http://www.test.com'
    var v = /^\[\]\[(?:"|')[^"]+(?:"|')\]\[(?:"|')constructor(?:"|')\]\((?:"|')return (location|escape|unescape)(?:"|')\)/.exec(path + '')
    if (v) {
        path.replaceWith(types.StringLiteral(eval(v[1]) + ''))
    }
    if (typeof window == 'undefined') {
        var v = /^\[\]\[(?:"|')[^"]+(?:"|')\]\[(?:"|')constructor(?:"|')\]\((?:"|')return (statusbar|personalbar|scrollbars|toolbar)(?:"|')\)/.exec(path + '')
        if (v) {
            path.replaceWith(types.StringLiteral('[object BarProp]'))
        }
    }
}

const if2Switch =
    {
        IfStatement(path)
        {
            let {node,parentPath} = path;

            if (!parentPath.parentPath.isWhileStatement()) return;  //定位到最外层的if语句

            let prevSibling = path.getPrevSibling();
            let name = prevSibling.node.expression.left.name;  //获取name，好进行判断
            let switchId =  prevSibling.node.expression.right; //作为switch语句的discriminant节点

            let caseNodes = [];

            path.traverse(//遍历里面的if语句
                {
                    IfStatement(ppath)
                    {
                        let {test,consequent,alternate} = ppath.node;
                        if (!types.isBinaryExpression(test) || !types.isIdentifier(test.left,{name:name}))
                        {//不满足_$DM < XXX 直接过滤掉
                            return;
                        }

                        if (types.isIfStatement(consequent.body[0]) &&
                            types.isBinaryExpression(consequent.body[0].test) &&
                            types.isIdentifier(consequent.body[0].test.left,{name:name}))
                        {// consequent 里的节点还是 if 语句并且满足 _$DM < XXX 直接过滤掉

                            return;
                        }
                        else
                        {
                            let rigthValue = test.right.value - 1;
                            if (!types.isReturnStatement(consequent.body[consequent.body.length-1]))
                            {
                                consequent.body.push(types.BreakStatement());
                            }
                            //生成SwitchCase节点
                            caseNodes[rigthValue] = types.SwitchCase(types.valueToNode(rigthValue),consequent.body);
                        }
                        if (types.isIfStatement(alternate) &&
                            types.isBinaryExpression(alternate.test) &&
                            types.isIdentifier(alternate.test.left,{name:name}))
                        {//条件判断同上。判断 alternate节点有一种更好的方法，请兄弟们自行处理。
                            return;
                        }
                        else
                        {
                            if (!types.isReturnStatement(alternate.body[alternate.body.length-1]))
                            {
                                alternate.body.push(types.BreakStatement());
                            }
                            for (var i=0; i<caseNodes.length; i++)
                            {//判断数组caseNodes空缺的部分，夹逼原则
                                if (!caseNodes[i])
                                {
                                    break;
                                }
                            }
                            caseNodes[i] = types.SwitchCase(types.valueToNode(i),alternate.body);
                        }
                    },
                })

            if (caseNodes.length > 0)
            {
                let switchNode = types.SwitchStatement(switchId,caseNodes);
                path.replaceWith(switchNode);
                prevSibling.remove();
            }
        }
    }


function muti_process_defusion(jscode) {
    var ast = parser.parse(jscode);

    // 通用解混淆部分
    traverse(ast, {StringLiteral: delExtra,})                   // 清理二进制显示内容
    traverse(ast, {NumericLiteral: delExtra,})                  // 清理二进制显示内容
    traverse(ast, {ConditionalExpression: TransCondition,});    // 三元表达式
    traverse(ast, {ExpressionStatement: ConditionToIf,});       // 三元表达式转换成if
    traverse(ast, {ExpressionStatement: And2If});               // 单行语句如果是 a && b 形式转换成 if(a){ b }
    traverse(ast, {VariableDeclaration: ConditionVarToIf,});    // 赋值语句的 三元表达式转换成if
    traverse(ast, {ExpressionStatement: RemoveComma,});         // 逗号表达式转换
    traverse(ast, {VariableDeclaration: RemoveVarComma,});      // 赋值语句的 逗号表达式转换
    traverse(ast, {MemberExpression: FormatMember,});           // obj['func1']['func2']() --> obj.func1.func2()
    traverse(ast, {IfStatement: ClearDeadCode});                // 清理死代码
    traverse(ast, {BinaryExpression: {exit: calcBinary}})       // 二元运算合并
    traverse(ast, {CatchClause: AddCatchLog});                  // 给所有的 catch(e){} 后面第一条语句添加异常输出。
    var {code} = generator(ast, {jsescOption: {minimal: true,}});
    return code;
}

function muti_process_sojsondefusion(jscode) {
    var ast = parser.parse(jscode);

    // if (ast.program.body.length == 1) {
    //     ast.program.body = ast.program.body[0].expression.callee.body.body
    // }
    //
    // // ob 解混淆处理部分
    // ast = get_sojson_enc(ast)
    // ast = pas_sojson_enc(ast)
    //traverse(ast,if2Switch)
    traverse(ast, {BinaryExpression: {exit: calcBinary}})
    // traverse(ast, {VariableDeclarator: {exit: MergeObj},});     // 可能出问题（不可通用）
    // traverse(ast, {VariableDeclarator: {exit: MergeObj},});     // 可能出问题（不可通用）// 该函数重复数次，为了兼容旧的ob混淆版本
    // traverse(ast, {VariableDeclarator: {exit: MergeObj},});     // 可能出问题（不可通用）
    // traverse(ast, {VariableDeclarator: {exit: MergeObj},});     // 可能出问题（不可通用）
    traverse(ast, {BinaryExpression: {exit: calcBinary}})
    //traverse(ast, {VariableDeclarator: {exit: CallToStr},});    // 可能出问题（不可通用）
    traverse(ast, {IfStatement: ClearDeadCode});                // 清理死代码，这里不清理可能会导致错误
    traverse(ast, {WhileStatement: {exit: [ReplaceWhile]},});   // 反控制流平坦化

    // 通用解混淆部分
    traverse(ast, {StringLiteral: delExtra,})                   // 清理二进制显示内容
    traverse(ast, {NumericLiteral: delExtra,})                  // 清理二进制显示内容
    traverse(ast, {ConditionalExpression: TransCondition,});    // 三元表达式
    traverse(ast, {ExpressionStatement: ConditionToIf,});       // 三元表达式转换成if
    traverse(ast, {ExpressionStatement: And2If});               // 单行语句如果是 a && b 形式转换成 if(a){ b }
    traverse(ast, {VariableDeclaration: ConditionVarToIf,});    // 赋值语句的 三元表达式转换成if
    traverse(ast, {ExpressionStatement: RemoveComma,});         // 逗号表达式转换
    traverse(ast, {VariableDeclaration: RemoveVarComma,});      // 赋值语句的 逗号表达式转换
    traverse(ast, {MemberExpression: FormatMember,});           // obj['func1']['func2']() --> obj.func1.func2()
    traverse(ast, {IfStatement: ClearDeadCode});                // 清理死代码
    traverse(ast, {BinaryExpression: {exit: calcBinary}})       // 二元运算合并
    traverse(ast, {CatchClause: AddCatchLog});                  // 给所有的 catch(e){} 后面第一条语句添加异常输出。

    del_sojson_extra(ast)

    var {code} = generator(ast, {jsescOption: {minimal: true,}});
    return code;
}


function muti_process_obdefusion(jscode) {
    var ast = parser.parse(jscode);

    // ob 解混淆处理部分
    pas_ob_encfunc(ast)
    traverse(ast, {BinaryExpression: {exit: calcBinary}})
    traverse(ast, {VariableDeclarator: {exit: MergeObj},});     // 可能出问题（不可通用）
    traverse(ast, {BinaryExpression: {exit: calcBinary}})
    traverse(ast, {VariableDeclarator: {exit: CallToStr},});    // 可能出问题（不可通用）
    traverse(ast, {IfStatement: ClearDeadCode});                // 清理死代码，这里不清理可能会导致错误
    traverse(ast, {WhileStatement: {exit: [ReplaceWhile]},});   // 反控制流平坦化

    // 通用解混淆部分
    traverse(ast, {StringLiteral: delExtra,})                   // 清理二进制显示内容
    traverse(ast, {NumericLiteral: delExtra,})                  // 清理二进制显示内容
    traverse(ast, {ConditionalExpression: TransCondition,});    // 三元表达式
    traverse(ast, {ExpressionStatement: ConditionToIf,});       // 三元表达式转换成if
    traverse(ast, {VariableDeclaration: ConditionVarToIf,});    // 赋值语句的 三元表达式转换成if
    traverse(ast, {ExpressionStatement: RemoveComma,});         // 逗号表达式转换
    traverse(ast, {VariableDeclaration: RemoveVarComma,});      // 赋值语句的 逗号表达式转换
    traverse(ast, {MemberExpression: FormatMember,});           // obj['func1']['func2']() --> obj.func1.func2()
    traverse(ast, {IfStatement: ClearDeadCode});                // 清理死代码
    traverse(ast, {BinaryExpression: {exit: calcBinary}})       // 二元运算合并
    traverse(ast, {CatchClause: AddCatchLog});                  // 给所有的 catch(e){} 后面第一条语句添加异常输出。
    // traverse(ast, {FunctionDeclaration: clearNotuseFunc})       // 该处有问题 // 该处可以使用 Uglify 库优化功能自动删除

    // ob 解混淆部分，去除额外代码
    del_ob_extra(ast)

    var {code} = generator(ast, {jsescOption: {minimal: true,}});
    return code;
}

function muti_process_jsfuckdefusion(jscode) {
    var ast = parser.parse(jscode);
    while (1) {
        if (typeof location !== 'undefined' && location.href.indexOf('http') != 0) { // 处理你的脚本运行在插件时的问题
            var _Function = Function
            Object.defineProperty(Function.prototype, 'constructor', {
                value: function () {
                    if (arguments[0] == 'return location') {
                        return function () {
                            return {
                                toString: function () {
                                    return 'http://'
                                }
                            }
                        }
                    }
                    return _Function.apply(this, arguments)
                }
            })
        }
        traverse(ast, {UnaryExpression: v_Unary1,})
        traverse(ast, {BinaryExpression: v_Binary1,})
        traverse(ast, {MemberExpression: v_Member1,})
        traverse(ast, {CallExpression: v_Call1,})
        if (typeof location !== 'undefined' && location.href.indexOf('http') != 0) {
            Object.defineProperty(Function.prototype, 'constructor', {value: _Function})
        }
        if (jsfuck_toggle == 0) {
            break
        } else {
            jsfuck_toggle = 0
        }
    }
    var code = generator(ast, {jsescOption: {minimal: true,}}).code;
    return code;
}

function muti_process_aline(jscode) {
    var ast = parser.parse(jscode)
    traverse(ast, {
        enter: function (path) {
            types.removeComments(path.node);
        }
    })
    return generator(ast, {minified: true}).code
}

const fs = require('fs');
var jscode = fs.readFileSync("../demos/wenshu.js", {
    encoding: "utf-8"
});
code = muti_process_sojsondefusion(jscode);
console.log(code);
fs.writeFileSync('./code.js', code, {
    encoding: "utf-8"
})
