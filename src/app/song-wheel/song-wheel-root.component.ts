import {Component} from 'angular2/core';
import {RouteConfig, RouterOutlet} from 'angular2/router';

import {SongWheel} from '../components/song-wheel/song-wheel';
import {SongChart} from '../components/song-chart/song-chart';

@Component({
  template: '<router-outlet></router-outlet>',
  providers: [],
  directives: [RouterOutlet]
})
@RouteConfig([
  {path:'/', name: 'SongWheel', component: SongWheel, useAsDefault: true},
  {path:'/:id', name: 'Play', component: SongChart}
])
export class SongWheelRoot {
  constructor() {}
}
