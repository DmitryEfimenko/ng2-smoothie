/* tslint:disable:no-unused-variable */

import { TestBed, async, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { IChartOptions } from 'smoothie';

import { Ng2SmoothieComponent } from './ng2-smoothie.component';
import { addNMinutes } from './smoothieLine.spec';

describe('Component: Ng2Smoothie', () => {
  let fixture: ComponentFixture<Ng2SmoothieComponent>;
  let component: Ng2SmoothieComponent;
  let appHtml: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Ng2SmoothieComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ng2SmoothieComponent);
    component = fixture.debugElement.componentInstance;
    appHtml = fixture.debugElement.nativeElement;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('host should have style display: block;', () => {
    fixture.detectChanges();
    expect(appHtml.style.display).toBe('block');
  });

  it('addLineData() should add new line if it does not exist', () => {
    fixture.detectChanges();
    component.addLineData(1, new Date(), 1);
    expect(component.lines[1]).toBeDefined();
    expectLinesLengthToBe(1);
  });

  it('addLineData() should update existing line', () => {
    fixture.detectChanges();
    let now = new Date();
    component.addLineData(1, now, 1);
    component.addLineData(1, addNMinutes(now, 1), 2);
    expectLinesLengthToBe(1);
    expectNthLineSeriesSetLengthToBe(0, 2);
  });

  it('should show/hide host based on Input() isVisible', () => {
    component.isVisible = false;
    // have to call ngOnChanges due to bug: https://github.com/angular/angular/issues/9866
    component.ngOnChanges({ isVisible: {} });
    fixture.detectChanges();
    expect(appHtml.style.display).toBe('none');
  });

  it('toggleLine() should remove line from chart if it is shown', () => {
    fixture.detectChanges();
    let now = new Date();
    addNLineData(1, now, 1);
    addNLineData(1, now, 2);
    component.toggleLine(1);
    expectLinesLengthToBe(1);
  });

  it('toggleLine() should re-add line from chart if it is missing', () => {
    fixture.detectChanges();
    let now = new Date();
    addNLineData(1, now, 1);
    addNLineData(1, now, 2);
    component.toggleLine(1);
    component.toggleLine(1);
    expectLinesLengthToBe(2);
  });

  it('toggleLines() should toggle lines', () => {
    fixture.detectChanges();
    let now = new Date();
    addNLineData(1, now, 1);
    addNLineData(1, now, 2);
    component.toggleLines([1, 2]);
    expectLinesLengthToBe(0);
  });

  it('areaFill() should fill area of the line', () => {
    fixture.detectChanges();
    addNLineData(1, new Date(), 1);
    component.areaFill(1, true);
    let expectedStyle = component.lines[1].options.fillStyle;
    expect(getSeriesSet(0).timeSeries.options.fillStyle).toBe(expectedStyle);
  });

  it('keepAllDataVisible() should not double grid if timeout is low', fakeAsync(() => {
    component.extraOpts = {
      keepAllDataVisible: {
        datapointsLimit: 10,
        timeLimitMs: 1000 // 1s
      }
    };
    let spy = spyOn(component, 'getTimeToPassChart').and.returnValue(1500);
    fixture.detectChanges();
    let o = getChartOptions();
    let millisPerPixel1 = o.millisPerPixel;
    let millisPerLine1 = o.grid.millisPerLine;
    let tickTime = component.getTimeToPassChart();
    tick(tickTime);
    expect(o.millisPerPixel).toBe(millisPerPixel1);
    expect(o.grid.millisPerLine).toBe(millisPerLine1);
  }));

  // disabled due to bug: https://github.com/angular/angular/issues/8251
  xit('keepAllDataVisible() should double grid', fakeAsync(() => {
    component.extraOpts = {
      keepAllDataVisible: {
        datapointsLimit: 10,
        timeLimitMs: 17500 // enough for one resize
      }
    };
    let spy = spyOn(component, 'getTimeToPassChart').and.returnValue(17000);
    fixture.detectChanges();
    let o = getChartOptions();
    let millisPerPixel1 = o.millisPerPixel;
    let millisPerLine1 = o.grid.millisPerLine;
    let tickTime = component.getTimeToPassChart();
    tick(tickTime);
    expect(o.millisPerPixel).toBe(millisPerPixel1 * 2);
    expect(o.grid.millisPerLine).toBe(millisPerLine1 * 2);
  }));

  function addNLineData(n: number, startingFrom: Date = new Date(), lineId = 1) {
    let latestDate: Date;
    for (let i = 0; i < n; i++) {
      latestDate = addNMinutes(startingFrom, i);
      component.addLineData(lineId, latestDate, i);
    }
    return latestDate;
  }

  function expectLinesLengthToBe(n: number) {
    expect((<any>component).chart.seriesSet.length).toBe(n);
  }

  function expectNthLineSeriesSetLengthToBe(setIndex: number, expectedLength: number) {
    expect(getSeriesSet(setIndex).timeSeries.data.length).toBe(expectedLength);
  }

  function getSeriesSet(index: number) {
    return (<any>component).chart.seriesSet[index];
  }

  function getChartOptions(): IChartOptions {
    return (<any>component).chart.options;
  }
});
