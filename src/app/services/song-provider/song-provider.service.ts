import {Injectable} from '@angular/core';
import {Song} from '../../shared/index';
import {SongsModel} from '../../models/index';


@Injectable()
export class SongProvider {

  constructor(private _model: SongsModel) {}

  public getSongs() {
    let promise = new Promise<any>((resolve, reject) => {
      this._model.getSongs().then((songs) => {
        resolve(songs);
      });
    });
    return promise;
  }

  public getById(id: any): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      this._model.getSongByKey(id).then((song) => {
        resolve(song);
      });
    });
    return promise;
  }

  public getBanner(song: Song): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      this._model.getObjectUrl(song.id, 'banner').then(
      (banner) => {
        resolve(banner);
      }, (error) => {
        console.log(error);
      });
    });
    return promise;
  }

  public getBackground(song: Song): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      this._model.getObjectUrl(song.id, 'background').then(
      (background) => {
        resolve(background);
      }, (error) => {
        console.log(error);
      });
    });
    return promise;
  }

  public getMusic(song: Song): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      this._model.getObjectUrl(song.id, 'music').then(
      (music) => {
        resolve(music);
      }, (error) => {
        console.log(error);
      });
    });
    return promise;
  }
}
