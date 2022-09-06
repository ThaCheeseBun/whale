import { Chart, registerables } from "chart.js";
import * as render from "./render.js";
import * as util from "./util.js";

// register stuff i need idfk
Chart.register(registerables[0], registerables[1]);

// socket go brr
const socket = new WebSocket(`ws://${location.hostname}:${location.port}`);
socket.addEventListener("message", function (msg) {

    console.log(msg);
    const json = JSON.parse(msg.data);

    const ctx2 = document.querySelector("#appc").getContext("2d");

    render.heightBars(ctx2, [712, 700, 1060, 300], {
        "data": json.percent,
        "text": json.letters,
        "color": json.colors
    });

    // apply that shit to canvas
    const ctx = document.querySelector("#pie").getContext("2d");
    const chart = new Chart(ctx, {
        type: "pie",
        data: {
            datasets: [
                {
                    data: json.percent,
                    backgroundColor: json.colors,
                    borderWidth: 0,
                }
            ]
        },
        options: {
            animation: false,
        },
    });

    render.differenceBar(ctx2, [100, 800, 586, 68], {
        "data": [
            json.percent[0] +
            json.percent[1] +
            json.percent[2] +
            json.percent[3],
            json.percent[4] +
            json.percent[5] +
            json.percent[6] +
            json.percent[7]
        ],
        "text": [
            json.letters[0] + "+" +
            json.letters[1] + "+" +
            json.letters[2] + "+" +
            json.letters[3],
            json.letters[4] + "+" +
            json.letters[5] + "+" +
            json.letters[6] + "+" +
            json.letters[7]
        ],
        "color": [
            "#E02E3D",
            "#7DBEE1"
        ]
    });

    render.differenceBar(ctx2, [100, 900, 336, 40], {
        "data": [
            json.percent[0] +
            json.percent[1] +
            json.percent[2],
            json.percent[7],
            json.percent[3] +
            json.percent[4] +
            json.percent[5] +
            json.percent[6]
        ],
        "text": [
            json.letters[0] + "+" +
            json.letters[1] + "+" +
            json.letters[2],
            json.letters[7],
            json.letters[3] + "+" +
            json.letters[4] + "+" +
            json.letters[5] + "+" +
            json.letters[6]
        ],
        "color": [
            "#E02E3D",
            "#FFC346",
            "#7DBEE1"
        ]
    });

    render.differenceBar(ctx2, [100, 950, 336, 40], {
        "data": [
            json.percent[0] +
            json.percent[1] +
            json.percent[2] +
            json.percent[3] +
            json.percent[4],
            json.percent[5] +
            json.percent[6] +
            json.percent[7]
        ],
        "text": [
            json.letters[0] + "+" +
            json.letters[1] + "+" +
            json.letters[2] + "+" +
            json.letters[3] + "+" +
            json.letters[4],
            json.letters[5] + "+" +
            json.letters[6] + "+" +
            json.letters[7]
        ],
        "color": [
            "#E02E3D",
            "#7DBEE1"
        ]
    });

    render.differenceBar(ctx2, [100, 1000, 336, 40], {
        "data": [
            json.percent[1] +
            json.percent[2] +
            json.percent[3],
            json.percent[0],
            json.percent[4] +
            json.percent[5] +
            json.percent[6] +
            json.percent[7]
        ],
        "text": [
            json.letters[1] + "+" +
            json.letters[2] + "+" +
            json.letters[3],
            json.letters[0],
            json.letters[4] + "+" +
            json.letters[5] + "+" +
            json.letters[6] + "+" +
            json.letters[7]
        ],
        "color": [
            "#E02E3D",
            "#911414",
            "#7DBEE1"
        ]
    });

});
