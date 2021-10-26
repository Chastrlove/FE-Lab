import * as express from "express";
const path = require('path') ;

const app = express();

const http = require('http');
const server = http.createServer(app);

const dirname = __dirname

app.get('/',(req,res)=>{
    res.sendFile(path.join(dirname, './index.html'));
})

const io = require('socket.io')(server);

io.on("connect", (socket) => {
    console.log(`connect ${socket.id}`);

    socket.on("ping", (cb) => {
        console.log("ping");
        cb();
    });

    socket.on("disconnect", () => {
        console.log(`disconnect ${socket.id}`);
    });
});

server.listen(4000);
