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
import {OptionsProvider} from './options-provider';


describe('OptionsProvider Service', () => {

  beforeEachProviders(() => [OptionsProvider]);


  it('should ...', inject([OptionsProvider], (service:OptionsProvider) => {

  }));

});
