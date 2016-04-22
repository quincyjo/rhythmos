import {Injectable} from 'angular2/core';
import {Song} from '../../shared/interfaces/song';
import {SONGS} from './mock-songs';

@Injectable()
export class DatabaseService {
  public name: string = 'Test';
  db: IDBDatabase;
  constructor() {
    let request = window.indexedDB.open("TestDB", 14);
    request.onupgradeneeded = (event) => {
        this.db = (<IDBRequest>event.target).result;
        if (this.db.objectStoreNames.contains("songs")) {
          this.db.deleteObjectStore("songs");
        }
        let objectStore = this.db.createObjectStore("songs", {keyPath: "title"});
        objectStore.transaction.oncomplete = (event) => {
          let songObjectStore = this.db.transaction("songs", "readwrite").objectStore("songs");
          for (let i = 0; i < SONGS.length - 1; i++){
            songObjectStore.add(SONGS[i]);
          }
        }
    };
    request.onsuccess = (event) => {
      this.db = (<IDBRequest>event.target).result;
      this.db.onerror = (event) => {
        alert("Database Error");
      };
    };
    request.onerror = (event) => {
      this.db = null;
    };
  }

  getData(obStore, keyName, key) {
    return new Promise((resolve, reject) => {
      let request = this.db.transaction([obStore]).objectStore(obStore).get(key);
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
    });
  }

  putData(obStore, data) {
    return new Promise((resolve, reject) => {
      let objectStore = this.db.transaction(obStore, "readwrite").objectStore(obStore);
      objectStore.add(data);
    });
  }

  getAll(obStore) {
    return new Promise((resolve, reject) => {
      let request = this.db.transaction([obStore]).objectStore(obStore).openCursor();
      request.onsuccess = function(event) {
        let result = (<IDBRequest>event.target).result;
        if (result) { 
          resolve(result);
        }
        else {
          reject("Failed to retrieve data.")
        }
      }
    });
  }

  getSome(obStore, keyName, key1?, key2 = key1) {
    return new Promise((resolve, reject) => {
      let index = this.db.transaction([obStore])
        .objectStore(obStore).index(keyName);
      let keyRange = IDBKeyRange.bound(key1, key2);
      let request = index.openCursor(keyRange, null);
      request.onsuccess = (event) => {
        if ((<IDBRequest>event.target).result) {
          resolve(event.target.result);
        }
        else {
          reject("Failed to retrieve data.")
        }
      }
    });
  }
}
