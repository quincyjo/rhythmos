import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {Song} from '../../shared/interfaces/song';
import {SongProvider} from '../../services/song-provider/song-provider';

let arrow: any;
let receptor: any;
let flash: any;
let glow: any;
let bg: any;
let audio: any;
let measure: any;
let measureStep: number;
let factory: StepFactory;
let lastMeasureIndex: number;
let start: number;

@Component({
  selector: 'song-chart',
  inputs: ['song'],
  templateUrl: 'app/components/song-chart/song-chart.html',
  styleUrls: ['app/components/song-chart/song-chart.html'],
  providers: [SongProvider],
  directives: [],
  pipes: [],
  host: {
    '(document:keydown)': '_keydown($event)',
    '(document:keyup)': '_keyup($event)'
  }
})
export class SongChart {
    public song: Song;
    private _canvas: HTMLCanvasElement;
    private _keys: number[];
    private _tracks: Track[];
    private _start: number;
    private _lastTick: number;
    private _thisTick: number;
    private _runningTime: number;

  constructor(
    private _songProvider: SongProvider,
    private _router: Router,
    private _routeParams: RouteParams
    ) {}

  ngOnInit() {
    let id = +this._routeParams.get('id');
    factory = new StepFactory();
    this._keys = [0, 0, 0, 0];
    this._canvas = <HTMLCanvasElement>document.getElementById('chart');
    this._canvas.width = window.innerWidth;
    this._canvas.height = window.innerHeight;
    this._songProvider.getById(id).then((song) => {
      this.song = song;
      measureStep = (1 / (this.song.bpms[0] / 60)) * 4;
      this._loadAssets().then(() => {
        this._buildStage().then(() => {
          this.start();
        })
      });
    });
  }

  public start() {
    var lastMeasureIndex = -1;
    this._lastTick = Date.now();
    this._start = this._lastTick;
    start = this._lastTick;
    audio.play();
    this._runningTime = 0;
    this._run();
  }

  private _run() {
    requestAnimationFrame(() => {
      this._tick();
      this._run();
    });
  }

  private _tick() {
    this._thisTick = Date.now();
    let delta = this._thisTick - this._lastTick;
    this._runningTime += delta;
    this._update(delta / 1000);
    this._render();
    this._lastTick = this._thisTick;
  }

  private _render() {
    this._drawBg();
    for (let track of this._tracks)
      track.draw();
  }

  private _update(modifier: number) {
    this._updateMeasure();
    for (let index in this._tracks){
      this._tracks[index].update(this._keys[index], modifier);
    }
  }

  private _updateMeasure() {
    let index = Math.floor(this._runningTime / 1000 / measureStep) + 2;
    if (index != lastMeasureIndex) {
      lastMeasureIndex = index;
      measure = this.song.notes.notes[index];
      //console.log(measure);
      for (let i = 0; i < measure.length; i++) {
        let line = measure[i];
        for (let j = 0; j < line.length; j++) {
          if (line[j] == 1){
            this._tracks[j].steps.push(
              factory.createStep(i, measure.length)
            );
          }
        }
      }
    }
  }

  private _keydown(event: any){
    switch(event.keyCode){
      case 37: // Left Arrow
      case 68:
        this._pressKey(0);
        break;
      case 38: // Up Arrow
      case 74:
        this._pressKey(2);
        break;
      case 39: // Right Arrow
      case 75:
        this._pressKey(3);
        break;
      case 40: // Down Arrow
      case 70:
        this._pressKey(1);
        break;
    }
  }

  private _keyup(event: any){
    switch(event.keyCode){
      case 37: // Left Arrow
      case 68:
        this._releaseKey(0);
        break;
      case 38: // Up Arrow
      case 74:
        this._releaseKey(2);
        break;
      case 39: // Right Arrow
      case 75:
        this._releaseKey(3);
        break;
      case 40: // Down Arrow
      case 70:
        this._releaseKey(1);
        break;
    }
  }

  private _pressKey(index: number) {
    if(this._keys[index] == 0) {
      this._keys[index] = Date.now();
      //console.log(this._keys[index]);
    }
  }

  private _releaseKey(index: number) {
    this._keys[index] = 0;
    //console.log(this._keys[index]);
  }

