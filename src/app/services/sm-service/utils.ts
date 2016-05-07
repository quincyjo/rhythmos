import {StepsType, DifficultyType} from '../../shared/types/index';

let parseValue = (tag: string, value: string) => {
  // Get method from tag map.
  let func = tagMap[tag];
  if (func == null) { // Target value is a string, string trailing whitespace and return.
    return value.replace(/^\s+|\s+$/g, '');
  } else if (func === false) { // Unexpected tag.
    console.log("Error: Got unexpected tag: " + tag);
    return false;
  } else if (func == undefined) { // Unknown tag, try and pasrse it.
    func = tagMap.default;
  }
  return func(value);
}

let parseNumber = (value: string): number => {
  return parseFloat(value);
}

let parseBoolean = (value: string): boolean => {
  if (value.toLowerCase() == 'no') {
    return false;
  } else if (value.toLowerCase() == 'yes') {
    return true;
  }
  return false;
}

let parseBeatValueArray = (value: string): Array<{beat: number, value: number}> => {
  let a: Array<{beat: number, value: number}> = [];
  if (value == '') return a;
  value.split(',').map((elem) => {
    let values = elem.split('=');
    a.push({
      beat: parseFloat(values[0]),
      value: parseFloat(values[1])
    });
  });
  return a;
}

let parseLabelValueArray = (value: string): Object => {
  let map = {};
  if (value == '') return map;
  value.split(',').map((elem) => {
    let values = elem.split('=');
    let measure = parseFloat(values[0]);
    let name = values[1];
    let key = name.replace(/\s/g, '').toLowerCase();
    let entry = {
      name: name,
      measure: measure
    };
    map[key] = entry;
  });
  return map;
}

let parseMeasureFractionArray = (value: string): Array<{beat: number,
                                                        numerator: number,
                                                        denominator: number}> => {
  let a: Array<{beat: number, numerator: number, denominator: number}> = [];
  if (value == '') return a;
  value.split(',').map((elem) => {
    let values = elem.split('=');
    let measure = parseFloat(values[0]);
    let numerator = parseFloat(values[1]);
    let denominator = parseFloat(values[2]);
    a.push({
      beat: measure,
      numerator: numerator,
      denominator: denominator
    });
  });
  return a;
}

let parseNumberArray = (value: string): Array<number> => {
  let a: Array<number> = [];
  value.split(',').map((elem) => {
    a.push(parseFloat(elem));
  });
  return a;
}

let parseTwoDimNumberArray = (value: string): Array<Array<number>> => {
  let a: Array<Array<number>> = [];
  value.split(',').map((row) => {
    let b: Array<number> = [];
    row.split('=').map((column) => {
      b.push(parseFloat(column));
    });
    a.push(b);
  });
  return a;
}

let parseStepsType = (value: string): StepsType => {
  return <StepsType>value.replace(/^\s+|\s+$/g, '');
}

let parseDifficultyType = (value: string): DifficultyType => {
  return <DifficultyType>value.replace(/^\s+|\s+$/g, '');
}

let parseDefault = () => {
  return false;
}

let getTextFromUrl = (url: string): Promise<string> => {
  let promise = new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest(),
        text: string;
    xhr.open('GET', url, true);
    xhr.responseType = 'text';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        text = xhr.response;
        resolve(text);
      } else {
        reject('XMLHttpRequest filed with code: ' + xhr.status);
      }
    }, false);
    xhr.send();
  });
  return promise;
}

let stripFile = (str: string): string => {
  // Strip comments
  let nocomments = str.replace(/(\/\/.*[\r\n])/g, '');
  // Strip trailing and leading whitespace
  let notrails = nocomments.replace(/(^\s+)|(\s+$)/g, '')
  // Strip line breaks and non-space whitespace
  return notrails.replace(/([\r\n\t])/g, '');
}

let splitTags = (str: string): Array<Array<string>> => {
  let split = str.split(';').map((elem) => {
    return elem.split(':');
  });
  split.splice(split.length - 1, 1);
  return split;
}

let attributeFromTag = (tag: string): string => {
  return tag.substr(1).toLowerCase();
}

// List of all official tags, with appropriate method.
// Null means desired target value is a string, so do nothing.
// False means that the value builder should not have been pased that tag.
let tagMap = {
  version: null,
  title: null,
  subtitle: null,
  artist: null,
  titletranslit: null,
  subtitletranslit: null,
  artisttranslit: null,
  genre: null,
  origin: null,
  credit: null,
  banner: null,
  background: null,
  previewvid: null,
  jacket: null,
  cdimage: null,
  discimage: null,
  lyricspath: null,
  cdtitle: null,
  music: null,
  offset: parseNumber,
  samplestart: parseNumber,
  samplelength: parseNumber,
  selectable: parseBoolean,
  displaybpm: null,
  bpms: parseBeatValueArray,
  stops: parseBeatValueArray,
  delays: parseBeatValueArray,
  warps: parseBeatValueArray,
  timesignatures: parseMeasureFractionArray,
  tickcounts: parseBeatValueArray,
  combos: parseBeatValueArray,
  speeds: parseTwoDimNumberArray,
  scrolls: parseBeatValueArray,
  fakes: parseBeatValueArray,
  labels: parseLabelValueArray,
  bgchanges: null,
  keysounds: null,
  attacks: null,
  chartname: null,
  stepstype: parseStepsType,
  description: null,
  difficulty: parseDifficultyType,
  chartstyle: null,
  meter: parseNumber,
  radarvalues: parseNumberArray,
  notedata: false,
  notes: false,
  default: parseDefault
};

export const SMUTILS = {
  parseValue: parseValue,
  getTextFromUrl: getTextFromUrl,
  stripFile: stripFile,
  splitTags: splitTags,
  attributeFromTag: attributeFromTag
}
