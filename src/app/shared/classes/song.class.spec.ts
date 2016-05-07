import {
    beforeEachProviders,
    describe,
    expect,
    iit,
    inject,
    it,
    injectAsync,
    fakeAsync,
    tick
} from '@angular/core/testing';
import {Song} from './song.class';

describe('Song', () => {
  let song: Song;

  beforeEach(() => {
    song = null;
  });

  it('should should take an empty constructor', () => {
    try {
      song = new Song();
      expect(song.getMeta()).toEqual(undefined);
      expect(song.getData()).toEqual(undefined);
      expect(song.getCharts()).toEqual([]);
      expect(song.getOther()).toEqual({});
    } catch (e) {
      fail(e);
    }
  });
});
