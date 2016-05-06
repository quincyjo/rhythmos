import {StepsType, DifficultyType, NoteType} from '../types/index';

export interface Chart {
  chartname: string,
  stepstype: StepsType,
  description: string,
  chartstyle: string,
  difficulty: DifficultyType,
  meter: number,
  radarvalues: Array<number>,
  credit: string,
  offset: number,
  bpms: Array<{measure: number, bpm: number}>,
  stops: Array<Object>,
  delays: Array<Object>,
  warps: Array<Object>,
  timesignatures: Array<{measure: number, beats: number, note: number}>
  tickcounts: Array<{measure: number, value: number}>,
  combos: Array<{measure: number, value: number}>,
  speeds: Array<Object>,
  scrolls: Array<{measure: number, value: number}>,
  fakes: Object,
  labels: Object,
  displaybpm: number,
  notes: Array<Array<Array<NoteType>>>
}
