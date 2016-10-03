import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Ng2SmoothieComponent, IExtraOpts } from '../ng2-smoothie/index';

@Component({
  selector: 'de-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  charIsVisible = true;
  extraOpts: IExtraOpts = {
    keepAllDataVisible: {
      datapointsLimit: 10,
      timeLimitMs: 1000 * 60 * 2 // 2m
    }
  };
  @ViewChild('chart') chart: Ng2SmoothieComponent;

  ngOnInit() {
    setInterval(() => {
      this.chart.addLineData(1, new Date(), this.randomNumber(15, 30));
      this.chart.addLineData(2, new Date(), this.randomNumber(20, 35));
    }, 1000);
  }

  toggleLine(id: number) {
    this.chart.toggleLine(id);
  }

  areaFill(id: number, shouldShow: boolean) {
    this.chart.areaFill(id, shouldShow);
  }

  private randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
