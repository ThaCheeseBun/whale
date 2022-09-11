let currentMyId = null;

let firstTime = true;
let currentData = null;
let barsChart = null;
let diffBars = null;

// RENDER AND POPULATE BARSCHART SELECT
let dragging, draggedOver;
function renderMain() {
    const parent = document.querySelector("#showSelect");
    parent.innerHTML = "";

    for (const i in barsChart.order) {
        const p = currentData.parties[barsChart.order[i]];
        const node = document.createElement("div");

        node.className = "showSelectItem";
        node.dataset.i = i;

        node.draggable = true;
        node.addEventListener("drag", dragBegin);
        node.addEventListener("dragover", dragOver);
        node.addEventListener("drop", dragEnd);

        const nodeCheck = document.createElement("input");
        nodeCheck.type = "checkbox";
        nodeCheck.dataset.i = i;
        nodeCheck.addEventListener("input", checkInput);
        if (barsChart.show[barsChart.order[i]])
            nodeCheck.setAttribute("checked", "");
        node.appendChild(nodeCheck);

        const nodeSpan = document.createElement("span");
        nodeSpan.dataset.i = i;
        nodeSpan.innerText = p.short;
        node.appendChild(nodeSpan);

        const nodeColor = document.createElement("input");
        nodeColor.type = "color";
        nodeColor.value = barsChart.color[barsChart.order[i]];
        nodeColor.dataset.i = i;
        nodeColor.addEventListener("input", colorInput);
        node.appendChild(nodeColor);

        parent.appendChild(node);
    }
}
function checkInput(e) {
    const val = e.target.checked ? 1 : 0;
    barsChart.show[barsChart.order[e.target.dataset.i]] = val;
}
function dragBegin(e) {
    dragging = e.target.dataset.i;
}
function dragOver(e) {
    e.preventDefault();
    draggedOver = e.target.dataset.i;
}
function dragEnd() {
    const val = barsChart.order[dragging];
    barsChart.order.splice(dragging, 1)
    barsChart.order.splice(draggedOver, 0, val)
    renderMain();
};
function colorInput(e) {
    barsChart.color[barsChart.order[e.target.dataset.i]] = e.target.value;
}

// diff bar stuff
function renderDiffBar() {
    const parent = document.querySelector("#diffBarContainer");
    parent.innerHTML = "";

    for (const i in diffBars) {

        const node = document.createElement("div");
        node.className = "diffBar";
        node.dataset.i = i;

        const nodeSpan = document.createElement("span");
        nodeSpan.innerText = "Difference bar " + i.toString();
        node.appendChild(nodeSpan);

        const barsParent = document.createElement("div");
        barsParent.className = "innerBars";

        for (const j in diffBars[i].order) {
            const nodeLine = document.createElement("div");
            nodeLine.dataset.i = i;
            nodeLine.dataset.j = j;
            nodeLine.className = "diffBarLine";

            const nodeText = document.createElement("input");
            nodeText.type = "text";

            let txt = [];
            for (const k of diffBars[i].order[j])
                txt.push(currentData.parties[k].short);
            nodeText.value = txt.join(",")
            
            nodeText.addEventListener("keydown", diffTextKey);
            nodeText.addEventListener("input", diffTextInput);
            nodeLine.appendChild(nodeText);

            const nodeColor = document.createElement("input");
            nodeColor.type = "color";
            nodeColor.value = diffBars[i].color[j];
            nodeColor.addEventListener("input", diffColorInput);
            nodeLine.appendChild(nodeColor);

            barsParent.appendChild(nodeLine);
        }

        node.appendChild(barsParent);

        const addBtn = document.createElement("button");
        addBtn.innerText = "Add";
        addBtn.addEventListener("click", diffAdd);
        node.appendChild(addBtn);

        const remBtn = document.createElement("button");
        remBtn.innerText = "Remove";
        remBtn.addEventListener("click", diffRem);
        node.appendChild(remBtn);

        parent.appendChild(node);
    }
}
function diffAdd(e) {
    const i = e.target.parentNode.dataset.i;
    diffBars[i].order.push([]);
    diffBars[i].color.push("#000000");
    renderDiffBar();
}
function diffRem(e) {
    const i = e.target.parentNode.dataset.i;
    diffBars[i].order.pop();
    diffBars[i].color.pop();
    renderDiffBar();
}
function diffColorInput(e) {
    const i = e.target.parentNode.dataset.i;
    const j = e.target.parentNode.dataset.j;
    diffBars[i].color[j] = e.target.value;
}
function diffTextKey(e) {
    if (e.keyCode == 13) {
        let o = [];

        const s = e.target.value.split(",");
        for (const a of s) {
            const b = currentData.parties.findIndex(c => c.short == a);
            if (b < 0)
                return alert("Invalid parties");
            o.push(b);
        }
    
        const i = e.target.parentNode.dataset.i;
        const j = e.target.parentNode.dataset.j;
        diffBars[i].order[j] = o;

        e.target.parentNode.style.backgroundColor = "";
    }
}
function diffTextInput(e) {
    e.target.parentNode.style.backgroundColor = "rgba(255, 255, 0, .2)";
}

