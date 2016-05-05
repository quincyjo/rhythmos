import {Component, Input} from '@angular/core';
import {SongProvider} from '../../services/song-provider/song-provider';
import {Song} from '../../shared/interfaces/song';

@Component({
  selector: 'song-detail',
  templateUrl: 'app/components/song-detail/song-detail.html',
  styleUrls: ['app/components/song-detail/song-detail.css'],
  providers: [],
  directives: [],
  pipes: []
})

export class SongDetail {
  @Input() song: Song;

  constructor(private _songProvider: SongProvider) {}

  ngOnInit() {}

  public fetchBanner() {
    if (this.song.banner === true) {
      this._songProvider.getBanner(this.song).then((banner) => {
        this.song.banner = banner;
        let url = this.song.banner;
        return 'url("' + url + '") 50% 50% / cover no-repeat';
      });
    } else if (this.song.banner) {
      let url = this.song.banner;
      return 'url("' + url + '") 50% 50% / cover no-repeat';
    } else {
      return '#000';
    }
  }
}
