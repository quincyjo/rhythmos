export type DifficultyType = 'Beginner' | 'Easy' | 'Medium' | 'Hard' | 'Challenge' | 'Edit';
export enum DIFFICULTY {
  Beginner,
  Easy,
  Medium,
  Hard,
  Challenge,
  Edit,
};
// Index with value to get Difficulty literal.
export const DIFFICULTYLITERALS: Array<DifficultyType> = [
  'Beginner', 'Easy', 'Medium', 'Hard', 'Challenge', 'Edit'
];
// Index with string to get DIFFICULTY value.
export const DIFFICULTYVALUES = {
  'Beginner': 0,
  'Easy': 1,
  'Medium': 2,
  'Hard': 3,
  'Challenge': 4,
  'Edit': 5
};
