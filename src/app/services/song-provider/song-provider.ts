import {Injectable} from 'angular2/core';
import {Song} from '../../shared/interfaces/song';
import {SongModel} from '../../models/song-model';
import {SONGS} from './mock-songs';


@Injectable()
export class SongProvider {

  constructor(private _model: SongModel) {}

  getSongs() {
    return Promise.resolve(this._model.getSongs());
  }
}
