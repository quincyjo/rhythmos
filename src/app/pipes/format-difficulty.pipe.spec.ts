import {
    beforeEach,
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
import {FormatDifficultyPipe} from './format-difficulty.pipe';
import {DifficultyType} from '../shared/types/index';

describe('Pipe: FormatDifficulty', () => {
  let pipe;

  beforeEachProviders(() => [
    FormatDifficultyPipe
  ])

  beforeEach(inject([FormatDifficultyPipe], p => {
    pipe = p;
  }));

  it('should throw if not used on a string', () => {
    expect(() => pipe.transform(null)).toThrow();
    expect(() => pipe.transform(undefined)).toThrow();
    expect(() => pipe.transform(42)).toThrow();
    expect(() => pipe.transform([])).toThrow();
    expect(() => pipe.transform({})).toThrow();
  })

  it('should throw if passed string is not a difficulty', () => {
    expect(() => pipe.transform('buffalo girls')).toThrow();
    expect(() => pipe.transform('come out')).toThrow();
    expect(() => pipe.transform('tonight')).toThrow();
  });

  it('should formal difficulties', () => {
    expect(pipe.transform('Beginner')).toEqual('bg');
    expect(pipe.transform('Easy')).toEqual('es');
    expect(pipe.transform('Medium')).toEqual('md');
    expect(pipe.transform('Hard')).toEqual('hd');
    expect(pipe.transform('Challenge')).toEqual('in');
    expect(pipe.transform('Edit')).toEqual('ed');
  });
});
