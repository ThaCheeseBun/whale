import path from "node:path";
import http from "node:http";
import fs from "node:fs";
import fsp from "node:fs/promises";
import express from "express";
import { WebSocketServer } from "ws";
import crypto from "node:crypto";
import * as datahandler from "./src/datahandler.js";

/*
    TODO:
    - Controlpanel
    - Resuming via WS
    - Autodownload of cert + verfication
        - https://resultat.val.se/keys/val-sign-crt.pem
        - https://eid.expisoft.se/nya-ca/expitrust-eid-ca-v4/
    - Reorganizing
    - General bugfixing
*/

// constants for various stuff
export const STORAGE_DIR = "./storage";
const PORT = 8080;

// keep some stuff in ram for fast access
let currentData = {updated:"2022-09-07T15:20:29"};

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
    ws.send(JSON.stringify({
        type: "data",
        data: currentData,
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

// main init and loop
(async function () {
    const dataPath = path.resolve(STORAGE_DIR, "data.json");

    // check if current data exist
    let shouldMove = true;
    try {
        await fsp.access(dataPath, fs.constants.W_OK | fs.constants.R_OK);
        // read current data
        const rawData = await fsp.readFile(dataPath, "utf-8");
        currentData = JSON.parse(rawData);
    } catch (e) {
        shouldMove = false;
    }

    // refresh for new data
    const d = await datahandler.getData();
    if (d) {
        if (shouldMove) {
            // move old data to archive folder
            const oldDate = Date.parse(currentData.updated) / 1000;
            const arcPath = path.resolve(STORAGE_DIR, "archive", `${oldDate}.json`);
            await fsp.rename(dataPath, arcPath);
        }
        // save new to storage folder
        const str = JSON.stringify(d, null, 4);
        await fsp.writeFile(dataPath, str);
    }

    // listen
    server.listen(PORT, function () {
        console.log(`Listening on port ${PORT}`);
    });
})();

