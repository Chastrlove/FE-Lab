const code =`
import path from 'path';
path.join();
`
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const ast = parser.parse(code,{
    sourceType: 'module'
})


traverse(ast, {
   ImportDeclaration:{
     enter(path){
       console.log('enter');
       const a = path.node.specifiers[0].local.name
       console.log(a)

       path.scope.getBinding(a)
     },
     exit(path){
       console.log(123)
     }

   }
})
