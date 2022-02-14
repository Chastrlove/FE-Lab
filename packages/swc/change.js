// const swc = require("@swc/core");
// const fs = require('fs');
//
// fs.readFile('./index.tsx','utf8',async(err,buf)=>{
//   const { code, map } =  await swc.minify(
//     buf,{
//       compress: {
//
//       },
//       mangle: true,
//       sourceMap:true,
//       // ecma:5,
//       // module:false,
//     }
//   );
//   console.log(code)
// })


// fs.readFile('./index.tsx','utf8',async(err,buf)=>{
//   const result = require('esbuild').transformSync(buf, {
//     minify: true,
//
//   })
//   console.log(result.code)
// })

const swc = require("@swc/core");

swc
  .transform("const a=13", {
    // Some options cannot be specified in .swcrc
    // All options below can be configured via .swcrc
    jsc: {
      parser: {
        syntax: "ecmascript",
      },
      transform: {},
    },
  })
  .then((output) => {
    console.log(output.code)
  });






