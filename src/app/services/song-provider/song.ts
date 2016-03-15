export interface Song{
  id: number;
  title: string;
  subtitle: string;
  artist: string;
  genre: string;
  credit: string;
  banner: any;
  background: any;
  cdtitle: string;
  music: any;
  offset: number;
  bpms: [number];
  stops: [number];
  samplestart: number;
  samplelength: number;
  displaybpm: string;
  selectable: boolean;
  notes: any;
}
