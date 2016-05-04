import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({name: 'sortBy'})
export class SortObjectsByPipe implements PipeTransform {
  transform(value, attribute): Array<any> {
    if (!value) return value;
    return value.sort((a, b) => {
      if (a[attribute] < b[attribute]) {
        return -1;
      } else if (a[attribute] > b[attribute]) {
        return 1;
      } else {
        return 0;
      }
    });
  }
}
