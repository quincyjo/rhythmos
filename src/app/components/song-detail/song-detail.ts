import {Component} from 'angular2/core';
import {Song} from '../../services/song-provider/song';

@Component({
  selector: 'song-detail',
  inputs: ['song'],
  templateUrl: 'app/components/song-detail/song-detail.html',
  styleUrls: ['app/components/song-detail/song-detail.css'],
  providers: [],
  directives: [],
  pipes: []
})

export class SongDetail {
  public song: Song;

  constructor() {}

}
