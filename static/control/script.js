let currentData = {};

function refreshData() {
    
}

// socket go brr
const socket = new WebSocket(`ws://${location.hostname}:${location.port}`);
socket.addEventListener("message", function (data) {

    const msg = JSON.parse(data.data);

    switch (msg.type) {
        case "id":
            currentId = msg.data;
            document.querySelector("#id").innerText = currentId;
            break;
        case "data":
            currentData = msg.data;
            refreshData();
            break;
        case "response":
            console.log(msg);
            break;
        default:
            console.error("Unknown message type \"" + msg.type + "\"");
    }

});

document.querySelector("#testing").addEventListener("click", () => {
    socket.send(JSON.stringify({
        type: "request",
        data: document.querySelector("#testingText").value
    }));
});
