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
import {Router} from '@angular/router';
import {provide} from '@angular/core';
import {MainMenu} from './main-menu.component';

class MockRouter {
  navigate() { }
};

describe('MainMenu Component', () => {
  let tcb;

  beforeEachProviders((): any[] => [
    provide(Router, {useClass: MockRouter}),
    provide(MainMenu, {
      deps: [Router]})
  ]);

  beforeEach(inject([TestComponentBuilder], (_tcb) => {
    tcb = _tcb;
  }));

  it('should ...', done => {
    return tcb
    .overrideProviders(MainMenu, [
      provide(Router, {useClass: MockRouter})
    ])
    .createAsync(MainMenu)
    .then((fixture) => {
      fixture.detectChanges();
      done();
    })
    .catch(e => done());
  });

});
