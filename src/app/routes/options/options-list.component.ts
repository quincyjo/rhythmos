import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, RouteSegment, OnActivate, CanDeactivate} from '@angular/router';
import {Option} from '../../shared/index';
import {OptionsProvider} from '../../services/index';

@Component({
  templateUrl: 'app/routes/options/options-list.component.html',
  styleUrls: ['app/routes/options/options-list.component.css'],
  directives: [ROUTER_DIRECTIVES],
})
export class OptionsListComponent implements OnInit {
  options: Option[];
  option: Option;

  constructor(
    private _optionsProvider: OptionsProvider,
    private _router: Router
    ) {}

  ngOnInit() {}

  routerCanDeactivate(curr: RouteSegment) {
    let id = +curr.getParam('id');
    if (id) {
      this._optionsProvider.get(id).then(option => {
        this.option = option;
        this.options = this.option["children"];
      });
    } else {
      this._optionsProvider.getOptions().then(options => {
        this.options = options;
      });
    }
  }
}
