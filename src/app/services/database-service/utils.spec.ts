import { utils } from './utils';

describe('utils', () => {
  it('#defineIndex should create object with given name keypath equal to name, and empy options', () => {
    expect(utils.defineIndex('name')).toEqual({
      'name': 'name',
      'keyPath': 'name',
      'optionalParameters': {}
    })
  });

  it('#defineIndex should create object with given name and keypath and empty options', () => {
    expect(utils.defineIndex('name', 'keyPath')).toEqual({
      'name': 'name',
      'keyPath': 'keyPath',
      'optionalParameters': {}
    })
  });

  it('#defineIndex should create object with given name and keypath, and options', () => {
    expect(utils.defineIndex('name', 'keyPath', {'unique': true})).toEqual({
      'name': 'name',
      'keyPath': 'keyPath',
      'optionalParameters': {
        'unique': true
      }
    })
  });

  it('#defineStore should create a store with given name and indices and empty options', () => {
    expect(utils.defineStore('name', [utils.defineIndex('indexName')]))
    .toEqual({
      'name': 'name',
      'indices': [{
        'name': 'indexName',
        'keyPath': 'indexName',
        'optionalParameters': {}
      }],
      'optionalParameters': {}
    })
  });

  it('#defineStore should create a store with given name and indices and options', () => {
    expect(utils.defineStore('name', [utils.defineIndex('indexName')], {'option': 42}))
    .toEqual({
      'name': 'name',
      'indices': [{
        'name': 'indexName',
        'keyPath': 'indexName',
        'optionalParameters': {}
      }],
      'optionalParameters': {
        'option': 42
      }
    })
  });
});
