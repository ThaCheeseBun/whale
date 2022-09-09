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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _render_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./render.js */ \"./src/render.js\");\n\n\n// hold data and settings\nlet currentId = \"\";\nlet currentData = {};\nlet heightBars = [0, 1, 2, 3, 4, 5, 6, 7];\nlet pieChart = [0, 1, 2, 3, 4, 5, 6, 7];\nlet diffBars = [\n    {\n        data: [\n            [0, 1, 2, 3],\n            [4, 5, 6, 7]\n        ],\n        color: [\n            \"#E02E3D\",\n            \"#7DBEE1\"\n        ]\n    },\n    {\n        data: [\n            [0, 1, 2],\n            [7],\n            [3, 4, 5, 6]\n        ],\n        color: [\n            \"#E02E3D\",\n            \"#FFC346\",\n            \"#7DBEE1\"\n        ]\n    },\n    {\n        data: [\n            [0, 1, 2, 3, 4],\n            [5, 6, 7]\n        ],\n        color: [\n            \"#E02E3D\",\n            \"#7DBEE1\"\n        ]\n    },\n    {\n        data: [\n            [1, 2, 3],\n            [0],\n            [4, 5, 6, 7]\n        ],\n        color: [\n            \"#E02E3D\",\n            \"#911414\",\n            \"#7DBEE1\"\n        ]\n    }\n];\n\n// refresh all renders\nfunction refreshRender() {\n\n    // get render context\n    const ctx = document.querySelector(\"#app\").getContext(\"2d\");\n\n    // render the right bars\n    _render_js__WEBPACK_IMPORTED_MODULE_0__.heightBars(ctx, [712, 700, 1060, 300], currentData, heightBars);\n\n    // render pie chart\n    const ctxPie = document.querySelector(\"#pie\").getContext(\"2d\");\n    _render_js__WEBPACK_IMPORTED_MODULE_0__.pieChart(ctxPie, currentData, pieChart);\n\n    // b\n    _render_js__WEBPACK_IMPORTED_MODULE_0__.differenceBar(ctx, [100, 800, 586, 68], currentData, diffBars[0]);\n    _render_js__WEBPACK_IMPORTED_MODULE_0__.differenceBar(ctx, [100, 900, 336, 40], currentData, diffBars[1]);\n    _render_js__WEBPACK_IMPORTED_MODULE_0__.differenceBar(ctx, [100, 950, 336, 40], currentData, diffBars[2]);\n    _render_js__WEBPACK_IMPORTED_MODULE_0__.differenceBar(ctx, [100, 1000, 336, 40], currentData, diffBars[3]);\n\n}\n\n// socket go brr\nconst socket = new WebSocket(`ws://${location.hostname}:${location.port}?overlay`);\nsocket.addEventListener(\"message\", function (data) {\n\n    const msg = JSON.parse(data.data);\n\n    switch (msg.type) {\n        // get own id and show\n        case \"id\":\n            currentId = msg.data;\n            document.querySelector(\"#id\").innerText = currentId;\n            break;\n        // get new database data\n        case \"data\":\n            currentData = msg.data;\n            refreshRender();\n            break;\n        // set new settings, also hide id if shown\n        case \"update\":\n            document.querySelector(\"#id\").style.display = \"none\";\n            break;\n        // request current settings\n        case \"request\":\n            socket.send(JSON.stringify({\n                type: \"response\",\n                data: {\n                    id: msg.data,\n                    heightBars,\n                    pieChart,\n                    diffBars\n                }\n            }));\n            break;\n        // idfk what happen\n        default:\n            console.error(\"Unknown message type \\\"\" + msg.type + \"\\\"\");\n    }\n\n});\n\n\n//# sourceURL=webpack://whale-overlay/./src/index.js?");

/***/ }),

