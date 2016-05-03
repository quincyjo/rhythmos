import {Injectable} from 'angular2/core';
import {Song} from '../shared/interfaces/song';
import {DatabaseService} from '../services/database-service/database-service';
import {SONGS} from './mock-songs';

/**
 * Entry point for songs storage. Exposes the objectStores in context of the app, and resolves
 * dependencies between them. Also maintains local cache of objects and retires data urls.
 * Knowledge of the storage structure should be invisible beyond this model.
 */
@Injectable()
export class SongsModel {
  private _songs: Array<Song>;
  private _blobs: Array<any>;
  private _dataUrls: Array<any>;

  constructor(private _database: DatabaseService) {
    this._songs = [];
    this._blobs = [];
    this._dataUrls = [];
  }

  /**
   * Fetchs all songs and returns them. Does not resolve references.
   * @return {Promise<any>} Resolves to the array of songs.
   */
  public getSongs(): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      this._fetchSongs().then(() => {
        resolve(this._songs);
      });
    });
    return promise;
  }

  /**
   * Retreives a song by key.
   * @param  {any}          key Target key.
   * @return {Promise<any>}     Resolves to the requested song. Logs error on failure. Does not
   *                            reject.
   */
  public getSongByKey(key: any): Promise<any> {
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
          });
        });
      }
    });
    return promise;
  }

  /**
   * Returns a valid data URL to the request attribut of the song referenced by key. If one does
   * not already exists, it is created. Live song is then updated with valid data url.
   * @param  {any}          key  ID of the song reference.
   * @param  {any}          name Attribute name of the song
   * @return {Promise<any>}      Resolves to the data url. Log error on failure. Does not reject.
   */
  public getDataUrl(key: any, name: any): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      // Check cached dataUrls
      let local = this._dataUrls.find( (url) => {
        return (url.id === key && url.name === name);
      });
      if (local) {
        resolve(local);
      }
      // Not store, query DB
      this._getBlob(key, name).then((blob) => {
        // Create data url
        let URL = window.URL;
        let dataUrl = URL.createObjectURL(blob.blob);
        // Store to be retired
        this._dataUrls.push(dataUrl);
        this.getSongByKey(key).then((song) => {
          song[name] = dataUrl;
        });
        // Ensure the song is loaded and resolve the link
        resolve(dataUrl);
      }, (error) => {
        console.log(error);
      });
    });
    return promise;
  }

  /**
   * Adds a new song with references to the database.
   * @param  {any}          song Song to be stored.
   * @return {Promise<any>}      Resolves on success, logs error on failure. Does not reject.
   */
  public addSong(song: any): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      // Resolve and detatch blobs from song
      this._fetchBlobs(song).then((blobs) => {
        // Add song to song objectStore and get key to bind blobs
        this._database.add('songs', song).then((keypair) => {
          // Add all resolved blobs to blob objectStore
          let promises: Promise<any>[] = [];
          for (let blob of blobs) {
            if (blob) {
              promises.push(this._addBlob(blob.value, keypair.key, blob.key));
            }
          }
          Promise.all(promises).then((values) => {
            resolve();
          }, (error) => {
            console.log(error);
          });
        }, (error) => {
          console.log(error);
        });
      }, (error) => {
        console.log(error);
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
      // Check cached songs
      let local = this._blobs.find(
        (blob) => {
          return (blob.id === key && blob.name === name);
        }
      );
      if (local) { resolve(local); }
      // Not stored, query DB
      this._database.getByKey('songBlobs', [key, name]).then((blob) => {
        this._blobs.push(blob);
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
        console.log(error);
      });
    });
    return promise;
  }

  /**
   * Initializes the object stores, creating them if needed. Fills them with base data if created.
   * @return {Promise<any>} Resolves once initiation is complete, reject if database error occured.
   */
  private _init(): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
    this._database.deleteDB().then(() => {
      let fill: boolean = false;
      this._database.createStore(1, (event) => { // Create objectStore
        console.log('Creating songs');
        let objectStore = event.currentTarget.result.createObjectStore(
          'songs', {keyPath: 'id', autoIncrement: true});
        objectStore.createIndex('title', 'title', {unique: false});
        objectStore.createIndex('subtitle', 'subtitle', {unique: false});
        objectStore.createIndex('artist', 'artist', {unique: false});
        objectStore.createIndex('genre', 'genre', {unique: false});
        objectStore.createIndex('credit', 'credit', {unique: false});
        objectStore.createIndex('banner', 'banner', {unique: false});
        objectStore.createIndex('background', 'background', {unique: false});
        objectStore.createIndex('cdtitle', 'cdtitle', {unique: false});
        objectStore.createIndex('music', 'music', {unique: false});
        objectStore.createIndex('offset', 'offset', {unique: false});
        objectStore.createIndex('bpms', 'bpms', {unique: false});
        objectStore.createIndex('stops', 'stops', {unique: false});
        objectStore.createIndex('samplestart', 'samplestart', {unique: false});
        objectStore.createIndex('samplelength', 'samplelength', {unique: false});
        objectStore.createIndex('displaybpm', 'displaybpm', {unique: false});
        objectStore.createIndex('selectable', 'selectable', {unique: false});
        objectStore.createIndex('notes', 'notes', {unique: false});
        let blobStore = event.currentTarget.result.createObjectStore(
          'songBlobs', {keyPath: ['id', 'name']});
        blobStore.createIndex('blob', 'blob', {unique: false});
        fill = true;
      }).then( () => { // Resolve
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
    });
    return promise;
  }

  private _fillMockData(): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      let promises: Promise<any>[] = [];
      for (let song of SONGS) {
        promises.push(this.addSong(song));
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
   * Resolves the blob for the attribut of the given name and detatches it from
   * song, setting the attribut to false or true whether or not the blob
   * was resolved.
   * @param  {any}          song The song to fetch the blob from.
   * @param  {string}       name The attribut to be resolved and detatched.
   * @return {Promise<any>}      Resolved to the blob if able, resolves to
   *                             void if no blob, and reject if invalid
   *                             attribute. Logs error on XHR failure.
   */
  private _fetchBlob(song: any, name: string): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      if (song[name]) {
        this.getBlobFromUrl(song[name]).then((blob) => {
          let path = song[name];
          song[name] = true;
          resolve({
            key: name,
            value: blob,
            path: path
          });
        }, (error) => {
          console.log(error);
        });
      } else {
        song[name] = false;
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
  private _fetchBlobs(song: any): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      let promises: Promise<any>[] = [];
      let names = ['banner', 'background', 'music'];
      for (let name of names) {
        promises.push(this._fetchBlob(song, name));
      }
      Promise.all(promises).then( (blobs) => {
        resolve(blobs);
      }, (error) => {
        console.log(error);
      });
    });
    return promise;
  }

  private _fetchSongs(): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      this._database.getAll('songs').then(
        (songs) => {
          this._songs = songs;
          resolve();
        }, (error) => {
          this._init().then(() => {
            this._fetchSongs().then(() => {
              resolve();
            });
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
