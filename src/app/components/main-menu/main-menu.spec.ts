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
import {TestComponentBuilder} from '@angular/compiler/testing'
import {provide} from '@angular/core';
import {MainMenu} from './main-menu';


describe('MainMenu Component', () => {

  beforeEachProviders((): any[] => []);


  it('should ...', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    return tcb.createAsync(MainMenu).then((fixture) => {
      fixture.detectChanges();
    });
  }));

});
