import {Injectable} from 'angular2/core';
import {Song} from '../shared/interfaces/song';
import {DatabaseService} from '../services/database-service/database-service';
import {SONGS} from './mock-songs';

@Injectable()
export class SongsModel {
  private _songs: Array<Song>;

  constructor(private _database: DatabaseService) {}

  private _checkStore(){
    let promise = new Promise<any>((resolve, reject) => {
      this._database.getAll('songs').then(
        (songs) => {
          this._songs = songs;
          resolve();
        },
        (error) => {
          this._init().then(() => {
            this._checkStore().then( () => {
              resolve();
            });
          });
        }
      );
    });
    return promise;
  }

  private _init(){
    let promise = new Promise<any>((resolve, reject) => {
      this._database.createStore(1, (event) => {
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
      }).then( () => {
        for (let song of SONGS) {
          this._database.add('songs', song).then( () => {
          }, (error) => {
            console.log(error);
          });
        }
        resolve();
      });
    });
    return promise;
  }

  private _fetchSongs() {
    let promise = new Promise<any>((resolve, reject) => {
      this._init().then(() => {
        this._database.getAll('songs').then((songs) => {
          this._songs = songs;
          console.log(this._songs);
          resolve();
        }, (error) => {
          console.log(error);
          reject(error);
        });
      });
    });
    return promise;
  }

  public getSongs(){
    let promise = new Promise<any>((resolve, reject) => {
      this._checkStore().then(() => {
        resolve(this._songs);
      });
    });
    return promise;
  }
}
