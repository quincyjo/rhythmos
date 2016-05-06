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
import {SongProvider} from './song-provider.service';
import {SongsModel} from '../../models/index';


describe('SongProvider Service', () => {

  beforeEachProviders(() => [
    SongsModel,
    provide(SongProvider, {
      deps: [SongsModel]})
  ]);


  it('should ...', inject([SongProvider], (service:SongProvider) => {

  }));

});
