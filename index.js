import path from "node:path";
import http from "node:http";
import fs from "node:fs";
import express from "express";
import { WebSocketServer } from "ws";
import crypto from "node:crypto";

// create and initialize servers
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });
const clients = {};
app.use(express.static(path.join(process.cwd(), "static")));

// websocket handler
wss.on("connection", function (ws) {

    ws.on("close", function () {
        clients[ws.wid].timeout = setTimeout(function () {
            delete clients[ws.wid];
        }, 30000);
    });

    ws.on("message", function (data) {
        const msg = JSON.parse(data);
        switch (msg.type) {
            case "request":

                const c1 = clients[msg.data];
                if (!c1)
                    return ws.send(JSON.stringify({
                        type: "response",
                        err: "Client not found"
                    }));
                if (!c1.overlay)
                    return ws.send(JSON.stringify({
                        type: "response",
                        err: "Client not overlay"
                    }));
                c1.send(JSON.stringify({
                    type: "request",
                    data: ws.wid
                }));

                break;
            case "response":

                const c2 = clients[msg.data.id];
                if (!c2 || c2.overlay)
                    return;
                c2.send(JSON.stringify({
                    type: "response",
                    data: msg.data
                }));

                break;
            default:
                break;
        }
    });

    // send sample data cuz i no have data
    const txt = fs.readFileSync("./testdata.json", "utf-8");
    ws.send(JSON.stringify({
        type: "data",
        data: JSON.parse(txt),
    }));
});

// handle websocket requests or "upgrades"
server.on("upgrade", function (req, sock, head) {
    wss.handleUpgrade(req, sock, head, function (ws) {
        if (req.url.includes("resume")) {
            
        } else {
            const id = crypto.randomBytes(3).toString("hex");
            clients[id] = {
                overlay: req.url.includes("overlay"),
                resume: crypto.randomBytes(4).toString("hex"),
                socket: ws,
            };
            ws.wid = id;
        }
        wss.emit("connection", ws);
    });
});

// listen
server.listen(8081, function () {
    console.log("Listening on port 8081");
});
