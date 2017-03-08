import { Component, Input } from '@angular/core';
import { inputType } from '../../shared/types';
import { InputService } from '../../services';

@Component({
  selector: 'menu-component',
  templateUrl: './menu.component.html',
  styleUrls: [ './menu.component.scss' ]
})
export class MenuComponent {
  public index: number = 0;
  @Input('items')
  public items: Array<Object> = [];

  constructor(private _inputService: InputService) {
    this._inputService.inputs['up'].subscribe(() => {
      this.next();
    });
    this._inputService.inputs['down'].subscribe(() => {
      this.prev();
    });
    this._inputService.inputs['right'].subscribe(() => {
      this.next();
    });
    this._inputService.inputs['left'].subscribe(() => {
      this.prev();
    });
  }

  public next(): void {
    this.select(this.index < this.items.length - 1 ? this.index + 1 : this.index);
  }

  public prev(): void {
    this.select(this.index > 0 ? this.index - 1 : this.index);
  }

  private select(index: number): void {
    this.items[this.index]['active'] = false;
    this.index = index;
    this.items[this.index]['active'] = true;
  }
}
