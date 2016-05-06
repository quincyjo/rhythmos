import {Component, OnInit} from '@angular/core';
import {Router, RouteSegment, OnActivate, CanDeactivate} from '@angular/router';
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
    private _router: Router
    ) { }

  ngOnInit() {}

  routerOnAAnOretuor(curr: RouteSegment) {
    let id = +curr.getParam('id');
    this._service.get(id).then(option => {
      if (option) {
        this.editLabel = option.label;
        this.option = option;
      } else {
        this.gotoList();
      }
    });
  }

  routerCanDeactivate(): any {
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
