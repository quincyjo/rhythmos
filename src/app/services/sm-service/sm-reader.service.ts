import {Injectable} from '@angular/core';
import {Sm, SmChart} from '../../shared/index';
import {StepsType, NoteType, STEPSCOLUMNS, DifficultyType} from '../../shared/types/index';
import {SMUTILS} from './utils';


let chartBuilder: ChartBuilder;
let factory: SmFactory


@Injectable()
export class SmReader {

  constructor() {
    chartBuilder = new ChartBuilder();
    factory = new SmFactory();
  }

  public readFromUrl(url: string): Promise<Sm> {
    let promise = new Promise<Sm>((resolve, reject) => {
      let sm: Sm = factory.makeSm();
      SMUTILS.getTextFromUrl(url).then((value) => {
        let text = SMUTILS.stripFile(value);
        let split = SMUTILS.splitTags(text);
        split.map((elem) => {
          elem[0] = SMUTILS.attributeFromTag(elem[0]);
        })
        for (let i = 0; i < split.length; i++) {
          let elem = split[i];
          let tag = elem[0];
          let value = elem[1];
          if (tag != 'notes') {
            sm[tag] = SMUTILS.parseValue(tag, value);
          } else {
            sm.notedata.push(chartBuilder.buildChart(elem));
          }
        }
        resolve (sm);
      }, (error) => {
        console.log(error);
      });
    });
    return promise;
  }
}


class SmFactory {

  constructor() {}

  public makeSm(): Sm {
    return {
      format:'sm',title:'',subtitle:'',artist:'',titletranslit:'',subtitletranslit:'',artisttranslit:'',
      genre:'',credit:'',banner:'',background:'',lyricspath:'',cdtitle:'',music:'',offset:0,
      samplestart:0,samplelength:0,selectable:true,bpms:[],stops:[],bgchanges:'',attacks:'',
      notedata:[]}
  }

  public makeChart(): SmChart {
    return {
      stepstype:'dance-single',description:'',difficulty:'Beginner',meter:0,radarvalues:[],notes:[]}
  }
}


class ChartBuilder {
  public chart: SmChart;

  constructor() {}

  public buildChart(elem: Array<string>): SmChart {
    this.chart = factory.makeChart();
    this.chart['stepstype'] = SMUTILS.parseValue('stepstype', elem[1]);
    this.chart['discription'] = elem[2];
    this.chart['difficulty'] = SMUTILS.parseValue('difficulty', elem[3]);
    this.chart['meter'] = parseFloat(elem[4]);
    this.chart['radarvalues'] = SMUTILS.parseValue('radarvalues', elem[5]);
    this.chart['notes'] = this.parseNotes(elem[6]);
    return this.chart;
  }

  public parseNotes(value: string): Array<Array<Array<NoteType>>> {
    let notes: Array<Array<Array<NoteType>>> = [];
    let stepType: StepsType = this.chart.stepstype;
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
