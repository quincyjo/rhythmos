import {Injectable} from '@angular/core';
import {Ssc, SscChart} from '../../shared/index';
import {StepsType, NoteType, STEPSCOLUMNS, DifficultyType} from '../../shared/types/index';
import {SMUTILS} from './utils';


let chartBuilder: ChartBuilder;
let factory: SscFactory;


@Injectable()
export class SscReader {

  constructor() {
    chartBuilder = new ChartBuilder();
    factory = new SscFactory();
  }

  public readFromUrl(url: string): Promise<Ssc> {
    let promise = new Promise<Ssc>((resolve, reject) => {
      let ssc = factory.makeSsc();
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
          if (tag != 'notedata') {
            ssc[tag] = SMUTILS.parseValue(tag, value);
          } else {
            ssc.notedata.push(chartBuilder.buildChart(split, i));
          }
        }
        resolve (ssc);
      });
    });
    return promise;
  }
}


export class SscFactory {

  constructor() {}

  public makeSsc(): Ssc {
    return {
      format:'ssc',version:0,title:'',subtitle:'',artist:'',titletranslit:'',subtitletranslit:'',
      artisttranslit:'',genre:'',origin:'',credit:'',banner:'',background:'',previewvid:'',
      jacket:'',cdimage:'',discimage:'',lyricspath:'',cdtitle:'',music:'',offset:0,
      samplestart:0,samplelength:0,selectable:true,displaybpm:'',bpms:[],stops:[],
      delays:[],warps:[],timesignatures:[],tickcounts:[],combos:[],speeds:[],scrolls:[],
      fakes:[],labels:{},bgchanges:null,keysounds:null,attacks:null,notedata:[]};
  }

  public makeChart(): SscChart {
    return {
      chartname:'',stepstype:'dance-single',description:'',chartstyle:'',difficulty:'Beginner',
      meter:0,radarvalues:[],credit:'',offset:0,bpms:[],stops:[],delays:[],warps:[],
      timesignatures:[],tickcounts:[],combos:[],speeds:[],scrolls:[],fakes:{},labels:{},
      displaybpm:'',notes:[]};
  }
}


export class ChartBuilder {
  public chart: SscChart;

  constructor() {}

  public buildChart(tags: Array<Array<string>>, index: number): SscChart {
    this.chart = factory.makeChart();
    let i = index + 1;
    while (tags[i] && tags[i][0] != 'notedata') {
      let tag = tags[i][0];
      let value = tags[i][1];
      if (tag == 'notes') {
        this.chart[tag] = this.parseNotes(value);
      } else {
        this.chart[tag] = SMUTILS.parseValue(tag, value);
      }
      i++;
    }
    tags.splice(index, i - index - 1);
    return this.chart;
  }

  public parseNotes(value: string): Array<Array<Array<NoteType>>> {
    let notes: Array<Array<Array<NoteType>>> = [];
    let stepsType: StepsType = this.chart.stepstype;
    let rowLength = STEPSCOLUMNS[stepsType];

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
