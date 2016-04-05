export class RhythmosPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('rhythmos-app p')).getText();
  }
}
