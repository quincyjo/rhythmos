import {Component} from '@angular/core';
import {RouteConfig, RouterOutlet} from '@angular/router-deprecated';

import {SongWheel, SongChart} from '../../components/index';

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
