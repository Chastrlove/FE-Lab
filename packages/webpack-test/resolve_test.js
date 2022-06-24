// import jsCookie from 'js-cookie'
// jsCookie.set()

const resolve = require("enhanced-resolve");
const path = require('path')

console.log(path.resolve('node_modules'))

const myResolve = resolve.create({
    conditionNames:['node']
    // see more options below
});


myResolve(path.resolve('node_modules'), "js-cookie", (err, result) => {
    console.log(err,result); // === "/some/path/node_modules/module/dir/index.js"
});
