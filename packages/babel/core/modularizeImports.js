const fs = require("fs");
const parser = require("@babel/parser");
const { default: generator } = require("@babel/generator");

const js_code = fs.readFileSync("../demos/lodash.js", {
  encoding: "utf-8",
});

const ast = parser.parse(js_code,{
  sourceType: 'unambiguous',
    plugins: [
    "typescript",
    "jsx"
  ],
})

const core = require('@babel/core')

const a = (core.transform(js_code, {
  'plugins': ['lodash'],
  'presets': [['@babel/env', { 'targets': { 'node': 6 } }]]
}))

console.log(a.code)




