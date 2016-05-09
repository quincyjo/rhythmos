import {Pipe, PipeTransform} from '@angular/core';
import {SongChart} from '../shared/classes/index';
import {DifficultyType, DIFFICULTYVALUES, DIFFICULTYLITERALS, StepsType} from '../shared/types/index';

@Pipe({name: 'sortCharts'})
export class SortChartsPipe implements PipeTransform {
  transform(value: Array<SongChart>): Array<SongChart> {
    if (!Array.isArray(value) || value.length > 0 && typeof value[0] != 'object') {
      throw 'sortCharts requires an array of SongCharts objects as input';
    }
    return value.sort((a, b) => {
      if (a.stepstype === b.stepstype) {
        return this.compareDifficulties(a, b);
      } else {
        return this.compareStepstype(a, b);
      }
    });
  }

  compareStepstype(a, b) {
    let av = stepValues[a.stepstype] || 99;
    let bv = stepValues[b.stepstype] || 99;
    return av - bv;
  }

  compareDifficulties(a, b) {
    let av = DIFFICULTYVALUES[a.difficulty] + 1 || DIFFICULTYLITERALS.length;
    let bv = DIFFICULTYVALUES[b.difficulty] + 1 || DIFFICULTYLITERALS.length;
    return av - bv;
  }
}

let stepValues = {
  'dance-single': 1,
  'dance-solo': 2,
  'dance-double': 3,
  'dance-couple': 4,
  'pump-single': 5,
  'pump-halfdouble': 6,
  'pump-double': 7,
  'pump-couple': 8,
  'ez2-single': 9,
  'ez2-double': 10,
  'ez2-real': 11,
  'para-single': 12,
  'dance-threepanel': 13
}
