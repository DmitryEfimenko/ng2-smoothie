import { Ng2SmoothiePage } from './app.po';

describe('ng2-smoothie App', function() {
  let page: Ng2SmoothiePage;

  beforeEach(() => {
    page = new Ng2SmoothiePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
