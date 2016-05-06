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
import {Router, RouteSegment} from '@angular/router';
import {OptionsListComponent} from './options-list.component';
import {Option} from '../../shared/index';
import {OptionsProvider} from '../../services/index';

class MockOptionsProvider {
  get() {
    return Promise.resolve(
      [{id:1, label:'one', value:0, dirty:false, values:['Default'], tags:[], children:[]}]
    );
  }
};

class MockRouter {
  navigate() { }
};

describe('OptionsDetailComponent', () => {
  let tcb;

  beforeEachProviders(() => [
    TestComponentBuilder,
    provide(OptionsProvider, {useClass: MockOptionsProvider}),
    provide(Router, {useClass: MockRouter}),
    provide(OptionsListComponent, {
        deps: [OptionsProvider, Router]})
  ]);

  beforeEach(inject([TestComponentBuilder], (_tcb) => {
    tcb = _tcb;
  }));

  it('should ...', done => {
    return tcb
    .overrideProviders(OptionsListComponent, [
      provide(OptionsProvider, {useClass: MockOptionsProvider}),
      provide(Router, {useClass: MockRouter})
    ])
    .createAsync(OptionsListComponent)
    .then((fixture) => {
      fixture.detectChanges();
      done();
    })
    .catch(e => done());
  });

});
