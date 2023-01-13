import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.redirect(301, 'http://localhost:8001/red');
});

app.get("/red", (req, res) => {
  res.send("123")
});


app.listen(8001, () => {
  console.log("start");
});
