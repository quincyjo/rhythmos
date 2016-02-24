import {describe, it, expect, beforeEachProviders, inject} from 'angular2/testing';
import {RhythmosApp} from '../app/rhythmos';

beforeEachProviders(() => [RhythmosApp]);

describe('App: Rhythmos', () => {
  it('should have the `defaultMeaning` as 42', inject([RhythmosApp], (app: RhythmosApp) => {
    expect(app.defaultMeaning).toBe(42);
  }));

  describe('#meaningOfLife', () => {
    it('should get the meaning of life', inject([RhythmosApp], (app: RhythmosApp) => {
      expect(app.meaningOfLife()).toBe('The meaning of life is 42');
      expect(app.meaningOfLife(22)).toBe('The meaning of life is 22');
    }));
  });
});

