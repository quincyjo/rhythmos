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

import {SscReader} from './ssc-reader.service';
import {Ssc, SscChart} from '../../shared/interfaces';
import {StepsType, NoteType, DifficultyType, STEPSCOLUMNS} from '../../shared/types';

describe('SscReader', () => {

  beforeEachProviders(() => [
    SscReader
  ]);

  it('should...', inject([SscReader], (sscReader => {
  })));
});
