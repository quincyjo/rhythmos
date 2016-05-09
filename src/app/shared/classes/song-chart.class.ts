import {StepsType, DifficultyType, NoteType} from '../types/index';

type NoteReference = Array<Array<Array<NoteType>>> | boolean;

export class SongChart {
  chartname: string = '';
  stepstype: StepsType = 'dance-single';
  description: string = '';
  chartstyle: string = '';
  difficulty: DifficultyType = 'Beginner';
  meter: number = 0;
  radarvalues: Array<number> = [];
  credit: string = '';
  offset: number = 0;
  bpms: Array<{beat: number, value: number}> = [];
  stops: Array<Object> = [];
  delays: Array<Object> = [];
  warps: Array<Object> = [];
  timesignatures: Array<{beat: number, beats: number, note: number}> = [];
  tickcounts: Array<{beat: number, value: number}> = [];
  combos: Array<{beat: number, value: number}> = [];
  speeds: Array<Object> = [];
  scrolls: Array<{beat: number, value: number}> = [];
  fakes: Object = {};
  labels: Object = {};
  displaybpm: string = '';
  notes: NoteReference = [];

  constructor(song?: Object) {
    for (let key in this) {
      this[key] = song && this.reduce(song[key]) || null;
    }
  }

  reduce(value: any) {
    if(!value || (Array.isArray(value) && !value.length)) {
      return false
    }
    return value;
  }
}
