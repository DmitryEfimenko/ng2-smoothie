"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var smoothie_1 = require('smoothie');
var smoothieLine_1 = require('./smoothieLine');
var Ng2SmoothieComponent = (function () {
    function Ng2SmoothieComponent(element) {
        this.element = element;
        this.delay = 0;
        this.height = 150;
        this.chartOptions = {};
        this.isVisible = true;
        this.extraOpts = {};
        this.lines = {};
    }
    Ng2SmoothieComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.host = this.element.nativeElement;
        this.canvas = this.host.children[0];
        this.setCanvasHeight();
        this.chart = new smoothie_1.SmoothieChart(this.chartOptions);
        this.chart.streamTo(this.canvas, this.delay);
        this.setHostVisibility(this.isVisible);
        this.setCanvasWidth(function () {
            if (_this.extraOpts.keepAllDataVisible) {
                _this.keepAllDataVisible();
            }
        });
    };
    Ng2SmoothieComponent.prototype.ngOnChanges = function (changes) {
        if (changes.isVisible) {
            if (this.host) {
                this.setHostVisibility(this.isVisible);
            }
        }
        if (changes.height) {
            if (this.host) {
                this.setCanvasHeight();
            }
        }
    };
    Ng2SmoothieComponent.prototype.ngOnDestroy = function () {
        if (this.chart) {
            this.chart = undefined;
        }
    };
    Ng2SmoothieComponent.prototype.addLineData = function (lineId, time, val) {
        var line = this.lines[lineId];
        if (!line) {
            var lineIndex = Object.keys(this.lines).length;
            var opts = { lineWidth: 3 };
            var newLine = new smoothieLine_1.SmoothieLine(lineIndex, opts);
            if (!this.isVisible) {
                newLine.options.strokeStyle = undefined;
            }
            this.lines[lineId] = newLine;
            this.chart.addTimeSeries(this.lines[lineId].series, this.lines[lineId].options);
        }
        this.lines[lineId].addData(time, val);
    };
    Ng2SmoothieComponent.prototype.toggleLine = function (lineId, shouldShow) {
        var isShown = this.lines[lineId].isShown;
        if (shouldShow === undefined) {
            shouldShow = !isShown;
        }
        if (shouldShow && !isShown) {
            this.chart.addTimeSeries(this.lines[lineId].series, this.lines[lineId].options);
            this.lines[lineId].isShown = true;
        }
        else if (!shouldShow && isShown) {
            this.lines[lineId].options = this.chart.getTimeSeriesOptions(this.lines[lineId].series);
            this.chart.removeTimeSeries(this.lines[lineId].series);
            this.lines[lineId].isShown = false;
        }
    };
    Ng2SmoothieComponent.prototype.toggleLines = function (lineIds) {
        var ids = !Array.isArray(lineIds) ? [lineIds] : lineIds;
        var _loop_1 = function(l) {
            if (this_1.lines.hasOwnProperty(l)) {
                var lineId_1 = parseInt(l);
                if (ids.some(function (id) { return id === lineId_1; })) {
                    this_1.toggleLine(lineId_1);
                }
            }
        };
        var this_1 = this;
        for (var l in this.lines) {
            _loop_1(l);
        }
    };
    Ng2SmoothieComponent.prototype.areaFill = function (lineId, shouldShow) {
        var opts = this.chart.getTimeSeriesOptions(this.lines[lineId].series);
        if (opts && (opts.strokeStyle !== undefined || !shouldShow)) {
            opts.fillStyle = shouldShow
                ? this.lines[lineId]._fillStyle
                : undefined;
        }
    };
    Ng2SmoothieComponent.prototype.keepAllDataVisible = function (timeWaitTillResizeMs) {
        var _this = this;
        var o = this.chart.options;
        if (!timeWaitTillResizeMs) {
            timeWaitTillResizeMs = this.getTimeToPassChart();
        }
        if (timeWaitTillResizeMs < this.extraOpts.keepAllDataVisible.timeLimitMs) {
            setTimeout(function () {
                o.millisPerPixel = o.millisPerPixel * 2;
                o.grid.millisPerLine = o.grid.millisPerLine * 2;
                _this.sampleData(_this.extraOpts.keepAllDataVisible.datapointsLimit);
                _this.keepAllDataVisible(_this.getTimeToPassChart() / 2);
            }, timeWaitTillResizeMs);
        }
    };
    Ng2SmoothieComponent.prototype.onWindowResize = function () {
        var _this = this;
        if (this.resizeTimer !== undefined) {
            clearTimeout(this.resizeTimer);
        }
        this.resizeTimer = setTimeout(function () {
            _this.canvas.style.position = 'absolute';
            _this.setCanvasWidth();
            _this.resizeTimer = undefined;
        }, 100);
    };
    Ng2SmoothieComponent.prototype.getTimeToPassChart = function () {
        return (Math.floor(this.canvas.width * this.chart.options.millisPerPixel / 1000)) * 1000;
    };
    Ng2SmoothieComponent.prototype.sampleData = function (datapointsLimit) {
        for (var l in this.lines) {
            if (this.lines.hasOwnProperty(l)) {
                this.lines[l].sampleData(datapointsLimit);
            }
        }
    };
    Ng2SmoothieComponent.prototype.setCanvasWidth = function (cb) {
        var _this = this;
        if (this.host.clientWidth === 0) {
            setTimeout(function () {
                _this.setCanvasWidth(cb);
            }, 50);
        }
        else {
            this.canvas.width = this.host.clientWidth;
            this.canvas.style.position = 'relative';
            if (cb) {
                cb();
            }
        }
    };
    Ng2SmoothieComponent.prototype.setCanvasHeight = function () {
        this.host.style.height = this.height + "px";
        this.canvas.height = this.height;
    };
    Ng2SmoothieComponent.prototype.setHostVisibility = function (shouldShow) {
        this.host.style.display = shouldShow ? 'block' : 'none';
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], Ng2SmoothieComponent.prototype, "delay", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], Ng2SmoothieComponent.prototype, "height", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Ng2SmoothieComponent.prototype, "chartOptions", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Ng2SmoothieComponent.prototype, "isVisible", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Ng2SmoothieComponent.prototype, "extraOpts", void 0);
    __decorate([
        core_1.HostListener('window:resize'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], Ng2SmoothieComponent.prototype, "onWindowResize", null);
    Ng2SmoothieComponent = __decorate([
        core_1.Component({
            selector: 'de-ng2-smoothie',
            template: '<canvas></canvas>',
            styles: [":host { display: block; }"],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], Ng2SmoothieComponent);
    return Ng2SmoothieComponent;
}());
exports.Ng2SmoothieComponent = Ng2SmoothieComponent;
