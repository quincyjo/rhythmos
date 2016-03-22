import {Injectable} from 'angular2/core';
import {Song} from '../../shared/interfaces/song';
import {SONGS} from './mock-songs';


@Injectable()
export class SongProvider {

  constructor() {}

  getSongs() {
    return Promise.resolve(SONGS);
  }
}
