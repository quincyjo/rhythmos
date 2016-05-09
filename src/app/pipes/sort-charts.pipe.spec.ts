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
import {SortChartsPipe} from './sort-charts.pipe';
import {DifficultyType, DIFFICULTYLITERALS, StepsType} from '../shared/types/index';

describe('Pipe: SortCharts', () => {
  let pipe;

  beforeEachProviders(() => [
    SortChartsPipe
  ])

  beforeEach(inject([SortChartsPipe], p => {
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

  it('should sort by stepstype', () => {
    let input: Array<{stepstype: StepsType}> = [
      {stepstype: 'dance-solo'},
      {stepstype: 'dance-double'},
      {stepstype: 'dance-threepanel'},
      {stepstype: 'pump-halfdouble'},
      {stepstype: 'pump-single'},
      {stepstype: 'dance-single'},
      {stepstype: 'para-single'},
      {stepstype: 'dance-couple'},
      {stepstype: 'pump-double'},
      {stepstype: 'ez2-real'},
      {stepstype: 'ez2-single'},
      {stepstype: 'pump-couple'},
      {stepstype: 'ez2-double'}
    ];
    let target: Array<{stepstype: StepsType}> = [
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
    expect(pipe.transform(input)).toEqual(target);
  });

  it('should sort by difficulty if same stepstype', () => {
    let input: Array<{stepstype: StepsType, difficulty: DifficultyType}> = [
      {stepstype: 'dance-single', difficulty:'Edit'},
      {stepstype: 'dance-single', difficulty:'Medium'},
      {stepstype: 'dance-single', difficulty:'Beginner'},
      {stepstype: 'dance-single', difficulty:'Easy'},
      {stepstype: 'dance-single', difficulty:'Hard'},
      {stepstype: 'dance-single', difficulty:'Challenge'}
    ];
    let target: Array<{stepstype: StepsType, difficulty: DifficultyType}> = [
      {stepstype: 'dance-single', difficulty:'Beginner'},
      {stepstype: 'dance-single', difficulty:'Easy'},
      {stepstype: 'dance-single', difficulty:'Medium'},
      {stepstype: 'dance-single', difficulty:'Hard'},
      {stepstype: 'dance-single', difficulty:'Challenge'},
      {stepstype: 'dance-single', difficulty:'Edit'}
    ];
    expect(pipe.transform(input)).toEqual(target);
  });

  it('should group by type, sort by difficulty', () => {
    let input: Array<{stepstype: StepsType, difficulty: DifficultyType}> = [
      {stepstype: 'dance-double', difficulty:'Edit'},
      {stepstype: 'dance-solo', difficulty:'Medium'},
      {stepstype: 'dance-single', difficulty:'Hard'},
      {stepstype: 'dance-double', difficulty:'Easy'},
      {stepstype: 'dance-single', difficulty:'Beginner'},
      {stepstype: 'dance-solo', difficulty:'Hard'}
    ];
    let target: Array<{stepstype: StepsType, difficulty: DifficultyType}> = [
      {stepstype: 'dance-single', difficulty:'Beginner'},
      {stepstype: 'dance-single', difficulty:'Hard'},
      {stepstype: 'dance-solo', difficulty:'Medium'},
      {stepstype: 'dance-solo', difficulty:'Hard'},
      {stepstype: 'dance-double', difficulty:'Easy'},
      {stepstype: 'dance-double', difficulty:'Edit'}
    ];
    expect(pipe.transform(input)).toEqual(target);
  });
});
