import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {Song} from '../../shared/interfaces/song';
import {SongDetail} from '../song-detail/song-detail';
import {SongProvider} from '../../services/song-provider/song-provider';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';

@Component({
  selector: 'song-wheel',
  templateUrl: 'app/components/song-wheel/song-wheel.html',
  styleUrls: ['app/components/song-wheel/song-wheel.css'],
  providers: [SongProvider],
  directives: [ROUTER_DIRECTIVES, SongDetail],
  pipes: [],
  host: {
    '(document:keydown)': '_keydown($event)'
  }
})
export class SongWheel {
  public title = 'Songs';
  public songs: Song[];
  public selectedSong: Song;
  public activeIndex: number;
  public bg: any;

  constructor(private _songProvider: SongProvider,
              private _router: Router) {}

  getSongs() {
    this._songProvider.getSongs().then(songs => {
      this.songs = songs;
    });
  }

  ngOnInit() {
    this._songProvider.getSongs().then(songs => {
      this.songs = songs;
      this.select(0);
    });
  }

  onSelect(song: Song) {
    this.selectedSong = song;
  }

  public select(index: number) {
    this.activeIndex = index;
    this.fetchBackground();
  }

  public fetchBackground() {
    if(this.songs
    && this.songs[this.activeIndex]){
      let song = this.songs[this.activeIndex];
      if (song.background === true) {
        this._songProvider.getBackground(song).then((background) => {
          this.bg = `
            radial-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.8)),
            url("` + song.background + '") 50% 50% / cover no-repeat';
        });
      } else {
        this.bg = `
          radial-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.8)),
            url("` + song.background + '") 50% 50% / cover no-repeat';
      }
    } else {
      this.bg = "#000";
    }
  }

  public isSelected(index: number): boolean {
    return (this.activeIndex === index);
  }

  public getSelected() {
    if(this.songs)
      return this.songs[this.activeIndex];
    else return null;
  }

  private _keydown(event: any){
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
    let target = this.songs[this.activeIndex];
    if(target.id){
      this._router.navigate(['Play', {id: target.id}]);
    }
  }

  private _keyDownArrow(){
    this.select(++this.activeIndex % this.songs.length);
  }

  private _keyUpArrow(){
    this.select(--this.activeIndex < 0 ? this.songs.length + this.activeIndex : this.activeIndex);
  }
}
