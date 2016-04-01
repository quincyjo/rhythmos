import {Option} from '../../shared/interfaces/option';

export var OPTIONS: Option[] = [
  {
    id: 0,
    label: "Graphic Options",
    value: null,
    dirty: null,
    values: null,
    tags: null,
    children: [
      {
        id: 1,
        label: "Graphic Option 1",
        value: 0,
        dirty: false,
        values: ["Default", "One", "Two", "Three"],
        tags: null,
        children: []
      },
      {
        id: 2,
        label: "Graphic Option 2",
        value: 0,
        dirty: false,
        values: ["Default", "One", "Two", "Three"],
        tags: null,
        children: []
      }
    ]
  },
];