// main refresh
function refreshData() {
    renderMain();
    renderDiffBar();
}

// default data
function defaultData(BARSCHARt, DIFFBARs) {
    if (BARSCHARt) {
        barsChart = {
            order: [],
            show: [],
            color: []
        };
        for (const i in currentData.parties) {
            barsChart.order.push(i);
            barsChart.show.push(1);
            barsChart.color.push(currentData.parties[i].color);
        }
    }
    if (DIFFBARs) {
        diffBars = [
            {
                order: [
                    [0, 1, 2, 3],
                    [4, 5, 6, 7]
                ],
                color: [
                    "#E02E3D",
                    "#7DBEE1"
                ]
            },
            {
                order: [
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
                order: [
                    [0, 1, 2, 3, 4],
                    [5, 6, 7]
                ],
                color: [
                    "#E02E3D",
                    "#7DBEE1"
                ]
            },
            {
                order: [
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
    }
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
            if (firstTime) {
                firstTime = false;
                defaultData(true, true);
            }
            refreshData();
            break;
        case "error":
            alert("Error from server: " + msg.data);
            break;
        default:
            console.error("Unknown message type \"" + msg.type + "\"");
    }

});

document.querySelector("#apply").addEventListener("click", function () {
    socket.send(JSON.stringify({
        type: "update",
        data: {
            barsChart,
            diffBars
        },
        peer: document.querySelector("#peerInput").value
    }));
});

function savePreset(src, slot, dest) {
    if (!src)
        return alert("Can't save nothing");
    if (!localStorage.getItem(dest))
        localStorage.setItem(dest, "[]");
    const presets = JSON.parse(localStorage.getItem(dest));
    presets[slot] = src;
    localStorage.setItem(dest, JSON.stringify(presets));
    alert(`Saved to slot ${Number(slot) + 1}`);
}
function loadPreset(src, slot) {
    if (!localStorage.getItem(src))
        return alert("No presets saved");
    const presets = JSON.parse(localStorage.getItem(src));
    return presets[slot];
}

document.querySelector("#showSave").addEventListener("click", function () {
    savePreset(barsChart, document.querySelector("#showPreset").value, "showPreset");
});
document.querySelector("#showLoad").addEventListener("click", function () {
    barsChart = loadPreset("showPreset", document.querySelector("#showPreset").value);
    refreshData();
});
document.querySelector("#showReset").addEventListener("click", function () {
    defaultData(true, false);
    refreshData();
});

document.querySelector("#diffBarSave").addEventListener("click", function () {
    savePreset(diffBars, document.querySelector("#diffBarPreset").value, "diffBarPreset");
});
document.querySelector("#diffBarLoad").addEventListener("click", function () {
    diffBars = loadPreset("diffBarPreset", document.querySelector("#diffBarPreset").value);
    refreshData();
});
document.querySelector("#diffBarReset").addEventListener("click", function () {
    defaultData(false, true);
    refreshData();
});
