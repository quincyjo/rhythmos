import {Injectable} from '@angular/core';
import {StepsType, DifficultyType} from '../shared/types/index';
import {Song, SongData, SongMetadata, SongChart} from '../shared/classes/index';
import {DatabaseService, SscReader, SmReader} from '../services/index';
import {SONGS} from './mock-songs';


/**
 * Entry point for songs storage. Exposes the objectStores in context of the app, and resolves
 * dependencies between them. Also maintains local cache of objects and retires data urls.
 * Knowledge of the storage structure should be invisible beyond this model.
 */
@Injectable()
export class SongsModel {
  private _songs: Array<Song>;
  private _objectUrls: Array<any>;
  private _sscReader: SscReader = new SscReader();

  constructor(private _database: DatabaseService) {
    this._objectUrls = [];
  }

  /**
   * Fetchs all songs and returns them. Does not resolve references.
   * @return {Promise<any>} Resolves to the array of songs.
   */
  public getSongs(): Promise<Array<Song>> {
    let promise = new Promise<any>((resolve, reject) => {
      if (this._songs) {
        resolve(this._songs);
      } else {
        this._fetchSongsFromDatabase().then(() => {
          resolve(this._songs);
        });
      }
    });
    return promise;
  }

  /**
   * Retreives a song by key.
   * @param  {any}          key Target key.
   * @return {Promise<any>}     Resolves to the requested song. Logs error on failure. Does not
   *                            reject.
   */
  public getSongByKey(key: any): Promise<Song> {
    let promise = new Promise<any>((resolve, reject) => {
      // Check cached songs
      let local = this._songs.find(
        (song) => { return song.id === key; }
      );
      if (local) {
        resolve(local);
      } else {// Not stored, query DB
        this._database.getByKey('songs', key).then((song) => {
          this._songs.push(song);
          resolve(song);
        }, (error) => {
          this._init().then(() => {
            this.getSongByKey(key).then((song) => {
              this._songs.push(song);
              resolve(song);
            });
          }, (error) => {
            console.log("Failed to initiate database: ", error);
          });
        });
      }
    });
    return promise;
  }

