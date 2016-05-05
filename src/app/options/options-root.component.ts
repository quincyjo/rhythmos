import {Component} from '@angular/core';
import {RouteConfig, RouterOutlet} from '@angular/router-deprecated';

import {OptionsListComponent} from './options-list.component';
import {OptionsDetailComponent} from './options-detail.component';
import {OptionsProvider} from '../services/options-provider/options-provider';

@Component({
  template: '<router-outlet></router-outlet>',
  providers: [OptionsProvider],
  directives: [RouterOutlet]
})
@RouteConfig([
  {path:'/:id', name: 'OptionsList', component: OptionsListComponent},
  {path:'/', name: 'OptionsList', component: OptionsListComponent, useAsDefault: true},
  {path:'/:id/...', name: 'OptionsDetail', component: OptionsRoot}
])
export class OptionsRoot {
  constructor() {}
}
