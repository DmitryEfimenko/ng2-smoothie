import { OnInit, OnChanges, OnDestroy, ElementRef } from '@angular/core';
import { SmoothieLine } from './smoothieLine';
export declare class Ng2SmoothieComponent implements OnInit, OnChanges, OnDestroy {
    private element;
    delay: number;
    height: number;
    chartOptions: any;
    isVisible: boolean;
    extraOpts: IExtraOpts;
    lines: ISmoothieLines;
    private canvas;
    private host;
    private chart;
    private resizeTimer;
    constructor(element: ElementRef);
    ngOnInit(): void;
    ngOnChanges(changes: any): void;
    ngOnDestroy(): any;
    addLineData(lineId: number, time: Date, val: number): void;
    toggleLine(lineId: number, shouldShow?: boolean): void;
    toggleLines(lineIds: number | number[]): void;
    areaFill(lineId: number, shouldShow: boolean): void;
    keepAllDataVisible(timeWaitTillResizeMs?: number): void;
    onWindowResize(): void;
    getTimeToPassChart(): number;
    private sampleData(datapointsLimit);
    private setCanvasWidth(cb?);
    private setCanvasHeight();
    private setHostVisibility(shouldShow);
}
export interface ISmoothieLines {
    [lineId: number]: SmoothieLine;
}
export interface IExtraOpts {
    keepAllDataVisible?: {
        timeLimitMs: number;
        datapointsLimit: number;
    };
}
