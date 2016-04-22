import {describe, it, expect, inject, injectAsync, beforeEachProviders} from 'angular2/testing';
import {DatabaseService} from './database-service';
import {SONGS} from './mock-songs';

describe('Database Service', () => {
  beforeEachProviders(() => [DatabaseService]);

  it('should have a name', inject([DatabaseService], (service) => {
    expect(service.name).toBe('Test');
  }));

  it('should find', injectAsync([DatabaseService], (service) => {
    let store = "songs";
    let keyName = "title";
    let testTitle = "Goin' Under";
    return service.getData(store, keyName, testTitle)
      .then(song => {
        expect(song['title']).toEqual(testTitle + "ljklj;lj;");
      });
  }));

  it('should add and find', injectAsync([DatabaseService], (service) => {
    let store = "songs";
    let keyName = "title";
    service.putData(store, SONGS[2]);
    return service.getData(store, keyName, SONGS[2]['title'])
      .then(song => {expect(song).toEqual(SONGS[2])});
  }));

  it('should find all', injectAsync([DatabaseService], (service) => {
    let store = "songs";
    return service.getAll(store)
      .then(songs => {expect(songs[0]).toEqual(SONGS[0])});
  }));

  it('should find some', injectAsync([DatabaseService], (service) => {
    let store = "songs";
    let keyName = "artist";
    let testKey = "NegaRen";
    return service.getSome(store, keyName, testKey, testKey)
      .then(songs => {expect(songs[0]['artist']).toBe(5)});
  }));
})
