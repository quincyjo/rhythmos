import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {SongWheel} from './components/song-wheel/song-wheel';
import {MainMenu} from './components/main-menu/main-menu';
import {SongWheelRoot} from './song-wheel/song-wheel-root.component';


@Component({
  selector: 'rhythmos-app',
  providers: [],
  templateUrl: 'app/rhythmos.html',
  directives: [ROUTER_DIRECTIVES, SongWheel],
  pipes: []
})
@RouteConfig([
  {path:'/', name: 'Rhythmos', component: MainMenu, useAsDefault: true},
  {path:'/song-wheel/...', name: 'SongWheel', component: SongWheelRoot}
])
export class RhythmosApp {
  defaultMeaning: number = 42;

  meaningOfLife(meaning?: number) {
    return `The meaning of life is ${meaning || this.defaultMeaning}`;
  }
}
