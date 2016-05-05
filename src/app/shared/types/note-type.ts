export type NoteType = '0' | '1' | '2'| '3' | '4' | 'M' | 'L' | 'K' | 'F';
export const NOTES: {
  NONE: NoteType;
  STEP: NoteType;
  HOLD_HEAD: NoteType;
  HOLD_TAIL: NoteType;
  ROLL_HEAD: NoteType;
  ROLL_TAIL: NoteType;
  MINE: NoteType;
  KEYSOUND: NoteType;
  LIFT: NoteType;
  FAKE: NoteType;
} = {
  NONE: '0',
  STEP: '1',
  HOLD_HEAD: '2',
  HOLD_TAIL: '3',
  ROLL_HEAD: '4',
  ROLL_TAIL: '3',
  MINE: 'M',
  KEYSOUND: 'K',
  LIFT: 'L',
  FAKE: 'K'
}
