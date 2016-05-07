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
import {SongChart} from './song-chart.class';

describe('SongChart', () => {
  let chart: SongChart;

  beforeEach(() => {
    chart = null;
  })

  it('should default values to null', () => {
    chart = new SongChart();
    for (let key in chart) {
      expect(chart[key]).toEqual(null);
    }
  });

  it('should take matched keys and store the value', () => {
    let input = {
      chartname: 'Chart42',
      description: 'no',
      chartstyle: 'This is madness',
      difficulty: 'Edit',
      stepstype: 'dance-couple',
      meter: 30
    };
    chart = new SongChart(input);
    for (let key in chart) {
      if (input[key]) {
        expect(chart[key]).toEqual(input[key]);
      } else {
        expect(chart[key]).toEqual(null);
      }
    }
  });

  it('should ignore unmatched values', () => {
    let input = {
      woot: 'I',
      love: 'making',
      tests: 'don\'t you?'
    }
    chart = new SongChart(input);
    for (let key in chart) {
      if (input[key]) {
        expect(chart[key]).toEqual(undefined);
      } else {
        expect(chart[key]).toEqual(null);
      }
    }
  });
});
