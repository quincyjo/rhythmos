import {Component, Input} from '@angular/core';
import {SongProvider} from '../../services/index';
import {Song} from '../../shared/classes/index';
import {SortChartsPipe} from '../../pipes/index';

@Component({
  selector: 'song-detail',
  templateUrl: 'app/components/song-detail/song-detail.component.html',
  styleUrls: ['app/components/song-detail/song-detail.component.css'],
  providers: [],
  directives: [],
  pipes: [SortChartsPipe]
})

export class SongDetail {
  @Input() song: Song;

  constructor(private _songProvider: SongProvider) {}

  ngOnInit() {}

  public fetchBanner() {
    if (this.song.getData().banner === true) {
      this._songProvider.getBanner(this.song).then((banner) => {
        let url = banner;
        return 'url("' + url + '") 50% 50% / cover no-repeat';
      });
    } else if (this.song.getData().banner) {
      let url = this.song.getData().banner;
      return 'url("' + url + '") 50% 50% / cover no-repeat';
    } else {
      return '#000';
    }
  }
}
