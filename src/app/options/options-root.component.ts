import {Component} from 'angular2/core';
import {RouteConfig, RouterOutlet} from 'angular2/router';

import {OptionsListComponent} from './options-list.component';
import {OptionsDetailComponent} from './options-detail.component';
import {OptionsProvider} from '../services/options-provider/options-provider';

@Component({
  template: '<router-outlet></router-outlet>',
  providers: [OptionsProvider],
  directives: [RouterOutlet]
})
@RouteConfig([
  {path:'/', name: 'OptionsList', component: OptionsListComponent, useAsDefault: true},
  {path:'/:id/...', name: 'OptionsDetail', component: OptionsRoot}
])
export class OptionsRoot {
  constructor() {}
}
