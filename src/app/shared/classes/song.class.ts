import {Ssc, Sm, SscChart, SmChart, StepsType,
        NoteType, STEPSCOLUMNS, DifficultyType}
        from '../../shared/index';
import {SongMetadata} from './song-metadata.class';
import {SongData} from './song-data.class';
import {SongChart} from './song-chart.class';

export class Song {
  public id: number;
  private metadata: SongMetadata;
  private data: SongData;
  private charts: Array<SongChart>;
  private other: {};

  constructor(song?: Object) {
    this.charts = [];
    this.other = {};
    if (song) {
      this._load(song);
    }
  }

  public getMeta(key?: string) {
    return key ? this.metadata[key] : this.metadata;
  }

  public getData(key?: string) {
    return key ? this.data[key] : this.data;
  }

  public getCharts(key?: string) {
    return key ? this.charts[key] : this.charts;
  }

  public getOther(key? : string) {
    return key ? this.other[key] : this.other;
  }

  /**
   * Handles universally dynamic loads.
   * @param  {Object}    song The song, any object.
   */
  private _load(song: Object) {
    if (song['id']) {
      this.id = song['id'];
    }
    this._loadMetadata(song);
    this._loadData(song);
    this._loadCharts(song);
    this._loadOther(song);
  }

  /**
   * Loads all matching attributes from song into metadata.
   * @param  {Object}    song The song, any object.
   */
  private _loadMetadata(song: Object) {
    if (song['metadata']) {
      this.metadata = new SongMetadata(song['metadata']);
    } else {
      this.metadata = new SongMetadata(song);
    }
  }

  /**
   * Loads all known tags for binary data from song into data.
   * @param  {Object}    song The song, any object.
   */
  private _loadData(song: Object) {
    if (song['data']) {
      this.data = new SongData(song['data']);
    } else {
      this.data = new SongData(song);
    }
  }

  /**
   * Loads the charts from notedata attribute into charts. Pads ungiven values in the chart with
   * fallbacks from the song if they were given there. This means Sm files have their chart data
   * copied to each chart object.
   * @param  {Object} song The song, any object.
   */
  private _loadCharts(song: Object) {
    if (song['charts']) {
      song['charts'].forEach((chart) => {
        this.charts.push(new SongChart(chart));
      });
    } else {
      song['notedata'].forEach((chart) => {
        let paddedChart = new SongChart(chart);
        for (let key in paddedChart) {
          if (paddedChart[key] == null && (song[key] || song[key] === 0)) {
            paddedChart[key] = song[key];
          }
        }
        this.charts.push(paddedChart);
      });
    }
  }

  /**
   * Load any unrecognised tags into other.
   * @param  {Object}    song The song, any object.
   */
  private _loadOther(song: Object) {
    if (song['other']) {
      this.other = song['other'];
    } else {
      for (let key in song) {
        if (key != 'notedata'
         && this.data[key] === undefined
         && this.metadata[key] === undefined) {
           this.other[key] = song[key];
         }
      }
    }
  }
}
