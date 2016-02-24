import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';


@Component({
  selector: 'rhythmos-app',
  providers: [],
  templateUrl: 'app/rhythmos.html',
  directives: [ROUTER_DIRECTIVES],
  pipes: []
})
@RouteConfig([

])
export class RhythmosApp {
  defaultMeaning: number = 42;
  
  meaningOfLife(meaning?: number) {
    return `The meaning of life is ${meaning || this.defaultMeaning}`;
  }
}
