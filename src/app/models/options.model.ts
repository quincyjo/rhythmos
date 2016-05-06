import {Injectable} from '@angular/core';
import {Option} from '../shared/index';
import {OPTIONS} from '../services/options-provider/mock-options';

@Injectable()
export class OptionsModel {
  private _options: Option[];
  constructor() {
    this._fetchOptions();
  }

  private _fetchOptions() {
    this._options = OPTIONS;
  }

  public getOptions() {
    return this._options;
  }
}
