import {Injectable} from '@angular/core';

@Injectable()
export class DatabaseService {
  private _utils: Utils;
  private _wrapper: DBWrapper;

  constructor() {
    this._utils = new Utils();
    this._wrapper = new DBWrapper('rhythmos', 1);
  }

  public deleteDB() {
    let promise = new Promise<any>((resolve, reject) => {
      let request = this._utils.indexedDB.deleteDatabase('rhythmos');
      request.onsuccess = (e) => {
        console.log('deleted DB');
        resolve();
      };
      request.onerror = (e) => {
        reject('error deleting database');
      };
    });
    return promise;
  }

  public createStore(version, upgradeCallBack): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      this._wrapper.dbVersion++;
      let request = this._utils.indexedDB.open(this._wrapper.dbName,
                                               this._wrapper.dbVersion);
      request.onsuccess = (e) => {
        this._wrapper.db = request.result;
        resolve();
      };
      request.onerror = (e) => {
        reject('IndexedDB error: ' + e.target.errorCode);
      };
      request.onupgradeneeded = (e) => {
        upgradeCallBack(e, this._wrapper.db);
      };
    });
    return promise;
  }

  public getByKey(store: string, key: any): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      this._wrapper.validateBeforeTransaction(store, reject);
      let transaction = this._wrapper.createTransaction({
          store: store,
          mode: this._utils.dbMode.readOnly,
          error: (e: Event) => {
            reject(e);
          },
          complete: (e: Event) => {
            resolve(result);
          }
        }),
        objectStore = transaction.objectStore(store),
        result,
        request;
      request = objectStore.get(key);
      request.onsuccess = (event) => {
        result = event.target.result;
      };
    });
    return promise;
  }

  public getAll(store: string): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      this._wrapper.validateBeforeTransaction(store, reject);
      let transaction = this._wrapper.createTransaction({
          store: store,
          mode: this._utils.dbMode.readOnly,
          error: (e: Event) => {
            reject(e);
          },
          complete: (e: Event) => {
            resolve(result);
          }
        }),
        objectStore = transaction.objectStore(store),
        result = [],
        request = objectStore.openCursor();
      request.onerror = (e) => {
        reject(e);
      };
      request.onsuccess = (event) => {
        var cursor = (<IDBOpenDBRequest>event.target).result;
        if (cursor) {
          result.push(cursor.value);
          cursor['continue']();
        }
      };
    });
    return promise;
  }

  public add(store: string, value: any, key?: any): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      this._wrapper.validateBeforeTransaction(store, reject);
      let request;
      let transaction = this._wrapper.createTransaction({
          store: store,
          mode: this._utils.dbMode.readWrite,
          error: (e: Event) => {
            reject(e);
          },
          complete: (e: Event) => {
            resolve({value: value, key: key});
          }
        }),
        objectStore = transaction.objectStore(store);
      request = key ? objectStore.add(value, key) : objectStore.add(value);
      request.onsuccess = (event) => {
        key = event.target.result;
      };
    });
    return promise;
  }

  public update(store: string, value: any, key: any): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      this._wrapper.validateBeforeTransaction(store, reject);
      let transaction = this._wrapper.createTransaction({
          store: store,
          mode: this._utils.dbMode.readWrite,
          error: (e: Event) => {
            reject(e);
          },
          complete: (e: Event) => {
            resolve(value);
          },
          abort: (e: Event) => {
            reject(e);
          }
        }),
        objectStore = transaction.objectStore(store);
      objectStore.put(value, key);
    });
    return promise;
  }

  public delete(store: string, key: any): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      this._wrapper.validateBeforeTransaction(store, reject);
      let transaction = this._wrapper.createTransaction({
          store: store,
          mode: this._utils.dbMode.readWrite,
          error: (e: Event) => {
            reject(e);
          },
          complete: (e: Event) => {
            resolve();
          },
          abort: (e: Event) => {
            reject(e);
          }
        }),
        objectStore = transaction.objectStore(store);
      objectStore['delete'](key);
    });
    return promise;
  }

  public openCursor(store: string, cursorCallback: (event) => void): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      this._wrapper.validateBeforeTransaction(store, reject);
      let transaction = this._wrapper.createTransaction({
          store: store,
          mode: this._utils.dbMode.readOnly,
          error: (e: Event) => {
            reject(e);
          },
          complete: (e: Event) => {
            resolve();
          },
          abort: (e: Event) => {
            reject(e);
          }
        }),
        objectStore = transaction.objectStore(store),
        request = objectStore.openCursor();
      request.onsuccess = (event) => {
        cursorCallback(event);
        resolve();
      };
    });
    return promise;
  }

  public clear(store: string, indexName: string, key: any): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      this._wrapper.validateBeforeTransaction(store, reject);
      let transaction = this._wrapper.createTransaction({
          store: store,
          mode: this._utils.dbMode.readWrite,
          error: (e: Event) => {
            reject(e);
          },
          complete: (e: Event) => {
            resolve();
          },
          abort: (e: Event) => {
            reject(e);
          }
        }),
        objectStore = transaction.objectStore(store);
      objectStore.clear();
      resolve();
    });
    return promise;
  }

  public getByIndex(store: string, indexName: string, key: any): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      this._wrapper.validateBeforeTransaction(store, reject);
      let transaction = this._wrapper.createTransaction({
          store: store,
          mode: this._utils.dbMode.readOnly,
          error: (e: Event) => {
            reject(e);
          },
          complete: (e: Event) => {
            resolve(result);
          },
          abort: (e: Event) => {
            reject(e);
          }
        }),
        result,
        objectStore = transaction.objectStore(store),
        index = objectStore.index(indexName),
        request = index.get(key);
      request.onsuccess = (event) => {
        result = (<IDBOpenDBRequest>event.target).result;
      };
    });
    return promise;
  }
}

class Utils {
  dbMode: DbMode;
  indexedDB: any;

  constructor() {
    this.indexedDB = window.indexedDB;
      this.dbMode = {
        readOnly: 'readonly',
        readWrite: 'readwrite'
      };
  }
}

interface DbMode {
  readOnly: string;
  readWrite: string;
}

class DBWrapper {
  public db: IDBDatabase;

  constructor(public dbName: string, public dbVersion: number) {
    this.db = null;
  }

  public validateStore(store: string) {
    return this.db.objectStoreNames.contains(store);
  }

  public validateBeforeTransaction(store: string, reject) {
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
    let txn: IDBTransaction = this.db.transaction(options.store, options.mode);
    txn.onerror = options.error;
    txn.oncomplete = options.complete;
    txn.onabort = options.abort;
    return txn;
  }
}
