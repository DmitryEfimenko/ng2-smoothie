"use strict";
var smoothie_1 = require('smoothie');
var SmoothieLine = (function () {
    function SmoothieLine(index, options) {
        this.index = index;
        this.options = options;
        this.isShown = true;
        this.allData = [];
        this.delta = 1;
        this.addDataIx = 0;
        if (!this.options.strokeStyle) {
            this.options.strokeStyle = rgba(generateColor(this.index), 0.8);
        }
        this._fillStyle = this.options.fillStyle
            ? this.options.fillStyle
            : rgba(generateColor(this.index), 0.6);
        this._strokeStyle = this.options.strokeStyle;
        this.series = new smoothie_1.TimeSeries();
    }
    SmoothieLine.prototype.addData = function (time, val) {
        this.allData.push({ time: time, val: val });
        this.addDataIx = this.addDataIx + 1;
        if (this.addDataIx === this.delta) {
            this.series.append(time.getTime(), val);
            this.addDataIx = 0;
        }
    };
    SmoothieLine.prototype.sampleData = function (datapointsLimit) {
        var dataLength = this.allData.length;
        if (dataLength > datapointsLimit) {
            this.delta = Math.floor(dataLength / datapointsLimit) * 2;
            this.series.clear();
            for (var i = 0, l = dataLength; i < l; i = i + this.delta) {
                var d = this.allData[i];
                this.series.append(d.time.getTime(), d.val);
            }
            this.addDataIx = 0;
        }
    };
    return SmoothieLine;
}());
exports.SmoothieLine = SmoothieLine;
var defaultColors = [
    [255, 99, 132],
    [54, 162, 235],
    [255, 206, 86],
    [231, 233, 237],
    [75, 192, 192],
    [151, 187, 205],
    [220, 220, 220],
    [247, 70, 74],
    [70, 191, 189],
    [253, 180, 92],
    [148, 159, 177],
    [77, 83, 96]
];
function rgba(colour, alpha) {
    return 'rgba(' + colour.concat(alpha).join(',') + ')';
}
function generateColor(index) {
    return defaultColors[index] || getRandomColor();
}
function getRandomColor() {
    return [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)];
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
