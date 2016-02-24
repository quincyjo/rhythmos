export class RhythmosPage {
  navigateTo() { return browser.get('/'); }
  getParagraphText() { return element(by.css('Rhythmos-app p')).getText(); }
}
