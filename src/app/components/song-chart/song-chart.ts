import {Component, HostListener, Input} from 'angular2/core';
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
let scoreBoard: ScoreBoard;
let lastMeasureIndex: number;
let start: number;
let measureOffset: number;

@Component({
  selector: 'song-chart',
  templateUrl: 'app/components/song-chart/song-chart.html',
  styleUrls: ['app/components/song-chart/song-chart.html'],
  providers: [SongProvider],
  directives: [],
  pipes: []
})
export class SongChart {
    @Input() song: Song;
    private _canvas: HTMLCanvasElement;
    private _keys: number[];
    private _tracks: Track[];
    private _start: number;
    private _lastTick: number;
    private _thisTick: number;
    private _runningTime: number;
    private _continue: boolean;

  constructor(
    private _songProvider: SongProvider,
    private _router: Router,
    private _routeParams: RouteParams
    ) {}

  ngOnInit() {
    let id = +this._routeParams.get('id');
    factory = new StepFactory();
    scoreBoard = new ScoreBoard();
    this._keys = [0, 0, 0, 0];
    this._canvas = <HTMLCanvasElement>document.getElementById('chart');
    this._canvas.width = window.innerWidth;
    this._canvas.height = window.innerHeight;
    this._songProvider.getById(id).then((song) => { // Get song
      this.song = song;
      measureStep = (1 / (this.song.bpms[0] / 60) * 4000);
      measureOffset = Math.ceil(2000 / measureStep);
      this._loadAssets().then(() => {               // Preload assets
        this._buildStage().then(() => {             // Create stage objects
          this._prerenderMeasures();                // Prerender measures
          this._fadeIn(1000).then(() => {           // Fade in
            setTimeout(this.start(), 1000);         // Start song
          });
        });
      });
    });
  }

  public start() {
    this._continue = true;
    lastMeasureIndex = -1;
    this._lastTick = Date.now();
    this._start = this._lastTick;
    start = this._lastTick;
    this._runningTime = 0;
    audio.play();
    this._run();
  }

  private _fadeIn(length: number) {
    let promise = new Promise<any>((resolve, reject) => {
      let fadeStart = Date.now();
      let fin = fadeStart + length;
      let run = () => {
        if (Date.now() < fin) {
          requestAnimationFrame(() => {
            this._fadeStep(1 - (Date.now() - fadeStart) / length);
            run();
          });
        } else {
          resolve();
        }
      };
      run();
    });
    return promise;
  }

  private _fadeStep(mod: number) {
    this._render();
    let cxt = this._canvas.getContext('2d');
    cxt.globalAlpha = mod < 0 ? 0 : mod;
    cxt.fillStyle = '#000000';
    cxt.fillRect(0, 0, this._canvas.width, this._canvas.height);
    cxt.globalAlpha = 1;
  }

  private _run() {
    if (this._continue) {
      requestAnimationFrame(() => {
        this._tick();
        this._run();
      });
    }
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
    for (let track of this._tracks) {
      track.draw();
    }
    scoreBoard.drawSplash(this._canvas);
  }

  private _update(modifier: number) {
    this._updateMeasure();
    for (let index in this._tracks) {
      this._tracks[index].update(this._keys[index], modifier);
    }
  }

  private _prerenderMeasures() {
    for (let i = 0; i < measureOffset; i++) {
      this._loadMeasure(i);
    }
  }

  private _updateMeasure() {
    let index = Math.floor(this._runningTime / measureStep) + measureOffset;
    if (index != lastMeasureIndex && index < this.song.notes.notes.length) {
      lastMeasureIndex = index;
      this._loadMeasure(index);
    }
  }

  private _loadMeasure(index: number) {
      measure = this.song.notes.notes[index];
      for (let i = 0; i < measure.length; i++) {
        let line = measure[i];
        for (let j = 0; j < line.length; j++) {
          if (line[j] == 1 || line[j] == 2) {
            this._tracks[j].steps.push(
              factory.createStep(i, measure.length)
            );
          }
        }
      }
  }

