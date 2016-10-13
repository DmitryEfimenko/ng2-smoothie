import { fakeAsync, tick } from '@angular/core/testing';
import { SmoothieLine } from './smoothieLine';

describe('SmoothieLine', () => {
  let line: SmoothieLine;

  beforeEach(() => {
    line = new SmoothieLine(0, {}, { keepAllDataVisible: { timeLimitMs: 1000 * 60, datapointsLimit: 4 } });
  });

  it('should initialize SmoothieLine with defaults', () => {
    expect(line.series).toBeDefined();
    expect(line.options.strokeStyle).toBeDefined();
    expect(line._strokeStyle).toBeDefined();
    expect(line._fillStyle).toBeDefined();
  });

  it('addData() should add data', () => {
    line.addData(new Date(), 5);
    expectSeriesDataLengthToBe(1);
  });

  it('sampleData() should only execute when there is more data then the limit', () => {
    addNData(4);
    line.sampleData(4);
    expectSeriesDataLengthToBe(4);
  });

  it('sampleData() should initially take each 2nd data point', () => {
    addNData(5);
    line.sampleData(4);
    expectSeriesDataLengthToBe(3);
  });

  it('addData() should not add data 1st time around after sampleData() is called', () => {
    let date = addNData(5);
    line.sampleData(4);
    addNData(1, addNMinutes(date, 1));
    expectSeriesDataLengthToBe(3);
  });

  xit('addData() should add data 2nd time around after sampleData() is called', fakeAsync(() => {
    let date = addNData(5);
    line.sampleData(4);
    tick(1000 * 60 * 2);
    addNData(2, addNMinutes(date, 1));
    expectSeriesDataLengthToBe(4);
  }));

  xit('addData() should add each send after sampleDate()', () => {
    let date = addNData(5);
    line.sampleData(4);
    addNData(4, addNMinutes(date, 1));
    expectSeriesDataLengthToBe(5);
  });

  xit('sampleData() should take each 4th data point on second call', () => {
    let date = addNData(5);
    line.sampleData(4);
    addNData(4, addNMinutes(date, 1));
    line.sampleData(4);
    expectSeriesDataLengthToBe(3);
  });

  function addNData(n: number, startingFrom: Date = new Date()) {
    let latestDate: Date;
    for (let i = 0; i < n; i++) {
      latestDate = addNMinutes(startingFrom, i);
      line.addData(latestDate, i);
    }
    return latestDate;
  }

  function expectSeriesDataLengthToBe(n: number) {
    expect((<any>line.series).data.length).toBe(n);
  }
});

export function addNMinutes(date: Date, n: number) {
  return new Date(new Date().setTime(date.getTime() + n * 1000 * 60));
}
