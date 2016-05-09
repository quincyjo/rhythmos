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
import {OptionsDetailComponent} from './options-detail.component';
import {Router, RouteSegment} from '@angular/router';
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
    provide(OptionsDetailComponent, {
      deps: [OptionsProvider, Router]})
  ]);

  beforeEach(inject([TestComponentBuilder], (_tcb) => {
    tcb = _tcb;
  }));

});
