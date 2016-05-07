export class SongMetadata {
  version: number = 0;
  format: string = '';
  title: string = '';
  subtitle: string = '';
  artist: string = '';
  titletranslit: string = '';
  subtitletranslit: string = '';
  artisttranslit: string = '';
  genre: string = '';
  origin: string = '';
  credit: string = '';
  cdtitle: string = '';
  samplestart: number = 0;
  samplelength: number = 0;
  selectable: boolean = false;
  displaybpm: string = '';

  constructor(song?: Object) {
    for (let key in this) {
      this[key] = song && song[key] || null;
    }
  }
}
