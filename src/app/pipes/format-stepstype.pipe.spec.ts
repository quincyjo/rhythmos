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
import {FormatStepstypePipe} from './format-stepstype.pipe';
import {StepsType, STEPSCOLUMNS} from '../shared/types/index';

describe('Pipe: FormatStesptype', () => {
  let pipe;

  beforeEachProviders(() => [
    FormatStepstypePipe
  ])

  beforeEach(inject([FormatStepstypePipe], p => {
    pipe = p;
  }));

  it('should throw if not used on a string', () => {
    expect(() => pipe.transform(null)).toThrow();
    expect(() => pipe.transform(undefined)).toThrow();
    expect(() => pipe.transform(42)).toThrow();
    expect(() => pipe.transform([])).toThrow();
    expect(() => pipe.transform({})).toThrow();
  })

  it('should throw if passed string is not a stepstype', () => {
    expect(() => pipe.transform('buffalo girls')).toThrow();
    expect(() => pipe.transform('come out')).toThrow();
    expect(() => pipe.transform('tonight')).toThrow();
  });

  it('should formal difficulties', () => {
    expect(pipe.transform('dance-single')).toEqual('single');
    expect(pipe.transform('dance-solo')).toEqual('solo');
    expect(pipe.transform('dance-double')).toEqual('double');
    expect(pipe.transform('pump-single')).toEqual('single');
    expect(pipe.transform('ez2-single')).toEqual('single');
    expect(pipe.transform('dance-threepanel')).toEqual('threepanel');
  });
});
