import * as express from "express";
import * as fs from "fs";
import * as path from "path";

const app = express();

app.use(express.static(path.resolve("./static")));

app.post('/getName',(req,res)=>{
  res.send('mama')
})

app.listen(8001, () => {
  console.log("8001启动");
});
