import * as migration_20260831_121030 from './20260831_121030';
import * as migration_20260906_115746_hardening_i18n_preview from './20260906_115746_hardening_i18n_preview';
import * as migration_20260906_130821_page_form_block from './20260906_130821_page_form_block';

export const migrations = [
  {
    up: migration_20260831_121030.up,
    down: migration_20260831_121030.down,
    name: '20260831_121030',
  },
  {
    up: migration_20260906_115746_hardening_i18n_preview.up,
    down: migration_20260906_115746_hardening_i18n_preview.down,
    name: '20260906_115746_hardening_i18n_preview',
  },
  {
    up: migration_20260906_130821_page_form_block.up,
    down: migration_20260906_130821_page_form_block.down,
    name: '20260906_130821_page_form_block',
  },
];
