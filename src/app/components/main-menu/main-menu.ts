import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';


@Component({
  selector: 'main-menu',
  templateUrl: 'app/components/main-menu/main-menu.html',
  styleUrls: ['app/components/main-menu/main-menu.css'],
  providers: [],
  directives: [ROUTER_DIRECTIVES],
  pipes: []
})
export class MainMenu {

  constructor() {}

}
