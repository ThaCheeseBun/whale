/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _render_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./render.js */ \"./src/render.js\");\n\r\n\r\n// hold data and settings\r\nlet currentId = \"\";\r\nlet currentData = {};\r\n\r\nlet barsChart = [];\r\nlet color = {};\r\n\r\nlet diffBars = [\r\n    {\r\n        data: [\r\n            [0, 1, 2, 3],\r\n            [4, 5, 6, 7]\r\n        ],\r\n        color: [\r\n            \"#E02E3D\",\r\n            \"#7DBEE1\"\r\n        ]\r\n    },\r\n    {\r\n        data: [\r\n            [0, 1, 2],\r\n            [7],\r\n            [3, 4, 5, 6]\r\n        ],\r\n        color: [\r\n            \"#E02E3D\",\r\n            \"#FFC346\",\r\n            \"#7DBEE1\"\r\n        ]\r\n    },\r\n    {\r\n        data: [\r\n            [0, 1, 2, 3, 4],\r\n            [5, 6, 7]\r\n        ],\r\n        color: [\r\n            \"#E02E3D\",\r\n            \"#7DBEE1\"\r\n        ]\r\n    },\r\n    {\r\n        data: [\r\n            [1, 2, 3],\r\n            [0],\r\n            [4, 5, 6, 7]\r\n        ],\r\n        color: [\r\n            \"#E02E3D\",\r\n            \"#911414\",\r\n            \"#7DBEE1\"\r\n        ]\r\n    }\r\n];\r\n\r\n// refresh all renders\r\nfunction refreshRender() {\r\n\r\n    // get render context\r\n    const ctx = document.querySelector(\"#app\").getContext(\"2d\");\r\n\r\n    // render the right bars\r\n    _render_js__WEBPACK_IMPORTED_MODULE_0__.mainBars(ctx, [712, 700, 1060, 300], currentData, barsChart, color);\r\n\r\n    // render pie chart\r\n    const ctxPie = document.querySelector(\"#pie\").getContext(\"2d\");\r\n    _render_js__WEBPACK_IMPORTED_MODULE_0__.pieChart(ctxPie, currentData, barsChart, color);\r\n\r\n    // b\r\n    _render_js__WEBPACK_IMPORTED_MODULE_0__.differenceBar(ctx, [100, 800, 586, 68], currentData, diffBars[0]);\r\n    _render_js__WEBPACK_IMPORTED_MODULE_0__.differenceBar(ctx, [100, 900, 336, 40], currentData, diffBars[1]);\r\n    _render_js__WEBPACK_IMPORTED_MODULE_0__.differenceBar(ctx, [100, 950, 336, 40], currentData, diffBars[2]);\r\n    _render_js__WEBPACK_IMPORTED_MODULE_0__.differenceBar(ctx, [100, 1000, 336, 40], currentData, diffBars[3]);\r\n\r\n}\r\n\r\n// socket go brr\r\nconst socket = new WebSocket(`ws://${location.hostname}:${location.port}?overlay`);\r\nsocket.addEventListener(\"message\", function (data) {\r\n\r\n    const msg = JSON.parse(data.data);\r\n\r\n    switch (msg.type) {\r\n        // get own id and show\r\n        case \"id\":\r\n            currentId = msg.data;\r\n            document.querySelector(\"#id\").innerText = currentId;\r\n            break;\r\n        // get new database data\r\n        case \"data\":\r\n            currentData = msg.data;\r\n\r\n            for (const i in currentData.parties) {\r\n                barsChart.push(i);\r\n                color[currentData.parties[i].short] = currentData.parties[i].color;\r\n            }\r\n\r\n            refreshRender();\r\n            break;\r\n        // set new settings, also hide id if shown\r\n        case \"update\":\r\n            document.querySelector(\"#id\").style.display = \"none\";\r\n            switch (msg.key) {\r\n                case \"barsChart\":\r\n                    barsChart = msg.data;\r\n                    break;\r\n                case \"color\":\r\n                    color = msg.data;\r\n                    break;\r\n                case \"diffBars\":\r\n                    diffBars = msg.data;\r\n                    break;\r\n                default:\r\n                    break;\r\n            }\r\n            refreshRender();\r\n            break;\r\n        // request current settings\r\n        case \"request\":\r\n            socket.send(JSON.stringify({\r\n                type: \"response\",\r\n                data: {\r\n                    id: msg.data,\r\n                    barsChart,\r\n                    color,\r\n                    diffBars\r\n                }\r\n            }));\r\n            break;\r\n        // idfk what happen\r\n        default:\r\n            console.error(\"Unknown message type \\\"\" + msg.type + \"\\\"\");\r\n    }\r\n\r\n});\r\n\n\n//# sourceURL=webpack://whale-overlay/./src/index.js?");

/***/ }),

