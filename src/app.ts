import {bootstrap} from 'angular2/platform/browser';
import {RhythmosApp} from './app/rhythmos';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {SongModel} from './app/models/song-model';

bootstrap(RhythmosApp, [
  ROUTER_PROVIDERS,
  SongModel
]);
