import {
  it,
  iit,
  describe,
  ddescribe,
  expect,
  inject,
  injectAsync,
  TestComponentBuilder,
  beforeEachProviders
} from 'angular2/testing';
import {provide} from 'angular2/core';
import {OptionsListComponent} from './options-list.component';
import {Option} from '../shared/interfaces/option';
import {OptionsProvider} from '../services/options-provider/options-provider';

class MockOptionsProvider {
  getAll() {
    return Promise.resolve(
      [{id:1, label:'one', value:0, dirty:false, values:['Default'], tags:[], children:[]}]
    );
  }
}

describe('OptionsListComponent', () => {

  beforeEachProviders(() => [
    provide(OptionsProvider, {useClass: MockOptionsProvider}),
  ]);

  it('should ...', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    return tcb.createAsync(OptionsListComponent).then((fixture) => {
      fixture.detectChanges();
    });
  }));

});
