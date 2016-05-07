import {Ssc, Sm, SscChart, SmChart, StepsType,
        NoteType, STEPSCOLUMNS, DifficultyType}
        from '../../shared/index';
import {SongMetadata} from './song-metadata.class';
import {SongData} from './song-data.class';
import {SongChart} from './song-chart.class';

export class Song {
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

  public getMeta(): SongMetadata {
    return this.metadata;
  }

  public getData(): SongData {
    return this.data;
  }

  public getCharts(): Array<SongChart> {
    return this.charts;
  }

  public getOther(): Object {
    return this.other;
  }

  /**
   * Handles universally dynamic loads.
   * @param  {Object}    song The song, any object.
   */
  private _load(song: Object) {
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
    this.metadata = new SongMetadata(song);
  }

  /**
   * Loads all known tags for binary data from song into data.
   * @param  {Object}    song The song, any object.
   */
  private _loadData(song: Object) {
    this.data = new SongData(song);
  }

  /**
   * Loads the charts from notedata attribute into charts. Pads ungiven values in the chart with
   * fallbacks from the song if they were given there. This means Sm files have their chart data
   * copied to each chart object.
   * @param  {Object} song The song, any object.
   */
  private _loadCharts(song: Object) {
    song['notedata'].forEach((notedata) => {
      let chart = new SongChart(notedata);
      for (let key in chart) {
        if (chart[key] == null && (song[key] || song[key] === 0)) {
          chart[key] = song[key];
        }
      }
      this.charts.push(chart);
    });
  }

  /**
   * Load any unrecognised tags into other.
   * @param  {Object}    song The song, any object.
   */
  private _loadOther(song: Object) {
    for (let key in song) {
      if (key != 'notedata'
       && this.data[key] === undefined
       && this.metadata[key] === undefined) {
         this.other[key] = song[key];
       }
    }
  }
}
