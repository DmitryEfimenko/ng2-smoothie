import { ITimeSeriesPresentationOptions, TimeSeries } from 'smoothie';

export class SmoothieLine {
  series: TimeSeries;
  isShown: boolean = true;
  _strokeStyle: string;
  _fillStyle: string;

  private allData: { time: Date, val: number }[] = [];
  private delta = 1;
  private addDataIx = 0;

  constructor(private index: number, public options: ITimeSeriesPresentationOptions) {
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
    this.allData.push({ time: time, val: val });
    this.addDataIx = this.addDataIx + 1;
    if (this.addDataIx === this.delta) {
      this.series.append(time.getTime(), val);
      this.addDataIx = 0;
    }
  }

  sampleData(datapointsLimit: number) {
    let dataLength = this.allData.length;
    if (dataLength > datapointsLimit) {
      this.delta = Math.floor(dataLength / datapointsLimit) * 2;

      this.series.clear();
      for (let i = 0, l = dataLength; i < l; i = i + this.delta) {
        let d = this.allData[i];
        this.series.append(d.time.getTime(), d.val);
      }
      this.addDataIx = 0;
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
