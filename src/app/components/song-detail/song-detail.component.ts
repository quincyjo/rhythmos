import {Component, Input, Output, EventEmitter} from '@angular/core';
import {SongProvider} from '../../services/index';
import {Song, SongChart} from '../../shared/classes/index';
import {StepsType, DifficultyType} from '../../shared/types/index';
import {FilterChartsPipe, SortChartsPipe, FormatDifficultyPipe, FormatStepstypePipe} from '../../pipes/index';

@Component({
  selector: 'song-detail',
  templateUrl: 'app/components/song-detail/song-detail.component.html',
  styleUrls: ['app/components/song-detail/song-detail.component.css'],
  providers: [],
  directives: [],
  pipes: [FilterChartsPipe, SortChartsPipe, FormatDifficultyPipe, FormatStepstypePipe]
})

export class SongDetail {
  @Input() song: Song;
  @Input() preferedChart: {
    stepstype: StepsType,
    difficulty: DifficultyType
  };
  @Output() selectChart = new EventEmitter();

  public selected: SongChart;

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

  public select(chart: SongChart) {
    this.selectChart.emit(chart);
  }

  public isSelected(chart: SongChart): boolean {
    return (
      chart.stepstype === this.preferedChart.stepstype &&
      chart.difficulty === this.preferedChart.difficulty
    );
  }
}
