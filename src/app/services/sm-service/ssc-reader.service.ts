import {Injectable} from '@angular/core';
import {Ssc, SscChart} from '../../shared/index';
import {StepsType, NoteType, STEPSCOLUMNS, DifficultyType} from '../../shared/types/index';
import {VALUEBUILDER} from './utils';


let chartBuilder: ChartBuilder;


@Injectable()
export class SscReader {

  constructor() {
    chartBuilder = new ChartBuilder();
  }

  public readFromUrl(url: string): Promise<Ssc> {
    let promise = new Promise<Ssc>((resolve, reject) => {
      let ssc = {notedata: []};
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
          if (tag != 'notedata') {
            ssc[tag] = VALUEBUILDER.buildValue(tag, value);
          } else {
            ssc.notedata.push(chartBuilder.buildChart(split, i));
          }
        }
        resolve (<Ssc>ssc);
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

  public buildChart(tags: any, index: number): any {
    this.chart = {};
    let i = index + 1;
    while (tags[i] && tags[i][0] != 'notedata') {
      let tag = tags[i][0];
      let value = tags[i][1];
      if (tag == 'notes') {
        this.chart[tag] = this.parseNotes(value);
      } else {
        this.chart[tag] = VALUEBUILDER.buildValue(tag, value);
      }
      i++;
    }
    tags.splice(index, i - index - 1);
    return this.chart;
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
