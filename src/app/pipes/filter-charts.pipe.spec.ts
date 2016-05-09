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
import {FilterChartsPipe} from './filter-charts.pipe';
import {StepsType} from '../shared/types/index';

describe('Pipe: SortCharts', () => {
  let pipe;

  beforeEachProviders(() => [
    FilterChartsPipe
  ])

  beforeEach(inject([FilterChartsPipe], p => {
    pipe = p;
  }));

  it('should throw if not used on an array of objects', () => {
    expect(() => pipe.transform(null)).toThrow();
    expect(() => pipe.transform(undefined)).toThrow();
    expect(() => pipe.transform(42)).toThrow();
    expect(() => pipe.transform('Happy meals')).toThrow();
  });

  it('should work with an empty array', () => {
    expect(() => pipe.transform([]).toEqual([]));
  });

  it('filter by given type', () => {
    let input: Array<{stepstype: StepsType}> = [
      {stepstype: 'dance-single'},
      {stepstype: 'dance-solo'},
      {stepstype: 'dance-double'},
      {stepstype: 'dance-couple'},
      {stepstype: 'pump-single'},
      {stepstype: 'pump-halfdouble'},
      {stepstype: 'pump-double'},
      {stepstype: 'pump-couple'},
      {stepstype: 'ez2-single'},
      {stepstype: 'ez2-double'},
      {stepstype: 'ez2-real'},
      {stepstype: 'para-single'},
      {stepstype: 'dance-threepanel'}
    ];
    let target: Array<{stepstype: StepsType}> = [
      {stepstype: 'dance-single'},
      {stepstype: 'dance-solo'},
      {stepstype: 'dance-double'},
      {stepstype: 'dance-couple'},
      {stepstype: 'dance-threepanel'}
    ];
    expect(pipe.transform(input, 'dance')).toEqual(target);
    target = [
      {stepstype: 'pump-single'},
      {stepstype: 'pump-halfdouble'},
      {stepstype: 'pump-double'},
      {stepstype: 'pump-couple'},
    ];
    expect(pipe.transform(input, 'pump')).toEqual(target);
    target = [
      {stepstype: 'ez2-single'},
      {stepstype: 'ez2-double'},
      {stepstype: 'ez2-real'},
    ];
    expect(pipe.transform(input, 'ez2')).toEqual(target);
  });
});
