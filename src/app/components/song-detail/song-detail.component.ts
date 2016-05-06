import {Component, Input} from '@angular/core';
import {SongProvider} from '../../services/index';
import {Song} from '../../shared/index';

@Component({
  selector: 'song-detail',
  templateUrl: 'app/components/song-detail/song-detail.component.html',
  styleUrls: ['app/components/song-detail/song-detail.component.css'],
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
