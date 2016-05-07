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
import {SongMetadata} from './song-metadata.class';

describe('SongChart', () => {
  let metadata: SongMetadata;

  beforeEach(() => {
    metadata = null;
  })

  it('should default values to null', () => {
    metadata = new SongMetadata();
    for (let key in metadata) {
      expect(metadata[key]).toEqual(null);
    }
  });

  it('should take matched keys and store the value', () => {
    let input = {
      version: 0,
      format: 'anarchy',
      title: 'Independence Day',
      subtitle: 'Aliens yo',
      artist: 'Will Smith'
    };
    metadata = new SongMetadata(input);
    for (let key in metadata) {
      if (input[key]) {
        expect(metadata[key]).toEqual(input[key]);
      } else {
        expect(metadata[key]).toEqual(null);
      }
    }
  });

  it('should ignore unmatched values', () => {
    let input = {
      woot: 'I',
      love: 'making',
      tests: 'don\'t you?'
    }
    metadata = new SongMetadata(input);
    for (let key in metadata) {
      if (input[key]) {
        expect(metadata[key]).toEqual(undefined);
      } else {
        expect(metadata[key]).toEqual(null);
      }
    }
  });
});
