import {Injectable} from 'angular2/core';
import {Ssc} from '../../shared/interfaces';
import {Chart} from '../../shared/interfaces';
import {StepsType, NoteType, STEPSCOLUMNS, DifficultyType} from '../../shared/types/index';


let chartBuilder: ChartBuilder;
let valueBuilder: ValueBuilder;


@Injectable()
export class SscReader {

  constructor() {}

  public readFromUrl(url: string): Ssc {
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
          ssc[elem[0]] = valueBuilder.buildValue(tag, value);
        } else {
          ssc.notedata.push(chartBuilder.buildChart(split, i));
        }
      }
    });
    return <Ssc>ssc;
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
    // Strip whitespace
    return nocomments.replace(/[\r\n\t\s]/g, '');
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
        this.chart[tag] = valueBuilder.buildValue(tag, value);
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


export class ValueBuilder {

  constructor() {}

  public buildValue(tag: string, value: string) {
    // Get method from tag map.
    let func = this.tagMap[tag];
    if (func == null) { // Target value is a string, string trailing whitespace and return.
      return value.replace(/^\s+|\s+$/g, '');
    } else if (func === false) { // Unexpected tag.
      console.log("Error: Got unexpected tag: " + tag);
      return false;
    } else if (func == undefined) { // Unknown tag, try and pasrse it.
      func = this.tagMap.default;
    }
    return func(value);
  }

  public parseNumber(value: string): number {
    return parseFloat(value);
  }

  public parseBoolean(value: string): boolean {
    if (value.toLowerCase() == 'no') {
      return false;
    } else if (value.toLowerCase() == 'yes') {
      return true;
    }
    return false;
  }

  public parseMeasureValueArray(value: string): Array<{measure: number, value: number}> {
    let a: Array<{measure: number, value: number}> = [];
    if (value == '') return a;
    value.split(',').map((elem) => {
      let values = elem.split('=');
      a.push({
        measure: parseFloat(values[0]),
        value: parseFloat(values[1])
      });
    });
    return a;
  }

  public parseLabelValueArray(value: string): Object {
    let map = {};
    if (value == '') return map;
    value.split(',').map((elem) => {
      let values = elem.split('=');
      let measure = parseFloat(values[0]);
      let name = values[1];
      let key = name.replace(/\s/g, '').toLowerCase();
      let entry = {
        name: name,
        measure: measure
      };
      map[key] = entry;
    });
    return map;
  }

  public parseMeasureFractionArray(value: string): Array<{measure: number,
                                                          numerator: number,
                                                          denominator: number}> {
    let a: Array<{measure: number, numerator: number, denominator: number}> = [];
    if (value == '') return a;
    value.split(',').map((elem) => {
      let values = elem.split('=');
      let measure = parseFloat(values[0]);
      let numerator = parseFloat(values[1]);
      let denominator = parseFloat(values[2]);
      a.push({
        measure: measure,
        numerator: numerator,
        denominator: denominator
      });
    });
    return a;
  }

  public praseNumberArray(value: string): Array<number> {
    let a: Array<number> = [];
    value.split(',').map((elem) => {
      a.push(parseFloat(elem));
    });
    return a;
  }

  public parseTwoDimNumberArray(value: string): Array<Array<number>> {
    let a: Array<Array<number>> = [];
    value.split(',').map((row) => {
      let b: Array<number> = [];
      row.split('=').map((column) => {
        b.push(parseFloat(column));
      });
      a.push(b);
    });
    return a;
  }

  public parseStepType(value: string): StepsType {
    return <StepsType>value.replace(/^\s+|\s+$/g, '');
  }

  public parseDifficultyType(value: string): DifficultyType {
    return <DifficultyType>value.replace(/^\s+|\s+$/g, '');
  }

  public parseDefault() {
    return false;
  }

  // List of all official tags, with appropriate method.
  // Null means desired target value is a string, so do nothing.
  // False means that the value builder should not have been pased that tag.
  public tagMap = {
    version: null,
    title: null,
    subtitle: null,
    artist: null,
    titletranslit: null,
    subtitletranslit: null,
    artisttranslit: null,
    genre: null,
    origin: null,
    credit: null,
    banner: null,
    background: null,
    previewvid: null,
    jacket: null,
    cdimage: null,
    discimage: null,
    lyricspath: null,
    cdtitle: null,
    music: null,
    offset: this.parseNumber,
    samplestart: this.parseNumber,
    samplelength: this.parseNumber,
    selectable: this.parseBoolean,
    displaybpm: this.parseNumber,
    bpms: this.parseMeasureValueArray,
    stops: this.parseMeasureValueArray,
    delays: this.parseMeasureValueArray,
    warps: this.parseMeasureValueArray,
    timesignatures: this.parseMeasureFractionArray,
    tickcounts: this.parseMeasureValueArray,
    combos: this.parseMeasureValueArray,
    speeds: this.parseTwoDimNumberArray,
    scrolls: this.parseMeasureValueArray,
    fakes: this.parseMeasureValueArray,
    labels: this.parseLabelValueArray,
    bgchanges: null,
    keysounds: null,
    attacks: null,
    chartname: null,
    steptype: this.parseStepType,
    description: null,
    difficulty: this.parseDifficultyType,
    chartstyle: null,
    meter: this.parseNumber,
    radarvalues: this.parseNumber,
    notedata: false,
    notes: false,
    default: this.parseDefault
  };
}
