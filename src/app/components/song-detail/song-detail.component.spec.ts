import {
  it,
  iit,
  describe,
  ddescribe,
  expect,
  inject,
  injectAsync,
  beforeEach,
  beforeEachProviders
} from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/compiler/testing'
import {provide} from '@angular/core';
import {SongDetail} from './song-detail.component';
import {SongProvider} from '../../services/index';

class MockSongProvider {
  getBanner(song: any) {
    return 'fakeObjectUrl';
  }
}

describe('SongDetail Component', () => {
  let tcb;

  beforeEachProviders((): any[] => [
    TestComponentBuilder,
    provide(SongProvider, {useClass: MockSongProvider}),
    provide(SongDetail, {
      deps: [SongProvider]})
  ]);

  beforeEach(inject([TestComponentBuilder], (_tcb) => {
    tcb = _tcb;
  }));

  it('should ...', done => {
    return tcb
    .overrideProviders(SongDetail, [
      provide(SongProvider, {useClass: MockSongProvider})
    ])
    .createAsync(SongDetail)
    .then((fixture) => {
      fixture.detectChanges();
      done();
    })
    .catch(e => done());
  });

});
