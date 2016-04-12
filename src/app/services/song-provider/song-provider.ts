import {Injectable} from 'angular2/core';
import {Song} from '../../shared/interfaces/song';
import {SongsModel} from '../../models/songs-model';
import {SONGS} from './mock-songs';


@Injectable()
export class SongProvider {

  constructor(private _model: SongsModel) {}

  getSongs() {
    return Promise.resolve(this._model.getSongs());
  }
}
