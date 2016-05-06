// @angular
import {Component} from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';

// Components
import {MainMenu} from './components/index';

// Routes
import {SongWheelRoot, OptionsRoot} from './routes/index';


@Component({
  selector: 'rhythmos-app',
  providers: [],
  templateUrl: 'app/rhythmos.html',
  styleUrls: ['app/rhythmos.css'],
  directives: [ROUTER_DIRECTIVES, MainMenu],
  pipes: []
})
@RouteConfig([
  {path:'/', name: 'Rhythmos', component: MainMenu, useAsDefault: true},
  {path:'/song-wheel/...', name: 'SongWheel', component: SongWheelRoot},
  {path:'/options/...', name: 'Options', component: OptionsRoot}
])
export class RhythmosAppComponent {

  constructor() {}
}
