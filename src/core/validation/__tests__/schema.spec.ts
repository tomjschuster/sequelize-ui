import blogSchema from '@src/api/schema/examples/blog'
import { manyToManyTableType } from '@src/core/schema'
import {
  NAME_REQUIRED_MESSAGE,
  NAME_TOO_LONG_MESSAGE,
  NAME_UNIQUE_MESSAGE,
  NAME_WITH_NUMBER_MESSAGE,
} from '../messages'
import {
  emptyModelErrors,
  emptySchemaErrors,
  noModelErrors,
  noSchemaErrors,
  validateModel,
  validateSchema,
} from '../schema'

describe('schema validation', () => {
  describe('validateSchema', () => {
    it('returns an error when name is missing', () => {
      const errors = validateSchema({ ...blogSchema, name: '' })
      expect(errors.name).toBe(NAME_REQUIRED_MESSAGE)
    })

    it('returns an error when name starts with a number', () => {
      const errors = validateSchema({ ...blogSchema, name: '1blog' })
      expect(errors.name).toBe(NAME_WITH_NUMBER_MESSAGE)
    })

    it('returns an error when name is too long', () => {
      const errors = validateSchema({ ...blogSchema, name: 'blog'.repeat(16) })
      expect(errors.name).toBe(NAME_TOO_LONG_MESSAGE)
    })
  })

  describe('noSchemaErrors', () => {
    it('returns true for empty errors', () => {
      expect(noSchemaErrors(emptySchemaErrors)).toBe(true)
    })

    it('returns true for valid schema', () => {
      const errors = validateSchema(blogSchema)
      expect(noSchemaErrors(errors)).toBe(true)
    })

    it('returns false when errors', () => {
      const errors = validateSchema({ ...blogSchema, name: '' })
      expect(noSchemaErrors(errors)).toBe(false)
    })
  })

  describe('validateModel', () => {
    const model = blogSchema.models[0]
    const model2 = blogSchema.models[1]

    describe('model name', () => {
      it('returns an error when name is missing', () => {
        const errors = validateModel({ ...model, name: '' }, blogSchema)
        expect(errors.name).toBe(NAME_REQUIRED_MESSAGE)
      })

      it('returns an error when name starts with a number', () => {
        const errors = validateModel({ ...model, name: '1model' }, blogSchema)
        expect(errors.name).toBe(NAME_WITH_NUMBER_MESSAGE)
      })

      it('returns an error when name is too long', () => {
        const errors = validateModel({ ...model, name: 'model'.repeat(13) }, blogSchema)
        expect(errors.name).toBe(NAME_TOO_LONG_MESSAGE)
      })

      it('returns an error when name is not unique', () => {
        const errors = validateModel({ ...model, name: model2.name }, blogSchema)
        expect(errors.name).toBe(NAME_UNIQUE_MESSAGE)
      })
    })

    describe('field name', () => {
      const model = blogSchema.models[0]
      const [field, field2, ...fields] = model.fields

      it('returns an error when name is missing', () => {
        const errors = validateModel(
          { ...model, fields: [{ ...field, name: '' }, field2, ...fields] },
          blogSchema,
        )
        expect(errors.fields[field.id].name).toBe(NAME_REQUIRED_MESSAGE)
      })

      it('returns an error when name starts with a number', () => {
        const errors = validateModel(
          { ...model, fields: [{ ...field, name: '1field' }, field2, ...fields] },
          blogSchema,
        )
        expect(errors.fields[field.id].name).toBe(NAME_WITH_NUMBER_MESSAGE)
      })

      it('returns an error when name is too long', () => {
        const errors = validateModel(
          { ...model, fields: [{ ...field, name: 'field'.repeat(13) }, field2, ...fields] },
          blogSchema,
        )
        expect(errors.fields[field.id].name).toBe(NAME_TOO_LONG_MESSAGE)
      })

      it('returns an error when name is not unique', () => {
        const errors = validateModel(
          { ...model, fields: [{ ...field, name: field2.name }, field2, ...fields] },
          blogSchema,
        )
        expect(errors.fields[field.id].name).toBe(NAME_UNIQUE_MESSAGE)
      })
    })

    describe('association', () => {
      const model = blogSchema.models[0]
      const [assoc, assoc2, ...assocs] = model.associations
      const target = blogSchema.models.find((m) => m.id === assoc.targetModelId)
      const target2 = blogSchema.models.find((m) => m.id === assoc2.targetModelId)

      describe('association alias', () => {
        it('returns an error when alias starts with a number', () => {
          const errors = validateModel(
            { ...model, associations: [{ ...assoc, alias: '1assoc' }, assoc2, ...assocs] },
            blogSchema,
          )
          expect(errors.associations[assoc.id].alias).toBe(NAME_WITH_NUMBER_MESSAGE)
        })

        it('returns an error when alias is too long', () => {
          const errors = validateModel(
            {
              ...model,
              associations: [{ ...assoc, alias: 'assoc'.repeat(13) }, assoc2, ...assocs],
            },
            blogSchema,
          )
          expect(errors.associations[assoc.id].alias).toBe(NAME_TOO_LONG_MESSAGE)
        })

        it('returns an error when alias is not unique', () => {
          const errors = validateModel(
            { ...model, associations: [{ ...assoc, alias: assoc2.alias }, assoc2, ...assocs] },
            blogSchema,
          )
          expect(errors.associations[assoc.id].alias).toBe(NAME_UNIQUE_MESSAGE)
        })

        it('returns an error when alias is same as other target model', () => {
          const errors = validateModel(
            {
              ...model,
              associations: [
                { ...assoc, alias: target2?.name || null },
                { ...assoc2, alias: null },
                ...assocs,
              ],
            },
            blogSchema,
          )
          expect(errors.associations[assoc.id].alias).toBe(NAME_UNIQUE_MESSAGE)
        })

        it('returns an error when target model is same as other alias', () => {
          const errors = validateModel(
            {
              ...model,
              associations: [
                { ...assoc, alias: null },
                { ...assoc2, alias: target?.name || null },
                ...assocs,
              ],
            },
            blogSchema,
          )
          expect(errors.associations[assoc.id].alias).toBe(NAME_UNIQUE_MESSAGE)
        })
      })

      describe('association foreignKey', () => {
        it('returns an error when foreignKey starts with a number', () => {
          const errors = validateModel(
            { ...model, associations: [{ ...assoc, foreignKey: '1assoc' }, assoc2, ...assocs] },
            blogSchema,
          )
          expect(errors.associations[assoc.id].foreignKey).toBe(NAME_WITH_NUMBER_MESSAGE)
        })

        it('returns an error when foreignKey is too long', () => {
          const errors = validateModel(
            {
              ...model,
              associations: [{ ...assoc, foreignKey: 'fk'.repeat(32) }, assoc2, ...assocs],
            },
            blogSchema,
          )
          expect(errors.associations[assoc.id].foreignKey).toBe(NAME_TOO_LONG_MESSAGE)
        })
      })

      describe('association targetForeignKey', () => {
        const typeWithTargetFk = (targetFk: string) => ({
          ...manyToManyTableType('foo'),
          targetFk,
        })

        it('returns an error when targetForeignKey starts with a number', () => {
          const errors = validateModel(
            {
              ...model,
              associations: [{ ...assoc, type: typeWithTargetFk('1fk') }, assoc2, ...assocs],
            },
            blogSchema,
          )
          expect(errors.associations[assoc.id].targetForeignKey).toBe(NAME_WITH_NUMBER_MESSAGE)
        })

        it('returns an error when targetForeignKey is too long', () => {
          const errors = validateModel(
            {
              ...model,
              associations: [
                { ...assoc, type: typeWithTargetFk('fk'.repeat(32)) },
                assoc2,
                ...assocs,
              ],
            },
            blogSchema,
          )
          expect(errors.associations[assoc.id].targetForeignKey).toBe(NAME_TOO_LONG_MESSAGE)
        })
      })

      describe('association throughTable', () => {
        it('returns an error when throughTable is missing', () => {
          const errors = validateModel(
            {
              ...model,
              associations: [{ ...assoc, type: manyToManyTableType('') }, assoc2, ...assocs],
            },
            blogSchema,
          )
          expect(errors.associations[assoc.id].throughTable).toBe(NAME_REQUIRED_MESSAGE)
        })

        it('returns an error when throughTable starts with a number', () => {
          const errors = validateModel(
            {
              ...model,
              associations: [{ ...assoc, type: manyToManyTableType('1table') }, assoc2, ...assocs],
            },
            blogSchema,
          )
          expect(errors.associations[assoc.id].throughTable).toBe(NAME_WITH_NUMBER_MESSAGE)
        })

        it('returns an error when throughTable is too long', () => {
          const errors = validateModel(
            {
              ...model,
              associations: [
                { ...assoc, type: manyToManyTableType('table'.repeat(13)) },
                assoc2,
                ...assocs,
              ],
            },
            blogSchema,
          )
          expect(errors.associations[assoc.id].throughTable).toBe(NAME_TOO_LONG_MESSAGE)
        })
      })
    })
  })

  describe('noModelErrors', () => {
    it('returns true for empty errors', () => {
      expect(noModelErrors(emptyModelErrors)).toBe(true)
    })

    it('returns false when errors', () => {
      const model = blogSchema.models[0]
      const errors = validateModel({ ...model, name: '' }, blogSchema)
      expect(noModelErrors(errors)).toBe(false)
    })
  })
})
