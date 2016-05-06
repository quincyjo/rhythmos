import {Component, HostListener} from '@angular/core';
import {Router} from '@angular/router-deprecated';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';


@Component({
  selector: 'main-menu',
  templateUrl: 'app/components/main-menu/main-menu.component.html',
  styleUrls: ['app/components/main-menu/main-menu.component.css'],
  providers: [],
  directives: [ROUTER_DIRECTIVES],
  pipes: [],
})
export class MainMenu {
  private _activeIndex: number;
  public menu = [
    {
      name: 'Play',
      path: ['SongWheel'],
      href: null
    },
    {
      name: 'Options',
      path: ['Options'],
      href: null
    },
    {
      name: 'Github Page',
      path: null,
      href: 'http://www.github.com/verbetam/rhythmos'
    }
  ];

  constructor(private _router: Router) {}

  ngOnInit() {
    this.select(0);
  }

  public select(index: number) {
    this._activeIndex = index;
  }

  public isSelected(index: number) {
    return this._activeIndex === index;
  }

  @HostListener('document:keydown', ['$event'])
  private _keydown(event: any) {
    switch (event.keyCode) {
      case 13: // Enter
        this._keyEnter();
        break;
      case 40: // Down Arrow
        this._keyDownArrow();
        break;
      case 38: // Up Arrow
        this._keyUpArrow();
        break;
    }
  }

  private _keyEnter() {
    let target = this.menu[this._activeIndex];
    if (target.path) {
      this._router.navigate(target.path);
    } else if (target.href) {
      window.open(target.href, '_blank');
    }
  }

  private _keyDownArrow() {
    this._activeIndex = (++this._activeIndex % this.menu.length);
  }

  private _keyUpArrow() {
    this._activeIndex = --this._activeIndex < 0
                      ? this.menu.length + this._activeIndex
                      : this._activeIndex;
  }
}
