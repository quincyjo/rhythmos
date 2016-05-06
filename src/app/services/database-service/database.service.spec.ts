import {describe, it, expect, inject, injectAsync, beforeEachProviders} from '@angular/core/testing';
import {DatabaseService} from './database.service';
import {SONGS} from '../song-provider/mock-songs';

describe('Database Service', () => {
  beforeEachProviders(() => [DatabaseService]);

  it('should create a store', injectAsync([DatabaseService], (service: DatabaseService) => {
    return new Promise<any>((pass, fail) => {
      service.createStore(1, (event) => {
        let objectStore = event.currentTarget.result.createObjectStore(
          'text', {keyPath: 'id', autoIncrement: true});
      }).then(
        (success) => {

        },
        (failure) => {
          fail();
        }
      );
    });
  }));
})
