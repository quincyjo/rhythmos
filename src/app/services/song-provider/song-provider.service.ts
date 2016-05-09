import {Injectable} from '@angular/core';
import {Song, SongChart} from '../../shared/classes/index';
import {SongsModel} from '../../models/index';


@Injectable()
export class SongProvider {

  constructor(private _model: SongsModel) {}

  public getSongs(): Promise<Array<Song>> {
    let promise = new Promise<Array<Song>>((resolve, reject) => {
      this._model.getSongs().then((songs) => {
        resolve(songs);
      });
    });
    return promise;
  }

  public getById(id: any): Promise<Song> {
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

  public getNotes(song: Song, chart: SongChart): Promise<any> {
    let promise = new Promise<SongChart>((resolve, reject) => {
      this._model.getNotes(song.id, chart.stepstype, chart.difficulty).then((notes) => {
        resolve(notes);
      }, (error) => {
        console.log('Provider faild to get chart notes from model: ', error);
      });
    });
    return promise;
  }
}
