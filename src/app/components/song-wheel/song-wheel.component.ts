{

}import {Component, HostListener} from '@angular/core';
import {ROUTER_DIRECTIVES, RouteTree, Router, OnActivate, RouteSegment} from '@angular/router';
import {Song} from '../../shared/classes/index';
import {SongDetail} from '../../components/index';
import {SongProvider} from '../../services/index';

@Component({
  selector: 'song-wheel',
  templateUrl: 'app/components/song-wheel/song-wheel.component.html',
  styleUrls: ['app/components/song-wheel/song-wheel.component.css'],
  providers: [SongProvider],
  directives: [ROUTER_DIRECTIVES, SongDetail],
  pipes: []
})
export class SongWheel {
  public title = 'Songs';
  public songs: Array<Song>;
  public selectedSong: Song;
  public activeIndex: number;
  public bgs: Array<any>;
  private audio: HTMLAudioElement;
  private currSegment: RouteSegment;

  constructor(private _songProvider: SongProvider,
              private _router: Router) {
                this.songs = [];
                this.bgs = [];
                this.audio = new Audio;
              }

  ngOnInit() {
    this._songProvider.getSongs().then(songs => {
      this.songs = songs;
      if (songs.length > 0) {
        this.select(0);
      }
    });
  }

  routerOnActivate(curr: RouteSegment, prev: RouteSegment, currTree: RouteTree) {
    this.currSegment = curr;
  }

  getSongs() {
    this._songProvider.getSongs().then(songs => {
      this.songs = songs;
    });
  }

  public select(index: number) {
    // Only change if item changed
    if (index != this.activeIndex) {
      this.activeIndex = index;
      // Wait 100ms to make sure key not repeating
      setTimeout(() => {
        if (index === this.activeIndex) {
          this.fetchBackground();
          this.fetchSample();
        }
      }, 100);
    }
  }

  public fetchSample() {
    if (this.audio) {
      this.audio.pause();
    }
    if (this.songs && this.songs[this.activeIndex]) {
      let song = this.songs[this.activeIndex];
      if (song.getData().music === true) { // Resolve binary blob
        this._songProvider.getMusic(song).then((music) => {
          this._playSample(music, song.getMeta().samplestart, song.getMeta().samplelength);
        });
      } else if (song.getData().music) { // Already resolved, use dataUrl
        this._playSample(song.getData().music, song.getMeta().samplestart, song.getMeta().samplelength);
      }
    }
  }

  private _audioListener: (e: Event) => void;
  private _playSample(music: any, start: number, length: number) {
    if (!this.audio.paused) {
      this.audio.pause();
    }
    this.audio.src = music;
    this.audio.currentTime = start;
    console.log(start, length);
    this.audio.removeEventListener('timeupdate', this._audioListener, false);
    this._audioListener = (event) => {
      if (this.audio.currentTime > start + length) {
        this.audio.currentTime = start;
      }
    };
    this.audio.addEventListener('timeupdate', this._audioListener, false);
    this.audio.play();
  }

  public fetchBackground() {
    let bg: any;
    if (this.songs[this.activeIndex]) {
      let song = this.songs[this.activeIndex];
      if (song.getData().background === true) {
        this._songProvider.getBackground(song).then((background) => {
          bg = `
            radial-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.8)),
            url("` + song.getData().background + '") 50% 50% / cover no-repeat';
          this._pushBg(bg);
        });
      } else {
        bg = `
          radial-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.8)),
            url("` + song.getData().background + '") 50% 50% / cover no-repeat';
        this._pushBg(bg);
      }
    } else {
      bg = '#000';
      this.bgs.push(bg);
    }
  }

  private queued: number = 0;
  private _pushBg(bg: any) {
    if (this.queued < 2) {
      this.bgs.push(bg);
    } else {
      this.bgs.splice(this.bgs.length - 1, 1, bg);
    }
    ++this.queued;
    setTimeout( () => {
      if (--this.queued == 0) {
        this.bgs.splice(0, this.bgs.length - 1);
      }
    }, 400);
  }

  public isSelected(index: number): boolean {
    return (this.activeIndex === index);
  }

  public getSelected(): Object {
    if (this.songs) {
      return this.songs[this.activeIndex];
    } else {
      return null;
    }
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

  public play(id: number) {
    this._router.navigate(['/song-wheel', id, 0]);
  }

  private _keyEnter() {
    let target = this.songs[this.activeIndex];
    if (target.id) {
      this.play(target.id);
    }
  }

  private _keyDownArrow() {
    this.select((this.activeIndex + 1) % this.songs.length);
  }

  private _keyUpArrow() {
    this.select((this.activeIndex - 1) < 0 ? this.songs.length - 1 : this.activeIndex - 1);
  }

  routerCanDeactivate(): any {
    this.audio.pause();
    return true;
  }
}
