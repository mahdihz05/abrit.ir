import * as migration_20260831_121030 from './20260831_121030';

export const migrations = [
  {
    up: migration_20260831_121030.up,
    down: migration_20260831_121030.down,
    name: '20260831_121030'
  },
];
