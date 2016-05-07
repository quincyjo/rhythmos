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
import {SongData} from './song-data.class';

describe('SongChart', () => {
  let data: SongData;

  beforeEach(() => {
    data = null;
  })

  it('should default values to false', () => {
    data = new SongData();
    for (let key in data) {
      expect(data[key]).toEqual(false);
    }
  });

  it('should take matched keys and store the value', () => {
    let input = {
      banner: '/nerd/ami.png',
      background: 'applesandoranges.png',
      music: 'flacyo.flac'
    };
    data = new SongData(input);
    for (let key in data) {
      if (input[key]) {
        expect(data[key]).toEqual(input[key]);
      } else {
        expect(data[key]).toEqual(false);
      }
    }
  });

  it('should ignore unmatched values', () => {
    let input = {
      woot: 'I',
      love: 'making',
      tests: 'don\'t you?'
    }
    data = new SongData(input);
    for (let key in data) {
      if (input[key]) {
        expect(data[key]).toEqual(undefined);
      } else {
        expect(data[key]).toEqual(false);
      }
    }
  });
});
