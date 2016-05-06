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
import {OptionsProvider} from './options-provider.service';
import {OptionsModel} from '../../models/index';


describe('OptionsProvider Service', () => {

  beforeEachProviders(() => [
    OptionsModel,
    provide(OptionsProvider, {
      deps: [OptionsModel]})
  ]);


  it('should ...', inject([OptionsProvider], (service:OptionsProvider) => {

  }));

});