/***/ "./src/render.js":
/*!***********************!*\
  !*** ./src/render.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"differenceBar\": () => (/* binding */ differenceBar),\n/* harmony export */   \"mainBars\": () => (/* binding */ mainBars),\n/* harmony export */   \"pieChart\": () => (/* binding */ pieChart)\n/* harmony export */ });\n/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ \"./src/util.js\");\n// Difference bars, big hak\r\n\r\n\r\n/* Example box\r\n[\r\n    100, = X\r\n    100, = Y\r\n    300, = Width\r\n    50   = Height\r\n]\r\n*/\r\n/* Example dataset\r\n {\r\n     \"data\": [10, 50, 40],\r\n     \"text\": [\"V+SD\", \"C+MP\", \"L+KD\"],\r\n     \"color\": [\"#F00\", \"#0F0\", \"#00F\"]\r\n }\r\n */\r\n\r\nconst FONT = \"Adumu\";\r\n\r\n// the difference bars comparing stuff tm\r\nfunction differenceBar(ctx, box, data, opts) {\r\n    ctx.clearRect(box[0], box[1], box[2], box[3]);\r\n\r\n    // collect data\r\n    let shorts = [];\r\n    let values = [];\r\n    let total = 0;\r\n    for (const i in opts.data) {\r\n        const t = _util_js__WEBPACK_IMPORTED_MODULE_0__.total(data.parties, opts.data[i]);\r\n        values.push(t);\r\n        total += t;\r\n        shorts[i] = \"\";\r\n        for (const j in opts.data[i]) {\r\n            shorts[i] += data.parties[opts.data[i][j]].short +\r\n                (j == opts.data[i].length - 1 ? \"\" : \"+\");\r\n        }\r\n    }\r\n\r\n    // render data\r\n    let x = box[0];\r\n    for (const i in opts.data) {\r\n        ctx.fillStyle = opts.color[i];\r\n        const w = (values[i] / total) * box[2];\r\n        ctx.fillRect(x, box[1], w, box[3]);\r\n\r\n        // text stuff\r\n        ctx.fillStyle = \"#FFF\";\r\n        ctx.font = \"28px \" + FONT;\r\n        if (box[3] > 40)\r\n            ctx.font = \"40px \" + FONT;\r\n        ctx.textBaseline = \"middle\";\r\n        // text alignment\r\n        ctx.textAlign = \"center\";\r\n        if (i == 0)\r\n            ctx.textAlign = \"start\";\r\n        else if (i == opts.data.length - 1)\r\n            ctx.textAlign = \"end\";\r\n        // text x coordinate\r\n        let txtx = (w / 2) + x;\r\n        if (i == 0)\r\n            txtx = x + 5;\r\n        else if (i == opts.data.length - 1)\r\n            txtx = (box[0] + box[2]) - 5;\r\n        // fill the text\r\n        ctx.fillText(shorts[i], txtx, box[1] + (box[3] / 2), w);\r\n\r\n        x += w;\r\n    }\r\n}\r\n\r\n// create the chart of bars\r\nfunction mainBars(ctx, box, data, opts, color) {\r\n    ctx.clearRect(box[0], box[1], box[2], box[3]);\r\n\r\n    const BAR_WIDTH = 94;\r\n    const TXT_BLOCK = 90;\r\n\r\n    // find highest percent\r\n    const high = _util_js__WEBPACK_IMPORTED_MODULE_0__.highest(data.parties, opts);\r\n    const space = (box[2] - (BAR_WIDTH * opts.length)) / (opts.length - 1);\r\n    const maxHeight = box[3] - TXT_BLOCK;\r\n\r\n    // populate bars\r\n    let x = box[0];\r\n    for (const i in opts) {\r\n        const h = (data.parties[opts[i]].value / high) * maxHeight;\r\n\r\n        ctx.fillStyle = color[data.parties[opts[i]].short];\r\n        ctx.fillRect(x, box[1] + (maxHeight - h), BAR_WIDTH, h + TXT_BLOCK);\r\n\r\n        ctx.fillStyle = \"#FFFFFF\";\r\n        ctx.font = \"60px \" + FONT;\r\n        ctx.textAlign = \"center\";\r\n        ctx.textBaseline = \"middle\";\r\n        ctx.fillText(data.parties[opts[i]].short, x + (BAR_WIDTH / 2), box[1] + maxHeight + (TXT_BLOCK / 2));\r\n\r\n        const percent = data.parties[opts[i]].percentage.toFixed(1).replace(\".\", \",\") + \"%\";\r\n        ctx.font = \"30px \" + FONT;\r\n        ctx.textBaseline = \"bottom\";\r\n        ctx.fillText(percent, x + (BAR_WIDTH / 2), box[1] + maxHeight);\r\n\r\n        x += (BAR_WIDTH + space);\r\n    }\r\n}\r\n\r\n// pie chart go brr\r\nfunction pieChart(ctx, data, opts, color) {\r\n    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);\r\n\r\n    const total = _util_js__WEBPACK_IMPORTED_MODULE_0__.total(data.parties, opts);\r\n    const middle = ctx.canvas.width / 2;\r\n\r\n    let currentAngle = 0;\r\n    for (const i in data.parties) {\r\n        //calculating the angle the slice (portion) will take in the chart\r\n        const portionAngle = (data.parties[opts[i]].value / total) * 2 * Math.PI;\r\n        //drawing an arc and a line to the center to differentiate the slice from the rest\r\n        ctx.beginPath();\r\n        ctx.arc(middle, middle, middle, currentAngle, currentAngle + portionAngle);\r\n        currentAngle += portionAngle;\r\n        ctx.lineTo(middle, middle);\r\n        //filling the slices with the corresponding mood's color\r\n        ctx.fillStyle = color[data.parties[opts[i]].short];\r\n        ctx.fill();\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack://whale-overlay/./src/render.js?");

/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"highest\": () => (/* binding */ highest),\n/* harmony export */   \"total\": () => (/* binding */ total)\n/* harmony export */ });\nfunction total(d, o) {\r\n    let t = 0;\r\n    for (const i of o)\r\n        t += d[i].value;\r\n    return t;\r\n}\r\nfunction highest(d, o) {\r\n    let h = 0;\r\n    for (const i of o)\r\n        if (d[i].value > h)\r\n            h = d[i].value;\r\n    return h;\r\n}\r\n\n\n//# sourceURL=webpack://whale-overlay/./src/util.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;