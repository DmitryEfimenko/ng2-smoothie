import { browser, element, by } from 'protractor/globals';

export class Ng2SmoothiePage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('de-root h1')).getText();
  }
}
