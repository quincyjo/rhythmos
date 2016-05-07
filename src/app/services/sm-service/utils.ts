import {StepsType, DifficultyType} from '../../shared/types/index';

let buildValue = (tag: string, value: string) => {
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

let parseMeasureValueArray = (value: string): Array<{measure: number, value: number}> => {
  let a: Array<{measure: number, value: number}> = [];
  if (value == '') return a;
  value.split(',').map((elem) => {
    let values = elem.split('=');
    a.push({
      measure: parseFloat(values[0]),
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

let parseMeasureFractionArray = (value: string): Array<{measure: number,
                                                        numerator: number,
                                                        denominator: number}> => {
  let a: Array<{measure: number, numerator: number, denominator: number}> = [];
  if (value == '') return a;
  value.split(',').map((elem) => {
    let values = elem.split('=');
    let measure = parseFloat(values[0]);
    let numerator = parseFloat(values[1]);
    let denominator = parseFloat(values[2]);
    a.push({
      measure: measure,
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
  displaybpm: parseNumber,
  bpms: parseMeasureValueArray,
  stops: parseMeasureValueArray,
  delays: parseMeasureValueArray,
  warps: parseMeasureValueArray,
  timesignatures: parseMeasureFractionArray,
  tickcounts: parseMeasureValueArray,
  combos: parseMeasureValueArray,
  speeds: parseTwoDimNumberArray,
  scrolls: parseMeasureValueArray,
  fakes: parseMeasureValueArray,
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

export const VALUEBUILDER = {
  buildValue: buildValue
}
