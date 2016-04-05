import { RhythmosPage } from './app.po';

describe('rhythmos App', function() {
  let page: RhythmosPage;

  beforeEach(() => {
    page = new RhythmosPage();
  })

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('rhythmos Works!');
  });
});
