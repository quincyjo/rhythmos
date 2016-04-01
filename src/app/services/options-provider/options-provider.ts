import {Injectable} from 'angular2/core';
import {Option} from '../../shared/interfaces/option';
import {OPTIONS} from './mock-options';

@Injectable()
export class OptionsProvider {

  constructor() {}

  getOptions() {
    return Promise.resolve(OPTIONS);
  }

  get(id: number, target = OPTIONS) {
    var opt: Promise<Option>;
    for (var option of OPTIONS) {
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
