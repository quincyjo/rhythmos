import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {Song} from '../../services/song-provider/song';
import {SongDetail} from '../song-detail/song-detail';
import {SongProvider} from '../../services/song-provider/song-provider';

@Component({
  selector: 'song-wheel',
  templateUrl: 'app/components/song-wheel/song-wheel.html',
  styleUrls: ['app/components/song-wheel/song-wheel.css'],
  providers: [SongProvider],
  directives: [SongDetail],
  pipes: []
})
export class SongWheel {
  public title = 'Songs';
  public songs: Song[];
  public selectedSong: Song;

  constructor(private _songProvider: SongProvider) {}

  getSongs() {
    this._songProvider.getSongs().then(songs => this.songs = songs);
  }

  ngOnInit() {
    this.getSongs();
  }

  onSelect(song: Song) {
    this.selectedSong = song;
  }
}
