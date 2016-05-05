import {Chart} from './';

export interface Ssc {
  version: number,
  title: string,
  subtitle: string,
  artist: string,
  titletranslit: string,
  subtitletranslit: string,
  artisttranslit: string,
  genre: string,
  origin: string,
  credit: string,
  banner: any,
  background: any,
  previewvid: any,
  jacket: any,
  cdimage: any,
  discimage: any,
  lyricspath: any,
  cdtitle: string,
  music: any,
  offset: number,
  samplestart: number,
  samplelength: number,
  selectable: boolean,
  displaybpm: number,
  bpms: Array<{measure: number, value: number}>,
  stops: Array<{measure: number, value: number}>,
  delays: Array<{measure: number, value: number}>,
  warps: Array<{measure: number, value: number}>,
  timesignatures: Array<{measure: number, numerator: number, denominator: number}>
  tickcounts: Array<{measure: number, value: number}>,
  combos: Array<{measure: number, value: number}>,
  speeds: Array<Object>,
  scrolls: Array<{measure: number, value: number}>,
  fakes: Array<{measure: number, value: number}>,
  labels: Object,
  bgchanges: any,
  keysounds: any,
  attacks: any,
  notedata: Array<Chart>
}
