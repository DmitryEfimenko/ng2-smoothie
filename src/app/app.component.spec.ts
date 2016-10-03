/* tslint:disable:no-unused-variable */

import { TestBed, async, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { Ng2SmoothieModule, Ng2SmoothieComponent } from '../ng2-smoothie/index';

const triggerDomEvent = (eventType: string, target: HTMLElement | Element, eventData: Object = {}) => {
  const event: Event = document.createEvent('Event');
  Object.assign(event, eventData);
  event.initEvent(eventType, true, true);
  target.dispatchEvent(event);
};

describe('App: Ng2Smoothie', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let appHtml: HTMLElement;
  let chartEl: HTMLElement;
  let canvasEl: HTMLCanvasElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [Ng2SmoothieModule, FormsModule],
      declarations: [AppComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
    appHtml = fixture.debugElement.nativeElement;
    chartEl = <HTMLElement>appHtml.querySelector('de-ng2-smoothie');
    canvasEl = <HTMLCanvasElement>chartEl.children[0];
    fixture.detectChanges();
  });

  it('should create the app', async(() => {
    expect(app).toBeTruthy();
  }));

  it(`property chart should be a Ng2SmoothieComponent`, async(() => {
    expect(app.chart).toBeTruthy();
    expect(app.chart instanceof Ng2SmoothieComponent).toBeTruthy();
  }));

  it('should render canvas in <de-ng2-smoothie>', async(() => {
    expect(chartEl.firstElementChild.tagName).toBe('CANVAS');
  }));

  it('should set host element height', () => {
    expect(chartEl.style.height).toBe(`${app.chart.height}px`);
    expect(canvasEl.height.toString()).toBe(app.chart.height);
  });

  it('should set canvas width to container width', () => {
    let containerWidth = appHtml.clientWidth;
    let chartWidth = canvasEl.clientWidth;
    expect(chartWidth).toBe(containerWidth);
  });

  it('should resize canvas width on window resize', fakeAsync(() => {
    let spy = spyOn(app.chart, 'onWindowResize').and.callThrough();
    appHtml.style.width = '400px';
    triggerDomEvent('resize', <any>window);
    tick(100);
    let chartWidth = canvasEl.clientWidth;
    expect(spy).toHaveBeenCalled();
    expect(chartWidth).toBe(400);
  }));
});
