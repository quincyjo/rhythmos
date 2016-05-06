import {Component, OnInit} from '@angular/core';
import {RouteParams, Router} from '@angular/router-deprecated';
import {CanDeactivate, ComponentInstruction} from '@angular/router-deprecated';
import {Option} from '../../shared/index';
import {OptionsProvider} from '../../services/index';

@Component({
  templateUrl: 'app/routes/options/options-detail.component.html',
  styleUrls: ['app/routes/options/options-detail.component.css'],
})
export class OptionsDetailComponent implements OnInit, CanDeactivate {

  option: Option;
  editLabel: string;

  constructor(
    private _service: OptionsProvider,
    private _router: Router,
    private _routeParams: RouteParams
    ) { }

  ngOnInit() {
    let id = +this._routeParams.get('id');
    this._service.get(id).then(option => {
      if (option) {
        this.editLabel = option.label;
        this.option = option;
      } else {
        this.gotoList();
      }
    });
  }

  routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction): any {
    if (!this.option || this.option.label === this.editLabel) {
      return true;
    }

    return new Promise<boolean>((resolve, reject) => resolve(window.confirm('Discard changes?')));
  }

  cancel() {
    this.editLabel = this.option.label;
    this.gotoList();
  }

  save() {
    this.option.label = this.editLabel;
    this.gotoList();
  }

  gotoList() {
    this._router.navigate(['OptionsList']);
  }
}