  private _loadAssets() {
    let promise = new Promise<any>((resolve, reject) => {
      let promises: Promise<any>[] = [];
      promises.push(new Promise<any>((resolve, reject) => {
        arrow = new Image;
        arrow.onload = () => {
          resolve();
        }
        arrow.src = 'app/images/arrow.png';
      }));
      promises.push(new Promise<any>((resolve, reject) => {
        receptor = new Image;
        receptor.onload = () => {
          resolve();
        }
        receptor.src = 'app/images/receptor.png';
      }));
      promises.push(new Promise<any>((resolve, reject) => {
        flash = new Image;
        flash.onload = () => {
          resolve();
        }
        flash.src = 'app/images/flash.png';
      }));
      promises.push(new Promise<any>((resolve, reject) => {
        glow = new Image;
        glow.onload = () => {
          resolve();
        }
        glow.src = 'app/images/glow.png';
      }));
      promises.push(new Promise<any>((resolve, reject) => {
        bg = new Image;
        bg.onload = () => {
          resolve();
        }
        bg.src = this.song.background;
      }));
      promises.push(new Promise<any>((resolve, reject) => {
        audio = new Audio(this.song.music);
        resolve();
      }));
      Promise.all(promises).then(() => {
        resolve();
      });
    });
    return promise;
  }

  private _buildStage() {
    let promise = new Promise<any>((resolve, reject) => {
      let promises: Promise<any>[] = [];
      promises.push(this._buildTracks());
      Promise.all(promises).then(() => {
        resolve();
      });
    });
    return promise;
  }

  private _buildTracks() {
    let promise = new Promise<any>((resolve, reject) => {
      this._tracks = [
        new Track(90 * Math.PI / 180, this._canvas.getContext('2d'), 32),
        new Track(0, this._canvas.getContext('2d'), 32+128+32),
        new Track(180 * Math.PI / 180, this._canvas.getContext('2d'), 32+128+32+128+32),
        new Track(270 * Math.PI / 180, this._canvas.getContext('2d'), 32+128+32+128+32+128+32)
      ];
      resolve();
    });
    return promise;
  }

  private _drawBg() {
    this._canvas.getContext('2d').drawImage(bg, 0, 0, bg.width, bg.height,
                                            0, 0, this._canvas.width, this._canvas.height);
  }
}

class Track{
  private _img;
  private _flash;
  private _glow;
  public steps: Step[];

  constructor(public rotation: number, public cxt: any, public offset: number) {
    this._img = receptor;
    this._flash = false;
    this._glow = false;
    this.steps = [];
  }

  public update(keystate: number, modifier: number) {
    if(keystate) {
      let delta = Date.now() - keystate;
      if(delta < 50){
        this._flash = true;
        this._glow = false;
      } else {
        this._glow = true;
        this._flash = false;
      }
      this._checkStep();
    } else {
      this._flash = false;
      this._glow = false;
    }
  }

  public draw() {
    this.cxt.save();
    this.cxt.translate(64 + this.offset, 64 + 32);
    this.cxt.rotate(this.rotation);
    this.cxt.drawImage(this._img, -(this._img.width/2), -(this._img.height/2));
    if(this._flash) this.cxt.drawImage(flash, -(flash.width/2), -(flash.height/2));
    if(this._glow) this.cxt.drawImage(glow, -(glow.width/2), -(glow.height/2));
    this.cxt.restore();
    this._drawSteps();
  }

  private _checkStep() {
    if (this.steps[0] && Math.abs(Date.now() - this.steps[0].target) < 22.5){
      this.steps.splice(0, 1);
      console.log("HIT");
    }
  }

  private _drawSteps() {
    let step: Step;
    for (let i = 0; i < this.steps.length; i++) {
      step = this.steps[i];
      if (step.target - Date.now() < -200){
        this.steps.splice(i, 1);
      } else {
        this.cxt.save();
        this.cxt.translate(64 + this.offset, 64 + 32 + (step.target - Date.now()));
        //console.log(step.target);
        this.cxt.rotate(this.rotation);
        this.cxt.drawImage(arrow, step.sx, step.sy, step.swidth, step.sheight, -64, -64, 128, 128)
        this.cxt.restore();
      }
    }
  }
}

interface Step{
  sx: number;
  sy: number;
  swidth: number;
  sheight: number;
  x: number;
  y: number;
  target: number;
  measure: number;
  beat: number;
  time: number;
}

class StepFactory{
  constructor() {}

  public createStep(beat: number, time: number): Step {
    let offset: number;
    switch(time) {
        case 4:
          offset = 0;
          break;
        case 8:
          if (beat % 2 == 0) offset = 0;
          else offset = 128;
          break;
        case 16:
          if(beat % 4 == 0) offset = 0;
          else if (beat % 2 == 0) offset = 128;
          else offset = 384;
          break;
        default:
          offset = 896;
    }
    return {
      sx: 0,
      sy: offset,
      swidth: 128,
      sheight: 128,
      x: 0,
      y: 0,
      target: start + (lastMeasureIndex + (beat/time)) * measureStep * 1000 + 150,
      measure: lastMeasureIndex,
      beat: beat,
      time: time,
    };
  }
}
