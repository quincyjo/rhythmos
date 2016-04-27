import {describe, it, expect, inject, injectAsync, beforeEachProviders} from 'angular2/testing';
import {DatabaseService} from './database-service';
import {SONGS} from '../song-provider/mock-songs';

describe('Database Service', () => {
  beforeEachProviders(() => [DatabaseService]);

  it('should have a name', inject([DatabaseService], (service) => {
    expect(service.name).toBe('Test');
  }));

  it('should find', injectAsync([DatabaseService], (service) => {
    let store = "songs";
    let keyName = "title";
    let testTitle = SONGS[1]['title'];
    let getData = service.get(store, keyName, testTitle);
    let test = getData.then(song => {
      expect(song['title']).toEqual(testTitle);
    })
    return test;
  }));

  it('should add and find', injectAsync([DatabaseService], (service) => {
    let store = "songs";
    let keyName = "title";
    let testTitle = SONGS[2]['title'];
    service.put(store, SONGS[2]);
    let getData = service.get(store, keyName, testTitle);
    let test = getData.then(song => {
      expect(song).toEqual(SONGS[2]);
    });
    return test;
  }));

  it('should find all', injectAsync([DatabaseService], (service) => {
    let store = "songs";
    let getAll = service.getAll(store);
    let test = getAll.then(songs => {
      expect(songs.length).toEqual(3);
      expect(songs[0]).toEqual(SONGS[0]);
    });
    return test;
  }));

  it('should find some', injectAsync([DatabaseService], (service) => {
    let store = "songs";
    let index = 'id';
    let testKey1 = 0;
    let testKey2 = 1;
    let getSome = service.getAll(store, index);
    let test = getSome.then(songs => {
      expect(songs.length).toEqual(3);
      expect(songs[0]).toEqual(SONGS[0]);
      expect(songs[1]).toEqual(SONGS[1]);
    });
    return test;
  }));

  it('should delete', injectAsync([DatabaseService], (service) => {
    let store = "songs";
    let index = 'id';
    let testKey = 2;
    service.delete(store, index, testKey);
    let getSome = service.getAll(store);
    let test = getSome.then(songs => {
      expect(songs.length).toEqual(2);
      expect(songs[0]).toEqual(SONGS[0]);
      expect(songs[1]).toEqual(SONGS[1]);
    });
    return test;
  }));

  it('should delete all', injectAsync([DatabaseService], (service) => {
    let store = "songs";
    let index = 'id';
    let testKey = 2;
    service.deleteAll(store);
    let getSome = service.getAll(store);
    let test = getSome.then(songs => {
      expect(songs.length).toEqual(0);
    });
    return test;
  }));

  it('should add all', injectAsync([DatabaseService], (service) => {
    let store = "songs";
    service.putAll(store, SONGS);
    let getAll = service.getAll(store);
    let test = getAll.then(songs => {
      expect(songs.length).toEqual(3);
      expect(songs[0]).toEqual(SONGS[0]);
      expect(songs[1]).toEqual(SONGS[1]);
    });
    return test;
  }));
})
