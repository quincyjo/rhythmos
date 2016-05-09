import {SongMetadata} from '../classes/song-metadata.class';
import {SongData} from '../classes/song-data.class';
import {SongChart} from '../classes/song-chart.class';

export interface Song{
  id: number;
  metadata: SongMetadata;
  data: SongData;
  charts: Array<SongChart>;
  other: {};
}
