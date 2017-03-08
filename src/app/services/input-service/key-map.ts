type inputType = 'enter' | 'left' | 'up' | 'right' | 'down';
type blah = number | boolean;

let inputEvents: Array<inputType>;
let keyMap: Object;

export { inputType, inputEvents, keyMap };

inputEvents = [
  'enter',
  'left',
  'up',
  'right',
  'down'
];

keyMap = {
  Enter: 'enter',
  ArrowLeft: 'left',
  ArrowUp: 'up',
  ArrowRight: 'right',
  ArrowDown: 'down'
};
