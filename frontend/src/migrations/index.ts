import * as migration_20260909_130730_initial_redesign from './20260909_130730_initial_redesign';

export const migrations = [
  {
    up: migration_20260909_130730_initial_redesign.up,
    down: migration_20260909_130730_initial_redesign.down,
    name: '20260909_130730_initial_redesign'
  },
];
