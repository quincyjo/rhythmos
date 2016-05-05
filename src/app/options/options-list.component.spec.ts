import {
  it,
  iit,
  describe,
  ddescribe,
  expect,
  inject,
  injectAsync,
  beforeEachProviders
} from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/compiler/testing';
import {provide} from '@angular/core';
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
