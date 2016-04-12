import {bootstrap} from 'angular2/platform/browser';
import {RhythmosApp} from './app/rhythmos';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {SongsModel} from './app/models/songs-model';
import {OptionsModel} from './app/models/options-model';

bootstrap(RhythmosApp, [
  ROUTER_PROVIDERS,
  SongsModel,
  OptionsModel
]);
