import {Component} from '@angular/core';
import {Router, RouteSegment, OnActivate, Routes, ROUTER_DIRECTIVES} from '@angular/router';

import {SongWheel, SongStage} from '../../components/index';

@Component({
  template: '<router-outlet></router-outlet>',
  providers: [],
  directives: [ROUTER_DIRECTIVES]
})
@Routes([
  {path:'', component: SongWheel},
  {path:'/:id/:chart', component: SongStage}
])
export class SongWheelRoot {
  constructor(private _router: Router) {}
}
