import {Pipe, PipeTransform} from '@angular/core';
import {SongChart} from '../shared/classes/index';
import {StepsType} from '../shared/types/index';

@Pipe({name: 'filterCharts'})
export class FilterChartsPipe implements PipeTransform {
  transform(value: Array<SongChart>, type: string): Array<SongChart> {
    if (!Array.isArray(value) || value.length > 0 && typeof value[0] != 'object') {
      throw 'sortCharts requires an array of SongCharts objects as input';
    }
    return value.filter((chart) => {
      let start = 0;
      let end = chart.stepstype.indexOf('-');
      return (chart.stepstype.substr(start, end) === type);
    });
  }
}