/***/ "./src/render.js":
/*!***********************!*\
  !*** ./src/render.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"differenceBar\": () => (/* binding */ differenceBar),\n/* harmony export */   \"heightBars\": () => (/* binding */ heightBars),\n/* harmony export */   \"pieChart\": () => (/* binding */ pieChart)\n/* harmony export */ });\n/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ \"./src/util.js\");\n// Difference bars, big hak\n\n\n/* Example box\n[\n    100, = X\n    100, = Y\n    300, = Width\n    50   = Height\n]\n*/\n/* Example dataset\n {\n     \"data\": [10, 50, 40],\n     \"text\": [\"V+SD\", \"C+MP\", \"L+KD\"],\n     \"color\": [\"#F00\", \"#0F0\", \"#00F\"]\n }\n */\n\nconst FONT = \"Adumu\";\n\n// the difference bars comparing stuff tm\nfunction differenceBar(ctx, box, data, opts) {\n\n    // collect data\n    let shorts = [];\n    let values = [];\n    let total = 0;\n    for (const i in opts.data) {\n        const t = _util_js__WEBPACK_IMPORTED_MODULE_0__.total(data.parties, opts.data[i]);\n        values.push(t);\n        total += t;\n        shorts[i] = \"\";\n        for (const j in opts.data[i]) {\n            shorts[i] += data.parties[opts.data[i][j]].short +\n                (j == opts.data[i].length - 1 ? \"\" : \"+\");\n        }\n    }\n\n    // render data\n    let x = box[0];\n    for (const i in opts.data) {\n        ctx.fillStyle = opts.color[i];\n        const w = (values[i] / total) * box[2];\n        ctx.fillRect(x, box[1], w, box[3]);\n\n        // text stuff\n        ctx.fillStyle = \"#FFF\";\n        ctx.font = \"28px \" + FONT;\n        if (box[3] > 40)\n            ctx.font = \"40px \" + FONT;\n        ctx.textBaseline = \"middle\";\n        // text alignment\n        ctx.textAlign = \"center\";\n        if (i == 0)\n            ctx.textAlign = \"start\";\n        else if (i == opts.data.length - 1)\n            ctx.textAlign = \"end\";\n        // text x coordinate\n        let txtx = (w / 2) + x;\n        if (i == 0)\n            txtx = x + 5;\n        else if (i == opts.data.length - 1)\n            txtx = (box[0] + box[2]) - 5;\n        // fill the text\n        ctx.fillText(shorts[i], txtx, box[1] + (box[3] / 2), w);\n\n        x += w;\n    }\n}\n\n// create the chart of bars\nfunction heightBars(ctx, box, data, opts) {\n    const BAR_WIDTH = 94;\n    const TXT_BLOCK = 90;\n\n    // find highest percent\n    const high = _util_js__WEBPACK_IMPORTED_MODULE_0__.highest(data.parties, opts);\n    const space = (box[2] - (BAR_WIDTH * opts.length)) / (opts.length - 1);\n    const maxHeight = box[3] - TXT_BLOCK;\n\n    // populate bars\n    let x = box[0];\n    for (const i in opts) {\n        const h = (data.parties[opts[i]].value / high) * maxHeight;\n\n        ctx.fillStyle = data.parties[opts[i]].color;\n        ctx.fillRect(x, box[1] + (maxHeight - h), BAR_WIDTH, h + TXT_BLOCK);\n\n        ctx.fillStyle = \"#FFFFFF\";\n        ctx.font = \"60px \" + FONT;\n        ctx.textAlign = \"center\";\n        ctx.textBaseline = \"middle\";\n        ctx.fillText(data.parties[opts[i]].short, x + (BAR_WIDTH / 2), box[1] + maxHeight + (TXT_BLOCK / 2));\n\n        const percent = data.parties[opts[i]].percentage.toFixed(1).replace(\".\", \",\") + \"%\";\n        ctx.font = \"30px \" + FONT;\n        ctx.textBaseline = \"bottom\";\n        ctx.fillText(percent, x + (BAR_WIDTH / 2), box[1] + maxHeight);\n\n        x += (BAR_WIDTH + space);\n    }\n}\n\n// pie chart go brr\nfunction pieChart(ctx, data, opts) {\n    const total = _util_js__WEBPACK_IMPORTED_MODULE_0__.total(data.parties, opts);\n    const middle = ctx.canvas.width / 2;\n\n    let currentAngle = 0;\n    for (const i in data.parties) {\n        //calculating the angle the slice (portion) will take in the chart\n        const portionAngle = (data.parties[opts[i]].value / total) * 2 * Math.PI;\n        //drawing an arc and a line to the center to differentiate the slice from the rest\n        ctx.beginPath();\n        ctx.arc(middle, middle, middle, currentAngle, currentAngle + portionAngle);\n        currentAngle += portionAngle;\n        ctx.lineTo(middle, middle);\n        //filling the slices with the corresponding mood's color\n        ctx.fillStyle = data.parties[opts[i]].color;\n        ctx.fill();\n    }\n}\n\n\n//# sourceURL=webpack://whale-overlay/./src/render.js?");

/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"highest\": () => (/* binding */ highest),\n/* harmony export */   \"total\": () => (/* binding */ total)\n/* harmony export */ });\nfunction total(d, o) {\n    let t = 0;\n    for (const i of o)\n        t += d[i].value;\n    return t;\n}\nfunction highest(d, o) {\n    let h = 0;\n    for (const i of o)\n        if (d[i].value > h)\n            h = d[i].value;\n    return h;\n}\n\n\n//# sourceURL=webpack://whale-overlay/./src/util.js?");

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