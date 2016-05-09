import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import {Router, ROUTER_PROVIDERS} from '@angular/router';
import { RhythmosAppComponent, environment } from './app/index';
import {DatabaseService, SscReader, SmReader} from './app/services/index';
import {SongsModel, OptionsModel} from './app/models/index';

if (environment.production) {
  enableProdMode();
}

bootstrap(RhythmosAppComponent, [
  ROUTER_PROVIDERS,
  DatabaseService,
  SscReader,
  SmReader,
  SongsModel,
  OptionsModel
]);
