import { Chart, registerables } from "chart.js";

// register stuff i need idfk
Chart.register(registerables[0], registerables[1]);

// socket go brr
const socket = new WebSocket(`ws://${location.hostname}:${location.port}`);
socket.addEventListener("message", function (msg) {

    console.log(msg);
    const json = JSON.parse(msg.data);

    // find highest percent
    let high = 0;
    for (const i of json.percent)
        if (i > high)
            high = i;

    // populate bars
    const bars = document.querySelectorAll(".bar");
    const maxHeight = 300;
    for (const b in bars) {
        if (!bars[b] || !bars[b].children)
            continue;
        bars[b].style.backgroundColor = json.colors[b];
        bars[b].style.height = `${Math.round((json.percent[b] / high) * maxHeight)}px`;
        bars[b].children[0].innerText = `${json.percent[b].toFixed(1).replace(".", ",")}%`;
        bars[b].children[1].innerText = json.letters[b];
    }

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

});
