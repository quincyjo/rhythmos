import {
    beforeEachProviders,
    describe,
    expect,
    iit,
    inject,
    it,
    injectAsync,
    fakeAsync,
    tick
} from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/compiler/testing';
import {SMUTILS} from './utils';
import {StepsType, DifficultyType} from '../../shared/types';

describe('SMUTILS', () => {
  let utils;

  beforeAll(() => {
    utils = SMUTILS;
  });

  describe('stripFile', () => {
    it('should strip comments', () => {
      let input = '// -- This is a commnet! --\rcontent';
      let target = 'content';
      let output = utils.stripFile(input);
      expect(output).toEqual(target);
    });

    it('should strip whitespace', () => {
      let input = '  This has\rlots\tof\nwhitespace! ';
      let target = 'This haslotsofwhitespace!';
      let output = utils.stripFile(input);
      expect(output).toEqual(target);
    });
  });

  describe('splitTags', () => {
    it('should split tags', () => {
      let input = '#ONE:one;#TWO:two;#THREE:three;';
      let target = [
        ['#ONE', 'one'],
        ['#TWO', 'two'],
        ['#THREE', 'three']
      ];
      let output = utils.splitTags(input);
      expect(output).toEqual(target);
    });
  });

  describe('attributeFromTag', () => {
    it('should convert tags to attributes', () => {
      let input = [
        '#ONE', '#TWO', '#THREE'
      ];
      let target = [
        'one', 'two', 'three'
      ];
      let output = [];
      input.forEach((elem) => {
        output.push(utils.attributeFromTag(elem));
      });
      expect(output).toEqual(target);
    });
  });

  describe('parseValue', () => {
    it('should leave simple meta as a string', () => {
      let input = [
        {tag: 'title', value: 'A Song'},
        {tag: 'subtitle', value: 'Some thing witty'},
        {tag: 'artist', value: 'Some person'},
        {tag: 'titletranslit', value: 'Still a song'},
        {tag: 'subtitletranslit', value: 'Still witty'},
        {tag: 'artisttranslit', value: 'Still a person'},
        {tag: 'genre', value: 'You\'ve probably never heard of it...'},
        {tag: 'origin', value: 'me, myself, and I'},
        {tag: 'credit', value: 'also me'},
        {tag: 'cdtitle', value: 'Space Dog Pirates'}
      ];
      input.forEach((elem) => {
        let output = utils.parseValue(elem.tag, elem.value);
        expect(output).toEqual(elem.value);
      });
    });

    it('should strip trailing white space', () => {
      let input = [
        {tag: 'title', value: '    wow', target: 'wow'},
        {tag: 'subtitle', value: 'such whitespace  ', target: 'such whitespace'},
        {tag: 'artist', value: '  \t much stupid  \r\n ', target: 'much stupid'},
      ];
      input.forEach((elem) => {
        let output = utils.parseValue(elem.tag, elem.value);
        expect(output).toEqual(elem.target);
      });
    });

    it('should parse somethings as numbers', () => {
      let input = [
        {tag: 'version', value: '0.83', target: 0.83},
        {tag: 'offset', value: '1', target: 1},
        {tag: 'samplestart', value: '1.359', target: 1.359},
        {tag: 'samplelength', value: '213.1', target: 213.1},
        {tag: 'meter', value: '10', target: 10},
      ];
      input.forEach((elem) => {
        let output = utils.parseValue(elem.tag, elem.value);
        expect(typeof output === 'number').toBeTruthy();
        expect(output).toEqual(elem.target);
      });
    });

    it('should parse somethings as an array of numbers', () => {
      let input = "1,2,3,4,5.5";
      let target = [1, 2, 3, 4, 5.5];
      let output = utils.parseValue('radarvalues', input);
      expect(Array.isArray(output)).toBeTruthy();
      expect(typeof output[0]).toEqual('number');
      expect(output).toEqual(target);
    });

    it('should parse somethings as beat value object arrays', () => {
      let tags = ['bpms', 'stops', 'delays', 'warps', 'tickcounts', 'combos', 'scrolls', 'fakes'];
      let input = '0=10,10=100,20=115,30=6.5';
      let target = [{beat: 0, value: 10}, {beat: 10, value: 100},
                    {beat: 20, value: 115}, {beat: 30, value: 6.5}];
      let output;
      tags.forEach((tag) => {
        output = utils.parseValue(tag, input);
        expect(Array.isArray(output)).toBeTruthy();
        expect(typeof output[0]).toEqual('object');
        expect(output).toEqual(target);
      });
    });

    it('should parse stepstype as a StepsType', () => {
      let input: {tag: string, value: string, target: StepsType}
               = {tag: 'stepstype', value: 'dance-single', target: 'dance-single'};
      let output = utils.parseValue(input.tag, input.value);
      expect(output).toEqual(input.target);
    });

    it('should parse difficulty as a DifficultyType', () => {
      let input: {tag: string, value: string, target: DifficultyType}
               = {tag: 'difficulty', value: 'Beginner', target: 'Beginner'};
      let output = utils.parseValue(input.tag, input.value);
      expect(output).toEqual(input.target);
    });
  });
});
