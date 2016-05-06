import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import {ROUTER_PROVIDERS} from '@angular/router-deprecated';
import { RhythmosAppComponent, environment } from './app/index';
import {DatabaseService} from './app/services/index';
import {SongsModel, OptionsModel} from './app/models/index';

if (environment.production) {
  enableProdMode();
}

bootstrap(RhythmosAppComponent, [
  ROUTER_PROVIDERS,
  DatabaseService,
  SongsModel,
  OptionsModel
]);