  /**
   * Returns a valid object URL to the request attribut of the song referenced by key. If one does
   * not already exists, it is created. Live song is then updated with valid object url.
   * @param  {any}          key  ID of the song reference.
   * @param  {any}          name Attribute name of the song
   * @return {Promise<any>}      Resolves to the object url. Log error on failure. Does not reject.
   */
  public getObjectUrl(key: any, name: any): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      // Check cached object urls
      let local = this._objectUrls.find((url) => {
        return (url.id === key && url.name === name);
      });
      if (local) {
        resolve(local);
      } else { // Not store, query DB
        this._getBlob(key, name).then((blob) => {
          // Create data url
          let URL = window.URL;
          let dataUrl = URL.createObjectURL(blob.blob);
          // Store to be retired
          this._objectUrls.push(dataUrl);
          this.getSongByKey(key).then((song) => {
            song.getData()[name] = dataUrl;
          });
          // Ensure the song is loaded and resolve the link
          resolve(dataUrl);
        }, (error) => {
          console.log(error);
        });
      }
    });
    return promise;
  }

  public getNotes(key: any, stepstype: StepsType, difficulty: DifficultyType): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      this._database.getByKey('songCharts', [key, stepstype, difficulty]).then((chart) => {
        resolve(chart.notes);
      }, (error) => {
        console.log('Filed to get chart: ', error);
      });
    });
    return promise;
  }

  /**
   * Adds a new song with references to the database.
   * @param  {any}          song Song to be stored.
   * @return {Promise<any>}      Resolves on success, logs error on failure. Does not reject.
   */
  public addSong(song: Song, root?: string): Promise<any> {
    // Currently convoluted due to TS not probably evaluating types of resolved values from
    // Promise.all.
    let promise = new Promise<any>((resolve, reject) => {
      let dblobs, dcharts;
      let promises: Array<Promise<any>> = [];
      // Push a promise to detatch blobs
      promises.push(new Promise<any>((resolve, reject) => {
        this._detatchBlobs(song.getData(), root).then((blobs) => {
          dblobs = blobs;
          resolve();
        });
      }));
      // Push a promise to detatch charts
      promises.push(new Promise<any>((resolve, reject) => {
        this._detatchCharts(song).then((charts) => {
          dcharts = charts;
          resolve();
        });
      }));
      Promise.all(promises).then((values) => {
        // Done detatching expensive resources, add striped song to DB
        this._database.add('songs', song).then((keypair) => {
          let promises: Array<Promise<any>> = [];
          // Add the detatched blobs to the blobs db
          for (let blob of dblobs) {
            if (blob) {
              promises.push(this._addBlob(blob.value, keypair.key, blob.key))
            }
          }
          // Add the detatched charts to the chart db
          for (let chart of dcharts) {
            if (chart) {
              promises.push(this._addChart(chart.value, keypair.key, chart.stepstype, chart.difficulty));
            }
          }
          // Striped song and detatched assets stored, resolve to completion
          Promise.all(promises).then(() => {resolve();});
        });
      });
    });
    return promise;
  }

  /**
   * Retreives a blob from the blob objectStore or local cache if available.
   * @param  {any}          key  ID of the reference song.
   * @param  {any}          name Attribute name of blob in reference song.
   * @return {Promise<any>}      Resolves to the request blob with reference attributes. Raw blob
   *                             blob stored in the blob attribute. Logs error on filure. Does not
   *                             reject.
   */
  private _getBlob(key: any, name: any): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      this._database.getByKey('songBlobs', [key, name]).then((blob) => {
        resolve(blob);
      }, (error) => {
        console.log('Failed to fetch blob: ', error);
      });
    });
    return promise;
  }

  /**
   * Adds the given blob into the blob objectStore.
   * @param  {any}          blob The blob to be store.
   * @param  {any}          id   The id of the song the blob resolved to.
   * @param  {any}          name The attribute name of the blob.
   * @return {Promise<any>}      Resolved to the keypair on success, logs an error on failure. Does
   *                             not reject.
   */
  private _addBlob(blob: any, id: any, name: any): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      this._database.add('songBlobs', {
        id: id,
        name: name,
        blob: blob
      }).then((keypair) => {
        resolve(keypair);
      }, (error) => {
        console.log('Failed to add blob to database: ', error);
      });
    });
    return promise;
  }

  private _addChart(notes: any, id: any, stepstype: StepsType, difficulty: DifficultyType) {
    let promise = new Promise((resolve, reject) => {
      this._database.add('songCharts', {
        id: id,
        stepstype: stepstype,
        difficulty: difficulty,
        notes: notes
      }).then((keypair) => {
        resolve(keypair);
      }, (error) => {
        console.log('Failed to add chart to database: ', error);
      })
    });
    return promise;
  }

  /**
   * Initializes the object stores, creating them if needed. Fills them with base data if created.
   * @return {Promise<any>} Resolves once initiation is complete, reject if database error occured.
   */
  private _init(): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
    //this._database.deleteDB().then(() => {
      let fill: boolean = false;
      this._database.createStore(1, (event) => { // Create objectStore
        // Song store
        let objectStore = event.currentTarget.result.createObjectStore(
          'songs', {keyPath: 'id', autoIncrement: true});
        objectStore.createIndex('metadata', 'metedata', {unique: false});
        objectStore.createIndex('data', 'data', {unique: false});
        objectStore.createIndex('charts', 'charts', {unique: false});
        objectStore.createIndex('other', 'other', {unique: false});
        // Blob store
        let blobStore = event.currentTarget.result.createObjectStore(
          'songBlobs', {keyPath: ['id', 'name']});
        blobStore.createIndex('blob', 'blob', {unique: false});
        // Chart store
        let chartStore = event.currentTarget.result.createObjectStore(
          'songCharts', {keyPath: ['id', 'stepstype', 'difficulty']}
        );
        chartStore.createIndex('notes', 'notes', {unique: false});
        fill = true;
      }).then( () => { // Resolve
        this._songs = [];
        if (fill) { // If initiated, fill with moch data
          this._fillMockData().then(() => {
            resolve();
          });
        } else {
          resolve();
        }
      }, (error) => {
        reject(error);
      });
    });
    //});
    return promise;
  }

  private _fillMockData(): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      let promises: Promise<any>[] = [];
      let urls = [
        'https://raw.githubusercontent.com/stepmania/stepmania/master/Songs/StepMania%205/Goin\'%20Under/Goin\'%20Under.ssc',
        'https://raw.githubusercontent.com/stepmania/stepmania/master/Songs/StepMania%205/MechaTribe%20Assault/Mecha-Tribe%20Assault.ssc',
        'https://raw.githubusercontent.com/stepmania/stepmania/master/Songs/StepMania%205/Springtime/Springtime.ssc'
      ];
      for (let url of urls) {
        promises.push(new Promise<any>((resolve, reject) => {
          let root;
          if (url.lastIndexOf('/') > -1) {
            root = url.substr(0, url.lastIndexOf('/') + 1);
          }
          this._sscReader.readFromUrl(url).then((ssc) => {
            let song = new Song(ssc);
            console.log(ssc, song);
            this.addSong(song, root).then(() => {
              resolve();
            });
          });
        }));
      }
      Promise.all(promises).then(() => {
        resolve();
      }, (error) => {
        console.log(error);
      });
    });
    return promise;
  }

  /**
   * Detatched the chart notes for the given chart and detatches it from
   * chart, setting the attribut to false or true whether or not the chart
   * was resolved.
   * @param  {SongChart}         chart The chart to fetch the notes from.
   * @return {Promise<any>}      Resolved to the blob if able, resolves to
   *                             void if no notes, and reject if invalid
   *                             attribute.
   */
  private _detatchChart(chart: SongChart): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      if (chart.notes) {
        resolve({
          stepstype: chart.stepstype,
          difficulty: chart.difficulty,
          value: chart.notes
        });
        chart.notes = true;
      } else {
        chart.notes = false;
        resolve(false);
      }
    });
    return promise;
  }

  /**
   * Detatches notes for all charts in the given song and resolves to an array
   * of the notes with steptstype, difficultye, and value, the attributes needed
   * to store the chart into the chart objectStore.
   * @param  {Song}         song The song to detatch the nots from.
   * @return {Promise<any>}      Resolves to an array of objects with notes and key values.
   */
  private _detatchCharts(song: Song): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      let promises: Promise<any>[] = [];
      for (let chart of song.getCharts()) {
        promises.push(this._detatchChart(chart));
      }
      Promise.all(promises).then((charts) => {
        resolve(charts);
      }, (error) => {
        console.log(error);
      });
    });
    return promise;
  }

  /**
   * Resolves the blob for the attribut of the given name and detatches it from
   * song, setting the attribut to false or true whether or not the blob
   * was resolved.
   * @param  {any}          song The song to fetch the blob from.
   * @param  {string}       name The attribut to be resolved and detatched.
   * @return {Promise<any>}      Resolved to the blob if able, resolves to
   *                             void if no blob, and reject if invalid
   *                             attribute. Logs error on XHR failure.
   */
  private _detatchBlob(data: SongData, name: string, root?: string): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      if (data[name]) {
        // TODO: generate path relatively if remote file
        let path = root ? root + data[name] : data[name];
        this.getBlobFromUrl(path).then((blob) => {
          data[name] = true;
          resolve({
            key: name,
            value: blob,
            path: path
          });
        }, (error) => {
          console.log(error);
        });
      } else {
        data[name] = false;
        resolve(false);
      }
    });
    return promise;
  }

  /**
   * Fetches needed blobs from song, detatching them and resolving to a list
   * of blobgs to be added to blob store.
   * @param  {any}          song Song to be fetched upon.
   * @return {Promise<any>}      Resolved to array of blobs or logs error on
   *                             failure.
   */
  private _detatchBlobs(data: SongData, root?: string): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      let promises: Promise<any>[] = [];
      for (let key in data) {
        promises.push(this._detatchBlob(data, key, root));
      }
      Promise.all(promises).then( (blobs) => {
        resolve(blobs);
      }, (error) => {
        console.log(error);
      });
    });
    return promise;
  }

  private _fetchSongsFromDatabase(): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      this._database.getAll('songs').then(
        (songs) => {
          songs.forEach((song) => {
            // If the songs in not in already cached songs, add it
            if (!this._songs.find((elem) => {
              return (elem.id === song.id);
            })) {
              this._songs.push(new Song(song));
            }
          })
          resolve();
        }, (error) => {
          this._init().then(() => {
            this._fetchSongsFromDatabase().then(() => {
              resolve();
            });
          }, (error) => {
            console.log('Failed to initiate database', error);
          });
        }
      );
    });
    return promise;
  }

  public getBase64FromImageUrl(url: string) {
    let promise = new Promise<any>((resolve, reject) => {
      let img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = () => {
        let canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        let dataURL = canvas.toDataURL('image/png');
        // dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
        resolve(dataURL);
      };
      img.src = url;
    });
    return promise;
  }

  /**
   * Retreives a Blob from the given url.
   * @param  {string}       url The URL to be requested.
   * @return {Promise<any>}     Resolves to the blob. Reject with error if XHR reqeust failed.
   */
  public getBlobFromUrl(url: string): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest(),
          blob: any;
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          blob = xhr.response;
          resolve(blob);
        } else {
          reject('XMLHttpRequest filed with code: ' + xhr.status);
        }
      }, false);
      xhr.send();
    });
    return promise;
  }
}
