import { Component, HostListener } from '@angular/core';
import { MenuComponent } from './components';

import { DatabaseService, InputService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  items: Array<Object> = [
    {text: 'Item 1'},
    {text: 'Item 2'},
    {text: 'Item 3'},
    {text: 'Item 4'}
  ];

  constructor(private _databaseService: DatabaseService,
              private _inputService: InputService) { }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this._inputService.handleKeyboardEvent(event);
  }
}
