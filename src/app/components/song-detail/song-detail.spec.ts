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
import {SongDetail} from './song-detail';


describe('SongDetail Component', () => {

  beforeEachProviders((): any[] => []);


  it('should ...', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    return tcb.createAsync(SongDetail).then((fixture) => {
      fixture.detectChanges();
    });
  }));

});
