import {Injectable} from '@angular/core';
import {Sm, SmChart} from '../../shared/index';
import {StepsType, NoteType, STEPSCOLUMNS, DifficultyType} from '../../shared/types/index';
import {VALUEBUILDER} from './utils';


let chartBuilder: ChartBuilder;


@Injectable()
export class SmReader {

  constructor() {
    chartBuilder = new ChartBuilder();
  }

  public readFromUrl(url: string): Promise<Sm> {
    let promise = new Promise<Sm>((resolve, reject) => {
      let sm: {notedata: Array<SmChart>} = {notedata: []};
      this.getTextFromUrl(url).then((value) => {
        let text = this.strip(value);
        let split = this.split(text);
        split.map((elem) => {
          elem[0] = this.attributeFromTag(elem[0]);
        })
        for (let i = 0; i < split.length; i++) {
          let elem = split[i];
          let tag = elem[0];
          let value = elem[1];
          if (tag != 'notes') {
            sm[tag] = VALUEBUILDER.buildValue(tag, value);
          } else {
            sm.notedata.push(chartBuilder.buildChart(elem));
          }
        }
        resolve (<Sm>sm);
      }, (error) => {
        console.log(error);
      });
    });
    return promise;
  }

  public getTextFromUrl(url: string): Promise<string> {
    let promise = new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest(),
          text: string;
      xhr.open('GET', url, true);
      xhr.responseType = 'text';
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          text = xhr.response;
          resolve(text);
        } else {
          reject('XMLHttpRequest filed with code: ' + xhr.status);
        }
      }, false);
      xhr.send();
    });
    return promise;
  }

  public strip(str: string): string {
    // Strip comments
    let nocomments = str.replace(/(\/\/.*[\r\n])/g, '');
    // Strip trailing and leading whitespace
    let notrails = nocomments.replace(/(^\s+)|(\s+$)/g, '')
    // Strip line breaks and non-space whitespace
    return notrails.replace(/([\r\n\t])/g, '');
  }

  public split(str: string): Array<Array<string>> {
    let split = str.split(';').map((elem) => {
      return elem.split(':');
    });
    split.splice(split.length - 1, 1);
    return split;
  }

  public attributeFromTag(tag: string): string {
    return tag.substr(1).toLowerCase();
  }
}


export class ChartBuilder {
  public chart: Object;

  constructor() {}

  public buildChart(elem: Array<string>): SmChart {
    this.chart = {};
    this.chart['stepstype'] = VALUEBUILDER.buildValue('stepstype', elem[1]);
    this.chart['discription'] = elem[2];
    this.chart['difficulty'] = VALUEBUILDER.buildValue('difficulty', elem[3]);
    this.chart['meter'] = parseFloat(elem[4]);
    this.chart['radarvalues'] = VALUEBUILDER.buildValue('radarvalues', elem[5]);
    this.chart['notes'] = this.parseNotes(elem[6]);
    return <SmChart>this.chart;
  }

  public parseNotes(value: string): Array<Array<Array<NoteType>>> {
    let notes: Array<Array<Array<NoteType>>> = [];
    let stepType: StepsType = this.chart['stepstype'];
    let rowLength = STEPSCOLUMNS[stepType];

    value.split(',').map((measure) => {
      let mes: Array<Array<NoteType>> = [];
      measure.match(
        new RegExp('.{' + rowLength + ',' + rowLength + '}', 'g')
      ).map((row) => {
        let beat: Array<NoteType> = [];
        beat = <Array<NoteType>>row.split('');
        mes.push(beat);
      });
      notes.push(mes);
    })
    return notes;
  }
}
