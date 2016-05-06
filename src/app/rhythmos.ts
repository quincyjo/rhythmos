// @angular
import {Component} from '@angular/core';
import {Router, Routes, ROUTER_DIRECTIVES} from '@angular/router';

// Components
import {MainMenu} from './components/index';

// Routes
import {SongWheelRoot, OptionsRoot} from './routes/index';


@Component({
  selector: 'rhythmos-app',
  providers: [],
  templateUrl: 'app/rhythmos.html',
  styleUrls: ['app/rhythmos.css'],
  directives: [ROUTER_DIRECTIVES, MainMenu],
  pipes: []
})
@Routes([
  {path:'/',               component: MainMenu},
  {path:'/song-wheel', component: SongWheelRoot},
  {path:'/options',    component: OptionsRoot}
])
export class RhythmosAppComponent {

  constructor(private _router: Router) {}

  ngOnInit() {
    this._router.navigate(['/']);
  }
}
