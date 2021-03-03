const fs = require('fs');
const path = require('path');
const config = require('./minipack.config.js');
const entry = config.entry;
const output = config.output
const babelParser = require('@babel/parser');
const prettier= require('prettier')
const { transformFromAst } = require('@babel/core');
const traverse = require('@babel/traverse').default;

const createAsset = (fileName) => {
    const content = fs.readFileSync(fileName, 'utf-8');

    const ast = babelParser.parse(content, {
        sourceType: 'module'
    });
    const { code } = transformFromAst(ast, null, { presets: ['@babel/preset-env'] });

    const dependencies = [];
    traverse(ast, {
        ImportDeclaration: ({ node }) => {
            dependencies.push(node.source.value);
        }
    });
    return {
        dependencies,
        code
    };
};

const main = createAsset(entry);

const graph = {
    [entry]: main
};

const searchDeep=(fileName,assert)=>{
    const dependencies = assert['dependencies'];
    assert.mapping = {};
    const dirname = path.dirname(fileName);
    for (const name of dependencies) {
        const curPath = path.join(dirname, name);
        const child = createAsset(curPath);
        searchDeep(curPath,child)
        graph[curPath] = child;
        assert.mapping[name] = curPath;
    }
}

for (const fileName in graph) {
    const assert = graph[fileName];
    searchDeep(fileName,assert)
}

let modules=''

for (const fileName in graph) {
    const mod = graph[fileName];
    modules+=`'${fileName}':[
        function(require,module,exports){
            ${mod.code}
        },
        ${JSON.stringify(mod.mapping)},
    ],`
}

const result = `
 (function(modules){
    function require(moduleId){
        const [fn,mapping] =modules[moduleId]
        const localRequire= (name)=>{
           return require(mapping[name])
        };
        const module={exports:{}};
        fn(localRequire,module,module.exports)
        return module.exports
    }
    require('${entry}')
 })({${modules}})`

// 写入 ./dist/bundle.js
fs.writeFile(`${output.path}/${output.filename}`, prettier.format(result), (err) => {
    if (err) throw err;
    console.log('文件已被保存');
})
