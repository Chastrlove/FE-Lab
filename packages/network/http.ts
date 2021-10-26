import * as express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("123");
});

app.listen(8001, () => {
  console.log("start");
});
