import * as migration_20260831_121030 from './20260831_121030';
import * as migration_20260906_115746_hardening_i18n_preview from './20260906_115746_hardening_i18n_preview';
import * as migration_20260906_130821_page_form_block from './20260906_130821_page_form_block';
import * as migration_20260907_130000_rbac from './20260907_130000_rbac';
import * as migration_20260907_130100_submission_file_size from './20260907_130100_submission_file_size';

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
  {
    up: migration_20260907_130000_rbac.up,
    down: migration_20260907_130000_rbac.down,
    name: '20260907_130000_rbac',
  },
  {
    up: migration_20260907_130100_submission_file_size.up,
    down: migration_20260907_130100_submission_file_size.down,
    name: '20260907_130100_submission_file_size',
  },
];
