import { Model, Schema } from '@src/core/schema'
import { ModelErrors, SchemaErrors } from '@src/core/validation/schema'

export const enum SchemaFlyoutModeType {
  CODE = 'code',
  VIEW_SCHEMA = 'view-schema',
  EDIT_SCHEMA = 'edit-schema',
  VIEW_MODEL = 'view-model',
  EDIT_MODEL = 'edit-model',
}

export type SchemaFlyoutMode =
  | { type: SchemaFlyoutModeType.CODE }
  | { type: SchemaFlyoutModeType.VIEW_SCHEMA }
  | { type: SchemaFlyoutModeType.EDIT_SCHEMA; schema: Schema; errors: SchemaErrors }
  | { type: SchemaFlyoutModeType.VIEW_MODEL; model: Model }
  | { type: SchemaFlyoutModeType.EDIT_MODEL; model: Model; errors: ModelErrors }
