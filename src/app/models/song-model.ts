import {Injectable} from 'angular2/core';
import {Song} from '../shared/interfaces/song';
import {SONGS} from '../services/song-provider/mock-songs';

@Injectable()
export class SongModel {
  private _songs: Array<Song>;

  constructor() {
    this._fetchSongs();
  }

  private _fetchSongs() {
    this._songs = SONGS;
  }

  public getSongs(){
    return this._songs;
  }
}
