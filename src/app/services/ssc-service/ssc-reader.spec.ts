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
import {TestComponentBuilder} from '@angular/compiler/testing';

import {SscReader, ChartBuilder, ValueBuilder} from './ssc-reader';
import {Ssc, Chart} from '../../shared/interfaces';
import {StepsType, NoteType, DifficultyType, STEPSCOLUMNS} from '../../shared/types';

describe('SscReader', () => {

  beforeEachProviders(() => [
    SscReader,
    ChartBuilder,
    ValueBuilder
  ]);

  it('should strip comments', inject([SscReader], (sscReader => {
    let input = '// -- This is a commnet! --\rcontent';
    let target = 'content';
    let output = sscReader.strip(input);
    expect(output).toEqual(target);
  })));

  it('should strip whitespace', inject([SscReader], (sscReader => {
    let input = 'This has\rlots\tof\nwhitespace!';
    let target = 'Thishaslotsofwhitespace!';
    let output = sscReader.strip(input);
    expect(output).toEqual(target);
  })));

  it('should split tags', inject([SscReader], (sscReader => {
    let input = '#ONE:one;#TWO:two;#THREE:three;';
    let target = [
      ['#ONE', 'one'],
      ['#TWO', 'two'],
      ['#THREE', 'three']
    ];
    let output = sscReader.split(input);
    expect(output).toEqual(target);
  })));

  it('should convert tags to attributes', inject([SscReader], (sscReader => {
    let input = [
      '#ONE', '#TWO', '#THREE'
    ];
    let target = [
      'one', 'two', 'three'
    ];
    let output = [];
    input.forEach((elem) => {
      output.push(sscReader.attributeFromTag(elem));
    });
    expect(output).toEqual(target);
  })));
});
