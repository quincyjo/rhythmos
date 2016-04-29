import {Injectable} from 'angular2/core';
import {Song} from '../shared/interfaces/song';
import {DatabaseService} from '../services/database-service/database-service';
import {SONGS} from './mock-songs';

@Injectable()
export class SongsModel {
  private _songs: Array<Song>;

  constructor(private _database: DatabaseService) {}

  private _fetchSongs(): Promise<any>{
    let promise = new Promise<any>((resolve, reject) => {
      this._database.getAll('songs').then(
        (songs) => {
          this._songs = songs;
          resolve();
        }, (error) => {
          this._init().then(() => {
            this._fetchSongs().then(() => {
              resolve();
            });
          });
        }
      );
    });
    return promise;
  }

  private _init(): Promise<any>{
    let promise = new Promise<any>((resolve, reject) => {
      let fill: boolean = false;
      this._database.createStore(1, (event) => { // Create objectStore
        let objectStore = event.currentTarget.result.createObjectStore(
          'songs', {keyPath: 'id', autoIncrement: true});
        objectStore.createIndex("title", "title", {unique: false});
        objectStore.createIndex("subtitle", "subtitle", {unique: false});
        objectStore.createIndex("artist", "artist", {unique: false});
        objectStore.createIndex("genre", "genre", {unique: false});
        objectStore.createIndex("credit", "credit", {unique: false});
        objectStore.createIndex("banner", "banner", {unique: false});
        objectStore.createIndex("background", "background", {unique: false});
        objectStore.createIndex("cdtitle", "cdtitle", {unique: false});
        objectStore.createIndex("music", "music", {unique: false});
        objectStore.createIndex("offset", "offset", {unique: false});
        objectStore.createIndex("bpms", "bpms", {unique: false});
        objectStore.createIndex("stops", "stops", {unique: false});
        objectStore.createIndex("samplestart", "samplestart", {unique: false});
        objectStore.createIndex("samplelength", "samplelength", {unique: false});
        objectStore.createIndex("displaybpm", "displaybpm", {unique: false});
        objectStore.createIndex("selectable", "selectable", {unique: false});
        objectStore.createIndex("notes", "notes", {unique: false});
        fill = true;
      }).then( () => { // Resolve
        if (fill) { // If initiated, fill with moch data
          this._fillMockData().then(() => {
            resolve();
          });
        } else {
          resolve();
        }
      },
      (error) => {
        reject(error);
      });
    });
    return promise;
  }

  private _fillMockData(): Promise<any>{
    let promise = new Promise<any>((resolve, reject) => {
      let promises: Promise<any>[] = [];
      for (let song of SONGS) {
        promises.push(this._fetchBinaries(song));
      }
      Promise.all(promises).then((songs) => {
        let promises: Promise<any>[] = [];
        for (let song of songs) {
          promises.push(this._database.add('songs', song));
        }
        Promise.all(promises).then(() => {
          resolve();
        });
      });
    });
    return promise;
  }

  private _fetchBinaries(song: any): Promise<any>{
    let promise = new Promise<any>((resolve, reject) => {
      let promises: Promise<any>[] = [];
      if(song.banner){
        promises.push(this.getBase64FromImageUrl(song.banner));
      }
      if(song.background){
        promises.push(this.getBase64FromImageUrl(song.background));
      }
      Promise.all(promises).then((values) => {
        song.banner = values[0];
        song.background = values[1];
        resolve(song);
      });
    });
    return promise;
  }

  public getBase64FromImageUrl(url: string) {
    let promise = new Promise<any>((resolve, reject) => {
      let img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = () => {
        let canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        let dataURL = canvas.toDataURL("image/png");
        //dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        resolve(dataURL);
      };
      img.src = url;
    });
    return promise;
  }

  public getSongs(): Promise<any>{
    let promise = new Promise<any>((resolve, reject) => {
      this._fetchSongs().then(() => {
        console.log(this._songs);
        resolve(this._songs);
      });
    });
    return promise;
  }

  public getSongByKey(key: any): Promise<any>{
    let promise = new Promise<any>((resolve, reject) => {
      this._database.getByKey('songs', key).then((song) => {
        resolve(song);
      }, (error) => {
        this._init().then(() => {
          this.getSongByKey(key).then((song) => {
            resolve(song);
          });
        });
      });
    })
    return promise;
  }
}
