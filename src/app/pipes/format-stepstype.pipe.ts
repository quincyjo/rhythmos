import {Pipe, PipeTransform} from '@angular/core';
import {StepsType, STEPSCOLUMNS} from '../shared/types/index';

@Pipe({
  name: 'formatStepstype'
})
export class FormatStepstypePipe implements PipeTransform {
  transform(value: StepsType): string {
    if (typeof value != 'string'
     || STEPSCOLUMNS[value] === undefined) {
      throw("FormatDifficultyPipe requires a difficulty string as input");
    } else {
      let parts = value.split('-');
      let formatted = parts[1];
      return formatted;
    }
  }
}
