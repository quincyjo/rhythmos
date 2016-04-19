import {Component, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';
import {ROUTER_DIRECTIVES} from 'angular2/router';


@Component({
  selector: 'main-menu',
  templateUrl: 'app/components/main-menu/main-menu.html',
  styleUrls: ['app/components/main-menu/main-menu.css'],
  providers: [],
  directives: [ROUTER_DIRECTIVES],
  pipes: [],
  host: {
    '(document:keyup)': '_keyup($event)'
  }
})
export class MainMenu {
  private _activeIndex: number;
  public menu = [
    {
      name: "Play",
      path: ['SongWheel'],
      active: false
    },
    {
      name: "Options",
      path: ['Options'],
      active: false
    },
    {
      name: "Github Page",
      path: null,
      href: "http://www.github.com/verbetam/rhythmos",
      active: false
    }
  ];

  constructor(private _router: Router) {}

  ngOnInit() {
    this.menu[0].active = true;
    this._activeIndex = 0;
  }

  public select(route: any){
    for(let i = 0; i < this.menu.length; i++){
      this.menu[i].active = false;
      if(this.menu[i] === route){
        this._activeIndex = i;
      }
    }
    route.active = true;
  }

  private _keyup(event: any){
    switch(event.keyCode){
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

  private _keyEnter(){
    let target = this.menu[this._activeIndex];
    if(target.path){
      this._router.navigate(target.path);
    }
  }

  private _keyDownArrow(){
    this.menu[this._activeIndex].active = false;
    this._activeIndex = (++this._activeIndex % this.menu.length);
    this.menu[this._activeIndex].active = true;
  }

  private _keyUpArrow(){
    this.menu[this._activeIndex].active = false;
    this._activeIndex = (--this._activeIndex % this.menu.length);
    this.menu[this._activeIndex].active = true;
  }
}
