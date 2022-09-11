import * as render from "./render.js";

// hold data and settings
let currentId = null;
let currentData = null;
let barsChart = null;
let diffBars = null;

// refresh all renders
function refreshRender() {

    // get render context
    const ctx = document.querySelector("#app").getContext("2d");

    // render the right bars
    render.mainBars(ctx, [712, 700, 1060, 300], currentData, barsChart);

    // render pie chart
    const ctxPie = document.querySelector("#pie").getContext("2d");
    render.pieChart(ctxPie, currentData, barsChart);

    // b
    render.differenceBar(ctx, [100, 800, 586, 68], currentData, diffBars[0]);
    render.differenceBar(ctx, [100, 900, 336, 40], currentData, diffBars[1]);
    render.differenceBar(ctx, [100, 950, 336, 40], currentData, diffBars[2]);
    render.differenceBar(ctx, [100, 1000, 336, 40], currentData, diffBars[3]);

}

// socket go brr
const socket = new WebSocket(`ws://${location.hostname}:${location.port}?overlay`);
socket.addEventListener("message", function (data) {

    const msg = JSON.parse(data.data);

    switch (msg.type) {
        // get own id and show
        case "id":
            currentId = msg.data;
            document.querySelector("#id").innerText = currentId;
            break;
        // get new database data
        case "data":
            currentData = msg.data;
            if (barsChart && diffBars)
                refreshRender();
            break;
        // set new settings, also hide id if shown
        case "update":
            document.querySelector("#id").style.display = "none";
            barsChart = msg.data.barsChart;
            diffBars = msg.data.diffBars;
            refreshRender();
            break;
        // idfk what happen
        default:
            console.error("Unknown message type \"" + msg.type + "\"");
    }

});
