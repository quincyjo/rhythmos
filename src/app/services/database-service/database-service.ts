import {Injectable} from 'angular2/core';
import {Song} from '../../shared/interfaces/song';
import {SONGS} from '../song-provider/mock-songs';

@Injectable()
export class DatabaseService {
  public name: string = 'Test';
  private dbVer: number = 18;
  constructor() {
    let request = window.indexedDB.open("TestDB", this.dbVer);
    request.onupgradeneeded = (event) => {
      let db = (<IDBRequest>event.target).result;
      if (db.objectStoreNames.contains("songs")) {
        db.deleteObjectStore("songs");
      }
      let objectStore: IDBObjectStore = db.createObjectStore("songs", {keyPath: "id"});
      objectStore.createIndex('title', 'title', {unique: false});
      objectStore.createIndex('artist', 'artist', {unique: false});
      objectStore.transaction.oncomplete = (event) => {
        let songObjectStore = db.transaction("songs", "readwrite").objectStore("songs");
        for (let i = 0; i < SONGS.length - 1; i++){
          songObjectStore.add(SONGS[i]);
        }
      }
    };
  }

  get(obStore, index, key) {
    return new Promise((resolve, reject) => {
      let dbRequest = window.indexedDB.open("TestDB", this.dbVer);
      dbRequest.onsuccess = (event) => {
        let db = (<IDBRequest>event.target).result;
        let objectStore = db.transaction([obStore]).objectStore(obStore);
        let request;
        if (index == objectStore.keyPath) {
          request = objectStore.get(key);
        } else {
          request = objectStore.index(index).get(key);
        }
        request.onerror = (event) => {
          reject("error in read")
        };
        request.onsuccess = (event) => {
          let result = (<IDBRequest>event.target).result;
          if (result) {
            resolve(result);
          }
          else {
            reject("Failed to retrieve data.")
          }
        };
        request.onerror = () => {reject("Failed to retrieve data.")};
      };
      dbRequest.onerror = () => {reject("Failed to connect to database.")};
    });
  }
  getAll(obStore, index?, key1?, key2 = key1) {
    return new Promise((resolve, reject) => {
      let dbRequest = window.indexedDB.open("TestDB", this.dbVer);
      dbRequest.onsuccess = (event) => {
        let db: IDBDatabase = (<IDBRequest>event.target).result;
        let objectStore = db.transaction([obStore]).objectStore(obStore);
        if (!index) {
          index = objectStore.keyPath;
        }
        let keyRange;
        if (key1) {
          keyRange = IDBKeyRange.bound(key1, key2);
        }
        let request;
        if (index == objectStore.keyPath) {
          request = objectStore.openCursor(keyRange);
          request.onerror = () => {reject("Failed to retrieve data (keypath).")};
        } else {
          request = objectStore.index(index).openCursor(keyRange);
          request.onerror = () => {reject("Failed to retrieve data. (index)")};
        }
        let result: Song[] = [];
        request.onsuccess = (event) => {
          let cursor = request.result;
          if (cursor) {
            result.push(cursor.value);
            cursor.continue();
          } else {
            resolve(result);
          }
        };
      };
      dbRequest.onerror = () => {reject("Failed to connect to database.")};
    });
  }

  put(obStore, data) {
    return new Promise((resolve, reject) => {
      let dbRequest = window.indexedDB.open("TestDB", this.dbVer);
      dbRequest.onsuccess = (event) => {
        let db = (<IDBRequest>event.target).result;
        let objectStore = db.transaction(obStore, "readwrite").objectStore(obStore);
        objectStore.add(data);
      };
      dbRequest.onerror = () => {reject("Failed to connect to database.")};
    });
  }
  putAll(obStore, data) {
  return new Promise((resolve, reject) => {
    let dbRequest = window.indexedDB.open("TestDB", this.dbVer);
      dbRequest.onsuccess = (event) => {
        let db = (<IDBRequest>event.target).result;
        let objectStore = db.transaction(obStore, "readwrite").objectStore(obStore);
        for (let i = 0; i < data.length; i++){
          objectStore.add(data[i]);
        }
      };
      dbRequest.onerror = () => {reject("Failed to connect to database.")};
    });
  }

  delete(obStore, index,  key) {
    return new Promise((resolve, reject) => {
      let dbRequest = window.indexedDB.open("TestDB", this.dbVer);
      dbRequest.onsuccess = (event) => {
        let db = (<IDBRequest>event.target).result;
        let objectStore = db.transaction(obStore, "readwrite").objectStore(obStore);
        let request;
        if (index == objectStore.keyPath) {
          request = objectStore.delete(key);
        } else {
          request = objectStore.index(index).delete(key);
        }
        request.onerror = (event) => {
          reject("Could not delete " + key + " from " )
        };
      };
      dbRequest.onerror = () => {reject("Failed to connect to database.")};
    });
  }
  deleteAll(obStore, index?, key1?, key2 = key1) {
    return new Promise((resolve, reject) => {
      let dbRequest = window.indexedDB.open("TestDB", this.dbVer);
      dbRequest.onsuccess = (event) => {
        let db: IDBDatabase = (<IDBRequest>event.target).result;
        let objectStore = db.transaction(obStore, "readwrite").objectStore(obStore);
        if (!index) {
          index = objectStore.keyPath;
        }
        let keyRange;
        if (key1) {
          keyRange = IDBKeyRange.bound(key1, key2);
        }
        let request;
        if (index == objectStore.keyPath) {
          request = objectStore.openCursor(keyRange);
        } else {
          request = objectStore.index(index).openCursor(keyRange);
        }
        let result: Song[] = [];
        request.onsuccess = (event) => {
          let cursor = request.result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
          } else {
            resolve();
          }
        };
        request.onerror = () => {reject("Failed to delete data.")};
      };
      dbRequest.onerror = () => {reject("Failed to connect to database.")};
    });
  }
}
