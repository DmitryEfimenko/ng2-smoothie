import { ITimeSeriesPresentationOptions, TimeSeries } from 'smoothie';
export declare class SmoothieLine {
    private index;
    options: ITimeSeriesPresentationOptions;
    series: TimeSeries;
    isShown: boolean;
    _strokeStyle: string;
    _fillStyle: string;
    private allData;
    private delta;
    private addDataIx;
    constructor(index: number, options: ITimeSeriesPresentationOptions);
    addData(time: Date, val: number): void;
    sampleData(datapointsLimit: number): void;
}
