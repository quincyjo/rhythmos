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
import {SongProvider} from './song-provider';


describe('SongProvider Service', () => {

  beforeEachProviders(() => [SongProvider]);


  it('should ...', inject([SongProvider], (service:SongProvider) => {

  }));

});
