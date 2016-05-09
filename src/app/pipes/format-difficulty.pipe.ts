import {Pipe, PipeTransform} from '@angular/core';
import {DifficultyType, DIFFICULTYVALUES} from '../shared/types/index';

@Pipe({
  name: 'formatDifficulty'
})
export class FormatDifficultyPipe implements PipeTransform {
  transform(value: DifficultyType): string {
    if (typeof value != 'string'
     || DIFFICULTYVALUES[value] === undefined) {
      throw("FormatDifficultyPipe requires a difficulty string as input");
    } else {
      return formatMap[value] || value.substr(0,2);
    }
  }
}

let formatMap = {
  'Beginner': 'bg',
  'Easy': 'es',
  'Medium': 'md',
  'Hard': 'hd',
  'Challenge': 'in',
  'Edit': 'ed'
}
