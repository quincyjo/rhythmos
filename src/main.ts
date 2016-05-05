import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { RhythmosAppComponent, environment } from './app/index';
import {ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {DatabaseService} from './app/services/database-service/database-service';
import {SongsModel} from './app/models/songs-model';
import {OptionsModel} from './app/models/options-model';

if (environment.production) {
  enableProdMode();
}

bootstrap(RhythmosAppComponent, [
  ROUTER_PROVIDERS,
  DatabaseService,
  SongsModel,
  OptionsModel
]);
