import express from "express";
import * as fs from "fs";
import * as path from "path";

const app = express();

app.use(express.static(path.resolve("./static")));

app.get('/getName',(req,res)=>{
  res.cookie('cookie','123',{domain:"localhost"})
  res.send('mama')
})

app.listen(8001, () => {
  console.log("8001启动");
});
