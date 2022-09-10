let currentMyId = "";
let currentPeerId = "";

let currentData = null;
let barsChart = null;
let color = null;
let diffBars = null;

let dragging, draggedOver;

function renderBarsChartSelect() {
    const parent = document.querySelector("#showSelect");
    parent.innerHTML = "";
    for (const i in barsChart) {
        const p = currentData.parties[barsChart[i]];
        const node = document.createElement("div");

        node.className = "showSelectItem";
        node.dataset.i = i;

        node.draggable = true;
        node.addEventListener("drag", setDragging);
        node.addEventListener("dragover", setDraggedOver);
        node.addEventListener("drop", compare);

        const nodeInput = document.createElement("input");
        nodeInput.type = "checkbox";
        nodeInput.setAttribute("checked", "");
        nodeInput.addEventListener("input", checkChange);
        node.appendChild(nodeInput);

        const nodeSpan = document.createElement("span");
        nodeSpan.dataset.i = i;
        nodeSpan.innerText = p.short;
        node.appendChild(nodeSpan);

        parent.appendChild(node);
    }
}

function checkChange(e) {
    console.log(e.target.checked);
}

function compare() {
    const toreplacebrr = barsChart[dragging];
    barsChart.splice(dragging, 1)
    barsChart.splice(draggedOver, 0, toreplacebrr)
    renderBarsChartSelect();
};

function setDragging(e) {
    dragging = e.target.dataset.i;
}

function setDraggedOver(e) {
    e.preventDefault();
    draggedOver = e.target.dataset.i;
}

function renderColorSelect() {
    const parent = document.querySelector("#colorSelect");
    parent.innerHTML = "";
    const keys = Object.keys(color);
    for (const k of keys) {
        /*<div class="colorSelectItem">
                        <span>V:</span>
                        <input type="color">
                    </div>*/

        const node = document.createElement("div");
        node.className = "colorSelectItem";

        const nodeSpan = document.createElement("span");
        nodeSpan.innerText = `${k}: `;
        node.appendChild(nodeSpan);

        const nodeInput = document.createElement("input");
        nodeInput.type = "color";
        nodeInput.value = color[k];
        nodeInput.dataset.k = k;
        nodeInput.addEventListener("input", colorChange);
        node.appendChild(nodeInput);

        parent.appendChild(node);
    }
}

function colorChange(e) {
    color[e.target.dataset.k] = e.target.value;
}

function refreshData() {
    renderBarsChartSelect();
    renderColorSelect();
}

// socket go brr
const socket = new WebSocket(`ws://${location.hostname}:${location.port}`);
socket.addEventListener("message", function (data) {

    const msg = JSON.parse(data.data);

    switch (msg.type) {
        case "id":
            currentMyId = msg.data;
            document.querySelector("#id").innerText = currentMyId;
            break;
        case "data":
            currentData = msg.data;
            refreshData();
            break;
        case "response":
            barsChart = msg.data.barsChart;
            color = msg.data.color;
            diffBars = msg.data.diffBars;
            refreshData();
            break;
        default:
            console.error("Unknown message type \"" + msg.type + "\"");
    }

});

document.querySelector("#peerInput").addEventListener("input", function (e) {
    currentPeerId = e.target.value;
});

document.querySelector("#peerSubmit").addEventListener("click", function () {
    socket.send(JSON.stringify({
        type: "request",
        peer: currentPeerId
    }));
});

document.querySelector("#showApply").addEventListener("click", function () {
    socket.send(JSON.stringify({
        type: "update",
        key: "barsChart",
        data: barsChart,
        peer: currentPeerId
    }));
});
document.querySelector("#colorApply").addEventListener("click", function () {
    socket.send(JSON.stringify({
        type: "update",
        key: "color",
        data: color,
        peer: currentPeerId
    }));
});

function savePresetSlot(src, slot, dest) {
    if (!src)
        return alert("Can't save nothing");
    if (!localStorage.getItem(dest))
        localStorage.setItem(dest, "[[],[],[]]");
    const presets = JSON.parse(localStorage.getItem(dest));
    presets[slot] = src;
    localStorage.setItem(dest, JSON.stringify(presets));
    alert(`Saved to slot ${Number(slot) + 1}`);
}
function loadPresetSlot(src, slot) {
    if (!localStorage.getItem(src))
        return alert("No presets saved");
    const presets = JSON.parse(localStorage.getItem(src));
    return presets[slot];
}
function savePreset(src, dest) {
    if (!src)
        return alert("Can't save nothing");
    localStorage.setItem(dest, JSON.stringify(src));
    alert("Saved preset");
}
function loadPreset(src) {
    if (!localStorage.getItem(src))
        return alert("No preset saved");
    const preset = JSON.parse(localStorage.getItem(src));
    return preset;
}

document.querySelector("#showSave").addEventListener("click", function () {
    savePresetSlot(barsChart, document.querySelector("#showPreset").value, "showPreset");
});
document.querySelector("#showLoad").addEventListener("click", function () {
    barsChart = loadPresetSlot("showPreset", document.querySelector("#showPreset").value);
    refreshData();
});

document.querySelector("#colorSave").addEventListener("click", function () {
    savePreset(color, "colorPreset");
});
document.querySelector("#colorLoad").addEventListener("click", function () {
    color = loadPreset("colorPreset");
    refreshData();
});