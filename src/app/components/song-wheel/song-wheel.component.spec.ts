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
import {TestComponentBuilder} from '@angular/compiler/testing';
import {provide} from '@angular/core';
import {Router} from '@angular/router-deprecated';
import {SongWheel} from './song-wheel.component';
import {SongProvider} from '../../services/index';

class MockSongProvider {
  getSongs() {
    return [];
  }

  getBackground() {
    return 'fakeObjectUrl';
  }

  getMusic() {
    return 'fakeObjectUrl';
  }
}

class MockRouter {
  navigate() { }
};

describe('SongWheel Component', () => {
  let tcb;

  beforeEachProviders((): any[] => [
    TestComponentBuilder,
    provide(SongProvider, {useClass: MockSongProvider}),
    provide(Router, {useClass: MockRouter}),
    provide(SongWheel, {
      deps: [SongProvider, Router]})
  ]);

  beforeEach(inject([TestComponentBuilder], (_tcb) => {
    tcb = _tcb;
  }));

  it('should ...', done => {
    return tcb
    .overrideProviders(SongWheel, [
      provide(SongProvider, {useClass: MockSongProvider}),
      provide(Router, {useClass: MockRouter})
    ])
    .createAsync(SongWheel)
    .then((fixture) => {
      fixture.detectChanges();
      done();
    })
    .catch(e => done());
  });

});
