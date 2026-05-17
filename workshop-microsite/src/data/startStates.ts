import type { Matrix } from '@site/src/components/startStateGallery/gameOfLifeRules';

export type DemoStartStateSeed = {
  id: string;
  studentName: string;
  patternName: string;
  patternCategory: 'still_life' | 'oscillator' | 'spaceship' | 'methuselah' | 'other';
  patternMatrix: Matrix;
  interestingBehavior: string;
  submittedAt: string;
  permissionToShowcase: boolean;
  projectLink?: string;
};

export const DEMO_START_STATE_SUBMISSIONS: DemoStartStateSeed[] = [
  {
    id: 'glider-demo',
    studentName: 'Workshop Demo',
    patternName: 'Glider',
    patternCategory: 'spaceship',
    patternMatrix: [
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1],
    ],
    interestingBehavior: 'A small diagonal traveler that keeps moving across the board.',
    submittedAt: '2026-05-15',
    permissionToShowcase: true,
  },
  {
    id: 'blinker-demo',
    studentName: 'Workshop Demo',
    patternName: 'Blinker',
    patternCategory: 'oscillator',
    patternMatrix: [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    interestingBehavior: 'A period-2 oscillator that flips between horizontal and vertical.',
    submittedAt: '2026-05-14',
    permissionToShowcase: true,
  },
  {
    id: 'toad-demo',
    studentName: 'Workshop Demo',
    patternName: 'Toad',
    patternCategory: 'oscillator',
    patternMatrix: [
      [0, 1, 1, 1],
      [1, 1, 1, 0],
    ],
    interestingBehavior: 'A larger oscillator that pulses between two offset rows.',
    submittedAt: '2026-05-13',
    permissionToShowcase: true,
  },
  {
    id: 'beacon-demo',
    studentName: 'Workshop Demo',
    patternName: 'Beacon',
    patternCategory: 'oscillator',
    patternMatrix: [
      [1, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 1, 1],
      [0, 0, 1, 1],
    ],
    interestingBehavior: 'Two stable blocks close enough to create a flashing corner gap.',
    submittedAt: '2026-05-12',
    permissionToShowcase: true,
  },
  {
    id: 'lwss-demo',
    studentName: 'Workshop Demo',
    patternName: 'Lightweight Spaceship',
    patternCategory: 'spaceship',
    patternMatrix: [
      [0, 1, 0, 0, 1],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 0],
    ],
    interestingBehavior: 'A compact spaceship that sweeps sideways across the finite grid.',
    submittedAt: '2026-05-11',
    permissionToShowcase: true,
  },
  {
    id: 'acorn-demo',
    studentName: 'Workshop Demo',
    patternName: 'Acorn',
    patternCategory: 'methuselah',
    patternMatrix: [
      [0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [1, 1, 0, 0, 1, 1, 1],
    ],
    interestingBehavior: 'A tiny seed that erupts into a long and surprisingly rich evolution.',
    submittedAt: '2026-05-10',
    permissionToShowcase: true,
  },
];
