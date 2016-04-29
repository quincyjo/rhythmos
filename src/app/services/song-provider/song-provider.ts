import {Injectable} from 'angular2/core';
import {Song} from '../../shared/interfaces/song';
import {SongsModel} from '../../models/songs-model';
import {SONGS} from './mock-songs';


@Injectable()
export class SongProvider {

  constructor(private _model: SongsModel) {}

  getSongs() {
    let promise = new Promise<any>((resolve, reject) => {
      this._model.getSongs().then((songs) => {resolve(songs);});
    })
    return promise;
  }

  public getById(id: any): Promise<any>{
    let promise = new Promise<any>((resolve, reject) => {
      this._model.getSongByKey(id).then((song) => {
        resolve(song);
      });
    });
    return promise;
  }
}
