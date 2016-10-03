import { SmoothieLine } from './smoothieLine';

describe('SmoothieLine', () => {
  let line: SmoothieLine;

  beforeEach(() => {
    line = new SmoothieLine(0, {});
  });

  it('should initialize SmoothieLine with defaults', () => {
    expect(line.series).toBeDefined();
    expect(line.options.strokeStyle).toBeDefined();
    expect(line._strokeStyle).toBeDefined();
    expect(line._fillStyle).toBeDefined();
  });

  it('addData() should add data', () => {
    line.addData(new Date(), 5);
    expectDataLengthToBe(1);
  });

  it('sampleData() should only execute when there is more data then the limit', () => {
    addNData(4);
    line.sampleData(4);
    expectDataLengthToBe(4);
  });

  it('sampleData() should initially take each 2nd data point', () => {
    addNData(5);
    line.sampleData(4);
    expectDataLengthToBe(3);
  });

  it('sampleData() should take each 4th data point on second call', () => {
    addNData(9);
    line.sampleData(4);
    line.sampleData(4);
    expectDataLengthToBe(3);
  });

  it('addData() should not add data 1st time around after sampleData() is called', () => {
    let date = addNData(5);
    line.sampleData(4);
    addNData(1, addNMinutes(date, 1));
    expectDataLengthToBe(3);
  });

  it('addData() should add data 2nd time around after sampleData() is called', () => {
    let date = addNData(5);
    line.sampleData(4);
    addNData(2, addNMinutes(date, 1));
    expectDataLengthToBe(4);
  });

  function addNData(n: number, startingFrom: Date = new Date()) {
    let latestDate: Date;
    for (let i = 0; i < n; i++) {
      latestDate = addNMinutes(startingFrom, i);
      line.addData(latestDate, i);
    }
    return latestDate;
  }

  function expectDataLengthToBe(n: number) {
    expect((<any>line.series).data.length).toBe(n);
  }
});

export function addNMinutes(date: Date, n: number) {
  return new Date(new Date().setTime(date.getTime() + n * 1000 * 60));
}
