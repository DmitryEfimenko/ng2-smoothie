import { ITimeSeriesPresentationOptions, TimeSeries } from 'smoothie';
import { IExtraOpts } from './interfaces';

export class SmoothieLine {
  series: TimeSeries;
  isShown: boolean = true;
  _strokeStyle: string;
  _fillStyle: string;

  private allowAddData = true;
  private timeBetweenDatapoints: number = undefined;

  constructor(private index: number, public options: ITimeSeriesPresentationOptions, private extraOpts: IExtraOpts) {
    if (!this.options.strokeStyle) {
      this.options.strokeStyle = rgba(generateColor(this.index), 0.8);
    }

    this._fillStyle = this.options.fillStyle
      ? this.options.fillStyle
      : rgba(generateColor(this.index), 0.6);

    this._strokeStyle = this.options.strokeStyle;
    this.series = new TimeSeries();
  }

  addData(time: Date, val: number) {
    if (this.allowAddData) {
      this.series.append(time.getTime(), val);
      this.disableAddingDataForTime();
    }
  }

  sampleData(datapointsLimit: number) {
    let allData: number[][] = (<any>this.series).data;
    let dataLength = allData.length;
    if (dataLength > datapointsLimit) {
      let delta = Math.floor(dataLength / datapointsLimit) * 2;
      this.series.clear();
      for (let i = 0, l = dataLength; i < l; i = i + delta) {
        let d = allData[i];
        this.series.append(d[0], d[1]);
      }

      let newData = (<any>this.series).data;
      let firstP = newData[0][0];
      let secondP = newData[1][0];
      this.timeBetweenDatapoints = secondP - firstP - 10;
      this.disableAddingDataForTime();
    }
  }

  private disableAddingDataForTime() {
    if (this.timeBetweenDatapoints !== undefined) {
      this.allowAddData = false;
      setTimeout(() => {
        this.allowAddData = true;
      }, this.timeBetweenDatapoints);
    }
  }
}

const defaultColors = [
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

function rgba(colour: Array<number>, alpha: number): string {
    return 'rgba(' + colour.concat(alpha).join(',') + ')';
}

function generateColor(index: number): number[] {
    return defaultColors[index] || getRandomColor();
}

function getRandomColor(): number[] {
    return [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)];
}

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
