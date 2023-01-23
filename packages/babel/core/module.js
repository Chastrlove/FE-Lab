const code = `
@observer
export class Alink extends React.Component{
}
`;

const orderBy = require('lodash/fp/orderBy');

const parser = require('@babel/parser');
const types = require('@babel/types');
const _ = require('lodash');

const a = orderBy((x) => {
  console.log(x)
  return x + 1;
})([1, 2, 3]);

console.log(a);

//
// const { default: generator } = require('@babel/generator');
// const {
//   importSpecifier,
//   stringLiteral,
//   importDefaultSpecifier,
//   identifier,
//   isImportDefaultSpecifier,
//   isImportSpecifier,
//   importDeclaration,
//   StringLiteral,
// } = require('@babel/types');
// const traverse = require('@babel/traverse').default;
// const ast = parser.parse(code, {
//   sourceType: 'unambiguous',
//   allowImportExportEverywhere: true,
//   allowReturnOutsideFunction: true,
//   startLine: 1,
//   tokens: true,
//   plugins: [
//     ["decorators", { decoratorsBeforeExport: true }],
//     "asyncGenerators",
//     "bigInt",
//     "classProperties",
//     "classPrivateProperties",
//     "classPrivateMethods",
//     "legacy-decorators",
//     "doExpressions",
//     "dynamicImport",
//     "exportDefaultFrom",
//     "exportNamespaceFrom",
//     "functionBind",
//     "functionSent",
//     "importMeta",
//     "logicalAssignment",
//     "nullishCoalescingOperator",
//     "numericSeparator",
//     "objectRestSpread",
//     "optionalCatchBinding",
//     "optionalChaining",
//     ["pipelineOperator", { proposal: "minimal" }],
//     "throwExpressions",
//     "typescript",
//     "jsx"
//   ],
// });
//
// const isDefaultSpecifierExist = (specifiers, importName) => {
//   for (let spec of specifiers) {
//     if (types.isImportDefaultSpecifier(spec)) {
//       return spec;
//     }
//     if (types.isImportSpecifier(spec) && spec.imported.name === 'default') {
//       return spec;
//     }
//   }
// };
//
// const isNamedSpecifierExist = (specifiers, importName) => {
//   for (let spec of specifiers) {
//     if (types.isImportSpecifier(spec) && spec.imported.name === importName) {
//       return spec;
//     }
//   }
// };
//
// const addImport = (
//   origin_specifiers = [],
//   { source, importName, isDefault },
// ) => {
//   if (isDefault) {
//     const _default = isDefaultSpecifierExist(origin_specifiers);
//     const spec = _default
//       ? _default
//       : importDefaultSpecifier(identifier(importName));
//     return {
//       spec: spec,
//       specifiers: _default
//         ? origin_specifiers
//         : origin_specifiers.unshift(spec),
//     };
//   } else {
//     const _named = isNamedSpecifierExist(origin_specifiers, importName);
//     const spec = _named
//       ? _named
//       : importSpecifier(identifier(importName), identifier(importName));
//     return {
//       spec: spec,
//       specifiers: _named ? origin_specifiers : origin_specifiers.push(spec),
//     };
//   }
// };
//
// traverse(ast, {
//   Program(path) {
//     const imports = [];
//
//     path.traverse({
//       ImportDeclaration(path) {
//         const { node } = path;
//
//         const imported = [];
//         const specifiers = [];
//
//         imports.push({
//           self: path,
//           source: node.source.value,
//           imported,
//           specifiers,
//         });
//
//         for (const specifier of path.get('specifiers')) {
//           const local = specifier.node.local.name;
//
//           if (specifier.isImportDefaultSpecifier()) {
//             imported.push('default');
//             specifiers.push({
//               kind: 'named',
//               imported: 'default',
//               local,
//             });
//           }
//
//           if (specifier.isImportSpecifier()) {
//             const importedName = specifier.node.imported.name;
//             imported.push(importedName);
//             specifiers.push({
//               kind: 'named',
//               imported: importedName,
//               local,
//             });
//           }
//
//           if (specifier.isImportNamespaceSpecifier()) {
//             imported.push('*');
//             specifiers.push({
//               kind: 'namespace',
//               local,
//             });
//           }
//         }
//       },
//     });
//     const newSpecifiers = [];
//     _.each(imports, (module) => {
//       if (module.source !== 'lodash') {
//         return;
//       }
//       const specs = _.sortBy(
//         module.specifiers,
//         (spec) => spec.imported === 'default',
//       );
//       _.each(specs, (spec) => {
//         const { imported, local } = spec;
//         const binding = path.scope.getBinding(local);
//         if (!binding) {
//           return;
//         }
//         const { importKind = 'value' } = binding.path.parent;
//
//         // Skip type annotation imports.
//         if (importKind !== 'value') {
//           return;
//         }
//         _.each(binding.referencePaths, (refPath) => {
//           const { node, parentPath } = refPath;
//           const { type } = node;
//
//           if (imported && imported !== 'default') {
//             const { spec } = addImport(newSpecifiers, {
//               source: 'lodash',
//               importName: imported,
//               isDefault: false,
//             });
//             refPath.replaceWith({ type, name: spec.local.name });
//           } else if (parentPath.isMemberExpression()) {
//             const key = refPath.parent.property.name;
//             const { spec } = addImport(newSpecifiers, {
//               source: 'lodash',
//               importName: key,
//               isDefault: false,
//             });
//             parentPath.replaceWith({ type, name: spec.local.name });
//           }
//         });
//       });
//       module.self.remove();
//     });
//     if (newSpecifiers.length > 0) {
//       const newDeclarations = importDeclaration(
//         newSpecifiers,
//         stringLiteral('lodash'),
//       );
//       path.node.body.unshift(newDeclarations);
//     }
//   },
// });
//
// let code_g = generator(ast,{decoratorsBeforeExport:true}).code;
// console.log(code_g);
