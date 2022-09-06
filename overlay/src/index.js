import * as render from "./render.js";

// hold data and settings
let currentId = "";
let currentData = {};
let heightBars = [0, 1, 2, 3, 4, 5, 6, 7];
let pieChart = [0, 1, 2, 3, 4, 5, 6, 7];
let diffBars = [
    {
        data: [
            [0, 1, 2, 3],
            [4, 5, 6, 7]
        ],
        color: [
            "#E02E3D",
            "#7DBEE1"
        ]
    },
    {
        data: [
            [0, 1, 2],
            [7],
            [3, 4, 5, 6]
        ],
        color: [
            "#E02E3D",
            "#FFC346",
            "#7DBEE1"
        ]
    },
    {
        data: [
            [0, 1, 2, 3, 4],
            [5, 6, 7]
        ],
        color: [
            "#E02E3D",
            "#7DBEE1"
        ]
    },
    {
        data: [
            [1, 2, 3],
            [0],
            [4, 5, 6, 7]
        ],
        color: [
            "#E02E3D",
            "#911414",
            "#7DBEE1"
        ]
    }
];

// refresh all renders
function refreshRender() {

    // get render context
    const ctx = document.querySelector("#app").getContext("2d");

    // render the right bars
    render.heightBars(ctx, [712, 700, 1060, 300], currentData, heightBars);

    // render pie chart
    const ctxPie = document.querySelector("#pie").getContext("2d");
    render.pieChart(ctxPie, currentData, pieChart);

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
            refreshRender();
            break;
        // set new settings, also hide id if shown
        case "update":
            document.querySelector("#id").style.display = "none";
            break;
        // request current settings
        case "request":
            socket.send(JSON.stringify({
                type: "response",
                data: {
                    id: msg.data,
                    heightBars,
                    pieChart,
                    diffBars
                }
            }));
            break;
        // idfk what happen
        default:
            console.error("Unknown message type \"" + msg.type + "\"");
    }

});
