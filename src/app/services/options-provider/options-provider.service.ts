import {Injectable} from '@angular/core';
import {Option} from '../../shared/index';
import {OptionsModel} from '../../models/index';

@Injectable()
export class OptionsProvider {

  constructor(private _model: OptionsModel) {}

  getOptions() {
    return Promise.resolve(this._model.getOptions());
  }

  get(id: number, target = this._model.getOptions()) {
    let opt: Promise<Option>;
    for (let option of target) {
      if (option.id === id){
        return Promise.resolve(option);
      }
      if (option.children.length != 0) {
        opt = this.get(id, target = option.children);
        if (opt) return opt;
      }
    };
  }
}
