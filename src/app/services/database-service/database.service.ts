import { Injectable } from '@angular/core';
import { utils } from './utils';

declare var window: any;

@Injectable()
export class DatabaseService {
  private _indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  private _IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
  private _IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
  private _wrapper: DBWrapper;

  constructor() {
    this._wrapper = new DBWrapper();
    this._wrapper.db = this._indexedDB;
    this._openDatabase(database.name, database.version, (event) => {
      this._createDatabase(event)
    });
  }

  /**
   * Inserts a new item into the given store.
   * If a key is not given, the keygen for the store will be used to generate
   * one.
   * If there is no keygen, the promise will reject on the error.
   * If a key is given and the store has a keygen, the promise will reject on
   * the error.
   * @param  {string}       store The target store.
   * @param  {any}          value The value to be inserted.
   * @param  {any}          key   The optional key.
   * @return {Promise<any>}       Promise that resolves or rejects on the event
   *                              returned by the IDBDatabase.
   */
  public addItem(store: string, value: any, key?: any): Promise<any> {
    let promise: Promise<any> = new Promise<any>((resolve, reject) => {
      let transaction: IDBTransaction = this._wrapper.createTransaction({
        store: store,
        mode: 'readWrite',
        error: (event) => {
          reject(event);
        },
        complete: (event) => {
          resolve(event);
        }
      });
      let objectStore = transaction.objectStore(store);
      let request = key ? objectStore.add(value, key) : objectStore.add(value);
      request.onsuccess = (event: any) => {
        key = event.target.result;
      };
    });
    return promise;
  }

  /**
   * Updates an existing item in the given store parameter with the given key
   * parameter to the given value parameter.
   * @param  {string}       store The target store.
   * @param  {any}          value The new value to be updated.
   * @param  {any}          key   The target key.
   * @return {Promise<any>}       Promise that resolves or rejects on the event
   *                              returned by the IDBDatabase.
   */
  public updateItem(store: string, value:any, key: any): Promise<any> {
    let promise: Promise<any> = new Promise<any>((resolve, reject) => {
      this._wrapper.validateBeforeTransaction(store, reject);
      let transaction:IDBTransaction = this._wrapper.createTransaction({
        store: store,
        mode: 'readWrite',
        error: (event) => {
          reject(event);
        },
        complete: (event) => {
          resolve(event);
        },
        abort: (event) => {
          reject(event);
        }
      });
      let objectStore:IDBObjectStore = transaction.objectStore(store);
      objectStore.put(value, key);
    });
    return promise;
  }

  public deleteItem(store: string, key: any): Promise<any> {
    let promise: Promise<any> = new Promise<any>((resolve, reject) => {
      this._wrapper.validateBeforeTransaction(store, reject);
      let transaction: IDBTransaction = this._wrapper.createTransaction({
        store: store,
        mode: 'readWrite',
        error: (event) => {
          reject(event);
        },
        complete: (event) => {
          resolve(event);
        },
        abort: (event) => {
          reject(event);
        }
      });
      let objectStore:IDBObjectStore = transaction.objectStore(store);
      objectStore.delete(key);
    });
    return promise;
  }

  /**
   * Deletes the database.
   * @return {Promise<any>} Rejects the event on error, resolves the event on success.
   */
  public deleateDatabase(): Promise<any> {
    let promise: Promise<any> = new Promise<any>((resolve, reject) => {
      let request: IDBOpenDBRequest = this._indexedDB.deleateDatabase(database.name);
      request.onerror = (event) => {
        utils.logError('Failed to delete database');
        reject(event);
      }
      request.onsuccess = (event) => {
        resolve(event);
      }
    });
    return promise;
  }

  /**
   * Creates the database described in the database object.
   * If A database already exists, this will throw an error.
   * Is means solely as an initial consturction onupdateneeded event callback.
   * @param  {Event}        event Event from an IDBOpenDBRequest
   * @return {Promise<any>}       Resolves once complete, reject event on error.
   */
  private _createDatabase(event): Promise<any> {
    console.log("Creating database...");
    let promise: Promise<any> = new Promise<any>((resolve, reject) => {
      let promises: Array<Promise<any>> = [];
      let db = event.target.result;
      // For each store defined...
      for (let store of database.stores) {
        let storePromise: Promise<any> = new Promise<any>((resolve, reject) => {
          console.log("Creating store '", store.name, "'");
          // Create the store.
          let objectStore = db.createObjectStore(store.name, store.optionalParameters);
          // For each index in the store...
          for (let index of store.indices) {
            console.log("Creating index '", index.name, "'");
            // Create the index.
            objectStore.createIndex(index.name, index.keyPath, index.optionalParameters);
          }
          // When store transaction is finished, resolve the promise.
          objectStore.transaction.oncomplete = () => { resolve() };
        });
        // Add the store promise to promises.
        promises.push(storePromise);
      }
      // Once all stores are done, resolve promise.
      Promise.all(promises).then(
        () => {
          resolve();
        }, (error) => {
          reject(error);
        });
    });
    return promise;
  }

  /**
   * Validates browser support of indexedDB.
   * @return {boolean} True if supported, false if not.
   */
  private _checkSupport(): boolean {
    return (this._indexedDB);
  }

  /**
   * Attempts to open the database with given name and version number. Logs
   * and rejects on error, logs and resolves on success, and calls the passed
   * onupgradeneeded function and then resolves on that on the onupgradeneeded
   * event.
   * @param  {string} name            Name of the target database.
   * @param  {number} version         Version of the target database.
   * @param  {(event} onupgradeneeded Functino called on the onupgradeneeded
   *                                  event.
   * @return {[type]}                 Promise, resolve on event if successfully
   *                                           opened, rejects if error occurs.
   */
  private _openDatabase(name: string,
                        version: number,
                        onupgradeneeded: (event) => void): Promise<any> {
    let promise: Promise<any> = new Promise<any>((resolve, reject) => {
      let request: IDBOpenDBRequest = this._indexedDB.open(name, version);
      request.onerror = (event) => {
        utils.logError(event);
        console.log(event);
        reject(event);
      };
      request.onsuccess = (event) => {
        resolve(event);
        console.log("Opened database successfully");
      };
      request.onupgradeneeded = (event) => {
        onupgradeneeded(event);
        resolve(event);
      };
    });
    return promise;
  }

}

class DBWrapper {
  public db: IDBDatabase;
  private _mode: string;

  constructor() { }

  public validateStore(store: string): boolean {
    return this.db.objectStoreNames.contains(store);
  }

  public validateBeforeTransaction(store: string, reject: any) {
    if (!this.db) { // No database created
      reject('No database has been created.');
    }
    if (!this.validateStore(store)) { // No object store created
      reject('Target objectStore uninitialized: ' + store);
    }
  }

  public createTransaction(options: {
                             store: string, mode: string,
                             error: (e: Event) => any,
                             complete: (e: Event) => any,
                             abort?: (e: Event) => any}): IDBTransaction {
    let transaction: IDBTransaction = this.db.transaction(options.store, options.mode);
    transaction.onerror = options.error;
    transaction.oncomplete = options.complete;
    transaction.onabort = options.abort;
    return transaction;
  }
}

let database = {
  'name': 'blah',
  'version': 1,
  'stores': [
    utils.defineStore('songs', [
      utils.defineIndex('title'),
      utils.defineIndex('artist')
    ])
  ]
}
