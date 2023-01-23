const swcCss = require("@swc/css");

const style = `
.aa{
color:red;
top:0;
bottom:0;
right:0;
left:0;
}
.aa:after{
width: 0;
      visibility: hidden;
      content: '\\a0';
}
`;

swcCss.minify(Buffer.from(style)).then((data)=>{
  console.log(data)
});
