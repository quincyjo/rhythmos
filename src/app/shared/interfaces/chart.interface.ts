import {StepsType, DifficultyType, NoteType} from '../types/index';

export interface SscChart {
  chartname: string,
  stepstype: StepsType,
  description: string,
  chartstyle: string,
  difficulty: DifficultyType,
  meter: number,
  radarvalues: Array<number>,
  credit: string,
  offset: number,
  bpms: Array<{beat: number, bpm: number}>,
  stops: Array<Object>,
  delays: Array<Object>,
  warps: Array<Object>,
  timesignatures: Array<{beat: number, beats: number, note: number}>
  tickcounts: Array<{beat: number, value: number}>,
  combos: Array<{beat: number, value: number}>,
  speeds: Array<Object>,
  scrolls: Array<{beat: number, value: number}>,
  fakes: Object,
  labels: Object,
  displaybpm: string,
  notes: Array<Array<Array<NoteType>>>
}

export interface SmChart {
  stepstype: StepsType,
  description: string,
  difficulty: DifficultyType,
  meter: number,
  radarvalues: Array<number>,
  notes: Array<Array<Array<NoteType>>>
}
