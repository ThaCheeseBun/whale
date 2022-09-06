import path from "path";
import http from "http";
import fs from "fs";
import express from "express";
import { WebSocketServer } from "ws";

// create and initialize servers
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static(path.join(process.cwd(), "static")));

// websocket handler
wss.on("connection", function (ws) {
    ws.on("message", function (data) {
        console.log("received: %s", data);
    });

    const txt = fs.readFileSync("./testdata.json", "utf-8");
    ws.send(JSON.stringify(JSON.parse(txt)));
});

// listen
server.listen(8081, function () {
    console.log("Listening on port 8081");
});
