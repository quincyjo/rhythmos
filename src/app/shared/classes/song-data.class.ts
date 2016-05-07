import {BlobReference} from '../../shared';

export class SongData {
  banner: BlobReference = false;
  background: BlobReference = false;
  previewvid: BlobReference = false;
  jacket: BlobReference = false;
  cdimage: BlobReference = false;
  discimage: BlobReference = false;
  lyricspath: BlobReference = false;
  music: BlobReference = false;

  constructor(song?: Object) {
    for (let key in this) {
      this[key] = song && song[key] || false;
    }
  }
}
