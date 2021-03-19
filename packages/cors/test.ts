import * as express from "express";
import * as bodyParser from "body-parser";
import * as fs from "fs";
import * as path from "path";

const app = express();

app.use(bodyParser.json());

app.post('/getOtherSiteName', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin',"*");
    // res.setHeader('Access-Control-Allow-Credentials','true')
    res.send('mama')
})

/**
 * 预检查
 */
app.options('/getOtherSiteName', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin',"*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );
    // res.setHeader('Access-Control-Max-Age','86400')
    res.setHeader('Access-Control-Allow-Methods','DELETE')
    res.status(204).send('');
})

app.listen(8002, () => {
    console.log("8002启动");
});
