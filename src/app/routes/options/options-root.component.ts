import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Routes} from '@angular/router';

import {OptionsListComponent} from './options-list.component';
import {OptionsDetailComponent} from './options-detail.component';
import {OptionsProvider} from '../../services/index';

@Component({
  template: '<router-outlet></router-outlet>',
  providers: [OptionsProvider],
  directives: [ROUTER_DIRECTIVES]
})
@Routes([
  {path:'/:id', component: OptionsListComponent},
  {path:'/', component: OptionsListComponent},
  {path:'/:id/...', component: OptionsRoot}
])
export class OptionsRoot {
  constructor() {}
}
