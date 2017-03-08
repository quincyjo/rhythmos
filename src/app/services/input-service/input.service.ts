import { Injectable, EventEmitter} from '@angular/core';
import { inputEvents, keyMap } from './key-map';

@Injectable()
export class InputService {
  public inputs: Object;

  constructor() {
    this.inputs = {};
    for (let inputEvent of inputEvents) {
      this.inputs[inputEvent] = new EventEmitter();
    }
  }

  public handleKeyboardEvent(event: KeyboardEvent) {
    let inputEvent = this._mapKey(event);
    if (inputEvent) { // Mapped to valid event
      this.inputs[inputEvent.toString()].emit();
    }
  }

  private _mapKey(event): boolean | string {
    let inputEvent = keyMap[event.key];
    return inputEvent ? inputEvent : false;
  }

}
