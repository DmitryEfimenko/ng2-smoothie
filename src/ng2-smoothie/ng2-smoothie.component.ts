/* tslint:disable:component-selector-prefix */

import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ChangeDetectionStrategy
} from '@angular/core';

import {
    SmoothieChart, ITimeSeriesPresentationOptions, IChartOptions
} from 'smoothie';

import { SmoothieLine } from './smoothieLine';
import { IExtraOpts } from './interfaces';

@Component({
  selector: 'de-ng2-smoothie',
  template: '<canvas></canvas>',
  styles: [`:host { display: block; }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Ng2SmoothieComponent implements OnInit, OnChanges, OnDestroy {
  @Input() delay: number = 0;
  @Input() height: number = 150;
  @Input() chartOptions: IChartOptions = {};
  @Input() isVisible: boolean = true;
  @Input() extraOpts: IExtraOpts = {};
  @Output() visibilityChanged = new EventEmitter<boolean>();

  lines: ISmoothieLines = {};

  private canvas: HTMLCanvasElement;
  private host: HTMLElement;
  private chart: SmoothieChart;
  private resizeTimer: NodeJS.Timer;

  constructor(private element: ElementRef) { }

  ngOnInit() {
    this.host = this.element.nativeElement;
    this.canvas = <any>this.host.children[0];
    this.setCanvasHeight();

    if (!this.chartOptions.maxDataSetLength && this.extraOpts.keepAllDataVisible) {
      this.chartOptions.maxDataSetLength = this.extraOpts.keepAllDataVisible.datapointsLimit + 10;
    }

    this.chart = new SmoothieChart(this.chartOptions);
    this.chart.streamTo(this.canvas, this.delay);
    this.setCanvasWidth(() => {
      if (this.extraOpts.keepAllDataVisible) {
        this.keepAllDataVisible();
      }
      this.setHostVisibility(this.isVisible);
    });
  }

  ngOnChanges(changes) {
    if (changes.isVisible) {
      this.setHostVisibility(this.isVisible);
    }
    if (changes.height) {
      if (this.host) {
        this.setCanvasHeight();
      }
    }
  }

  ngOnDestroy(): any {
    if (this.chart) {
      this.chart = undefined;
    }
  }

  setVisibility(shouldShow: boolean) {
    this.isVisible = shouldShow;
    this.setHostVisibility(this.isVisible);
    this.visibilityChanged.emit(this.isVisible);
  }

  addLineData(lineId: number, time: Date, val: number) {
    let line = this.lines[lineId];
    if (!line) {
      let lineIndex = Object.keys(this.lines).length;
      let opts: ITimeSeriesPresentationOptions = { lineWidth: 3 };
      let newLine = new SmoothieLine(lineIndex, opts, this.extraOpts);

      this.lines[lineId] = newLine;
      this.chart.addTimeSeries(
        this.lines[lineId].series,
        this.lines[lineId].options
      );
    }
    this.lines[lineId].addData(time, val);
  }

  toggleLine(lineId: number, shouldShow?: boolean) {
    let isShown = this.lines[lineId].isShown;
    if (shouldShow === undefined) {
      shouldShow = !isShown;
    }

    if (shouldShow && !isShown) {
      this.chart.addTimeSeries(
        this.lines[lineId].series,
        this.lines[lineId].options
      );
      this.lines[lineId].isShown = true;
    } else if (!shouldShow && isShown) {
      this.lines[lineId].options = this.chart.getTimeSeriesOptions(this.lines[lineId].series);
      this.chart.removeTimeSeries(this.lines[lineId].series);
      this.lines[lineId].isShown = false;
    }
  }

  toggleLines(lineIds: number | number[], shouldShow?: boolean) {
    let ids = !Array.isArray(lineIds) ? [lineIds] : lineIds;
    for (let l in this.lines) {
      if (this.lines.hasOwnProperty(l)) {
        let lineId = parseInt(l);
        if (ids.some(id => id === lineId)) {
          this.toggleLine(lineId, shouldShow);
        }
      }
    }
  }

  areaFill(lineId: number, shouldShow: boolean) {
    if (this.lines[lineId]) {
      let opts = this.chart.getTimeSeriesOptions(this.lines[lineId].series);
      if (opts) {
        opts.fillStyle = shouldShow
          ? this.lines[lineId]._fillStyle
          : undefined;
      }
    }
  }

  keepAllDataVisible(timeWaitTillResizeMs?: number) {
    let o = this.chart.options;
    if (!timeWaitTillResizeMs) {
      timeWaitTillResizeMs = this.getTimeToPassChart();
    }
    if (timeWaitTillResizeMs < this.extraOpts.keepAllDataVisible.timeLimitMs) {
      setTimeout(() => {
        o.millisPerPixel = o.millisPerPixel * 2;
        o.grid.millisPerLine = o.grid.millisPerLine * 2;
        this.sampleData(this.extraOpts.keepAllDataVisible.datapointsLimit);
        this.keepAllDataVisible(this.getTimeToPassChart() / 2);
      }, timeWaitTillResizeMs);
    }
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (this.resizeTimer !== undefined) {
      clearTimeout(this.resizeTimer);
    }
    this.resizeTimer = setTimeout(() => {
      this.canvas.style.position = 'absolute';
      this.setCanvasWidth();
      this.resizeTimer = undefined;
    }, 100);
  }

  getTimeToPassChart() {
    return (Math.floor(this.canvas.width * this.chart.options.millisPerPixel / 1000)) * 1000;
  }

  private sampleData(datapointsLimit: number) {
    for (let l in this.lines) {
      if (this.lines.hasOwnProperty(l)) {
        this.lines[l].sampleData(datapointsLimit);
      }
    }
  }

  private setCanvasWidth(cb?: () => void) {
    if (this.host.clientWidth === 0) {
      setTimeout(() => {
        this.setCanvasWidth(cb);
      }, 50);
    } else {
      this.canvas.width = this.host.clientWidth;
      this.canvas.style.position = 'relative';
      if (cb) { cb(); }
    }
  }

  private setCanvasHeight() {
    this.host.style.height = `${this.height}px`;
    this.canvas.height = this.height;
  }

  private setHostVisibility(shouldShow: boolean) {
    if (this.host) {
      this.host.style.display = shouldShow ? 'block' : 'none';
    }
  }
}

export interface ISmoothieLines {
    [lineId: number]: SmoothieLine;
}