  @HostListener('document:keydown', ['$event'])
  private _keydown(event: any) {
    switch (event.keyCode) {
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

  @HostListener('document:keyup', ['$event'])
  private _keyup(event: any) {
    switch (event.keyCode) {
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
    if (this._keys[index] == 0) {
      this._keys[index] = Date.now();
    }
  }

  private _releaseKey(index: number) {
    this._keys[index] = 0;
  }

  private _loadAssets() {
    let promise = new Promise<any>((resolve, reject) => {
      let promises: Promise<any>[] = [];
      promises.push(new Promise<any>((resolve, reject) => {
        arrow = new Image;
        arrow.onload = () => {
          resolve();
        };
        arrow.src = 'app/images/arrow.png';
      }));
      promises.push(new Promise<any>((resolve, reject) => {
        receptor = new Image;
        receptor.onload = () => {
          resolve();
        };
        receptor.src = 'app/images/receptor.png';
      }));
      promises.push(new Promise<any>((resolve, reject) => {
        flash = new Image;
        flash.onload = () => {
          resolve();
        };
        flash.src = 'app/images/flash.png';
      }));
      promises.push(new Promise<any>((resolve, reject) => {
        glow = new Image;
        glow.onload = () => {
          resolve();
        };
        glow.src = 'app/images/glow.png';
      }));
      promises.push(new Promise<any>((resolve, reject) => {
        if (this.song.background === false) {
          bg = false;
          resolve();
        } else {
          bg = new Image;
          bg.onload = () => {
            resolve();
          };
          if (this.song.background === true) {
            this._songProvider.getBackground(this.song).then((background) => {
              bg.src = background;
            });
          } else {
            bg.src = this.song.background;
          }
        }
      }));
      promises.push(new Promise<any>((resolve, reject) => {
        this._songProvider.getMusic(this.song).then((url) => {
          audio = new Audio(url);
          resolve();
        });
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
        new Track(0.5 * Math.PI , this._canvas.getContext('2d'),
                  32),
        new Track(0, this._canvas.getContext('2d'),
                  32 + 128 + 16),
        new Track(1.0 * Math.PI , this._canvas.getContext('2d'),
                  32 + 128 + 16 + 128 + 16),
        new Track(1.5 * Math.PI , this._canvas.getContext('2d'),
                  32 + 128 + 16 + 128 + 16 + 128 + 16)
      ];
      resolve();
    });
    return promise;
  }

  private _drawBg() {
    if (bg) {
    this._canvas.getContext('2d').drawImage(bg, 0, 0, bg.width, bg.height,
                                            0, 0, this._canvas.width, this._canvas.height);
    }
  }
}

class Track {
  private _img;
  private _flash;
  private _glow;
  private _held;
  private _delta: number;
  public steps: Step[];

  constructor(public rotation: number, public cxt: any, public offset: number) {
    this._img = receptor;
    this._flash = false;
    this._held = false;
    this.steps = [];
  }

  public update(keystate: number, modifier: number) {
    if (keystate) {
      if (!this._held) {
        this._held = true;
        this._checkStep(keystate);
      }
      this._delta = Date.now() - keystate;
      if (this._delta < 100) {
        this._flash = true;
      } else {
        this._flash = false;
      }
    } else {
      this._held = false;
      this._flash = false;
    }
  }

  public draw() {
    this.cxt.save();
    this.cxt.translate(64 + this.offset, 64 + 32);
    this.cxt.rotate(this.rotation);
    this.cxt.drawImage(this._img, -(this._img.width / 2), -(this._img.height / 2));
    if (this._held) {
      this.cxt.globalAlpha = this._delta / 50;
      this.cxt.drawImage(glow, -(glow.width / 2), -(glow.height / 2));
    }
    if (this._flash) {
      this.cxt.globalAlpha = 1 - this._delta / 100;
      this.cxt.drawImage(flash, -(flash.width / 2), -(flash.height / 2));
    }
    this.cxt.globalAlpha = 1;
    this.cxt.restore();
    this._drawSteps();
  }

  private _checkStep(hit: number) {
    if (this.steps[0]) {
      let step = this.steps[0];
      if (step.target - hit < 180) {
        scoreBoard.score(step.target, hit);
        this.steps.splice(0, 1);
      }
    }
  }

  private _drawSteps() {
    let step: Step;
    for (let i = 0; i < this.steps.length; i++) {
      step = this.steps[i];
      if (step.target - Date.now() < -200) {
        this.steps.splice(i, 1);
        scoreBoard.miss();
      } else {
        this.cxt.save();
        this.cxt.translate(64 + this.offset, 64 + 32 + (step.target - Date.now()));
        this.cxt.rotate(this.rotation);
        this.cxt.drawImage(arrow, step.sx, step.sy, step.swidth, step.sheight, -64, -64, 128, 128);
        this.cxt.restore();
      }
    }
  }
}

interface Step {
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

class StepFactory {
  constructor() {}

  public createStep(beat: number, time: number): Step {
    let offset: number;
    switch (time) {
        case 3:
          if (beat == 0) {
            offset = 0;
          } else {
            offset = 256;
          }
          break;
        case 4:
          offset = 0;
          break;
        case 6:
          if (beat == 0 || beat == 3) {
            offset = 0;
          } else {
            offset = 256;
          }
          break;
        case 8:
          if ((beat & 1) == 0) {
            offset = 0;
          } else {
            offset = 128;
          }
          break;
        case 9:
          if (beat == 0 || beat == 3 || beat == 6) {
            offset = 0;
          } else {
            offset = 256;
          }
          break;
        case 16:
          if ((beat & 3) == 0) {
            offset = 0;
          } else if ((beat & 1) == 0) {
            offset = 128;
          } else {
            offset = 384;
          }
          break;
        case 32:
          if ((beat & 7) == 0) {
            offset = 0;
          } else if ((beat & 3) == 0) {
            offset = 128;
          } else if ((beat & 1) == 0) {
            offset = 384;
          } else {
            offset = 640;
          }
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
      target: start + (lastMeasureIndex + (beat / time)) * measureStep,
      measure: lastMeasureIndex,
      beat: beat,
      time: time,
    };
  }
}

class ScoreBoard {
  private _life: number;
  private _score: number;
  private _combo: number;
  private _flawless: number;
  private _perfect: number;
  private _great: number;
  private _good: number;
  private _bad: number;
  private _boo: number;
  private _poor: number;
  private _lastScore: string;

  constructor() {
    this._life = this._score = this._combo = this._flawless = this._perfect =
    this._great = this._good = this._bad = this._boo = this._poor = 0;
  }

  public score(target: number, hit: number) {
    let delta = target - hit;
    delta = Math.abs(delta);
    if (delta < 22.5) { // Flawless
      this._flawless++;
      this._combo++;
      this._score += 2;
      this._life += 2;
      this._lastScore = 'marvelous';
    } else
    if (delta < 45) { // Perfect
      this._perfect++;
      this._combo++;
      this._score += 2;
      this._life += 2;
      this._lastScore = 'perfect';
    } else
    if (delta < 90) { // Great
      this._great++;
      this._combo++;
      this._score += 1;
      this._life += 2;
      this._lastScore = 'great';
    } else
    if (delta < 135) { // Good
      this._good++;
      this._combo = 0;
      this._lastScore = 'good';
    } else
    if (delta < 150) { // Bad
      this._bad++;
      this._combo = 0;
      this._life -= 2;
      this._score -= 4;
      this._lastScore = 'bad';
    } else
    if (delta < 180) { // Boo
      this._boo++;
      this._combo = 0;
      this._life -= 2;
      this._score -= 4;
      this._lastScore = 'boo';
    } else {           // Poor
      this._poor++;
      this._combo = 0;
      this._life -= 8;
      this._score -= 8;
      this._lastScore = 'miss';
    }
  }

  public miss() {
      this._poor++;
      this._combo = 0;
      this._life -= 8;
      this._score -= 8;
      this._lastScore = 'miss';
  }

  public drawSplash(canvas: HTMLCanvasElement) {
    if (this._lastScore) {
      this._drawLast(canvas);
    }
    if (this._combo) {
      this._drawCombo(canvas);
    }
  }

  private _drawLast(canvas: HTMLCanvasElement) {
      let mid = canvas.height / 2 - 40;
      let cxt = canvas.getContext('2d');
      cxt.save();
      cxt.font = '50px Helvetica';
      cxt.textAlign = 'center';
      cxt.fillStyle = '#000';
      cxt.strokeText(this._lastScore, 350, mid);
      cxt.fillStyle = '#000';
      let grad = cxt.createLinearGradient(0, mid - 20, 0, mid + 20);
      grad.addColorStop(0, 'white');
      grad.addColorStop(1, 'black');
      cxt.fillStyle = grad;
      cxt.fillText(this._lastScore, 350, mid);
      cxt.restore();
  }

  private _drawCombo(canvas: HTMLCanvasElement) {
      let mid = canvas.height / 2;
      let cxt = canvas.getContext('2d');
      cxt.save();
      cxt.font = '40px Helvetica';
      cxt.textAlign = 'center';
      cxt.fillStyle = '#000';
      cxt.strokeText('Combo ' + this._combo, 350, mid);
      cxt.fillStyle = '#000';
      let grad = cxt.createLinearGradient(0, mid - 20, 0, mid + 20);
      grad.addColorStop(0, 'white');
      grad.addColorStop(1, 'black');
      cxt.fillStyle = grad;
      cxt.fillText('Combo ' + this._combo, 350, mid);
      cxt.restore();
  }
}
