import {SmChart} from './';

export interface Sm {
  format: string,
  title: string,
  subtitle: string,
  artist: string,
  titletranslit: string,
  subtitletranslit: string,
  artisttranslit: string,
  genre: string,
  credit: string,
  banner: any,
  background: any,
  lyricspath: any,
  cdtitle: string,
  music: any,
  offset: number,
  samplestart: number,
  samplelength: number,
  selectable: boolean,
  bpms: Array<{beat: number, value: number}>,
  stops: Array<{beat: number, value: number}>,
  bgchanges: any,
  attacks: any,
  notedata: Array<SmChart>
}
