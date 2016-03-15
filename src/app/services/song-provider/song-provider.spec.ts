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
import {SongProvider} from './song-provider';


describe('SongProvider Service', () => {

  beforeEachProviders(() => [SongProvider]);


  it('should ...', inject([SongProvider], (service:SongProvider) => {

  }));

});
