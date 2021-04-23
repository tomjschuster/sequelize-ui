import {
  Association,
  associationsHaveSameForm,
  AssociationType,
  associationTypeIsPlural,
  associationTypeIsSingular,
  AssociationTypeType,
  displayAssociation,
  displayAssociationTypeType,
  displayThroughType,
  ThroughType,
} from '../association'
import {
  belongsTo,
  belongsToType,
  hasMany,
  hasManyType,
  hasOne,
  hasOneType,
  manyToManyModel,
  manyToManyModelType,
  manyToManyTable,
  manyToManyTableType,
} from '../__fixtures__/association'

fdescribe('schema dataTypes', () => {
  fdescribe('displayAssociationType', () => {
    const cases: [a: Association, expected: string][] = [
      [belongsTo, 'belongs to'],
      [hasMany, 'has many'],
      [hasOne, 'has one'],
      [manyToManyTable, 'many to many'],
      [manyToManyModel, 'many to many'],
    ]

    fdescribe.each(cases)('', (a, expected) => {
      fit(`(${a.type.type}) === ${expected}`, () => {
        expect(displayAssociation(a)).toEqual(expected)
      })
    })
  })

  fdescribe('displayAssociationTypeType', () => {
    const cases: [type: AssociationTypeType, expected: string][] = [
      [AssociationTypeType.BelongsTo, 'belongs to'],
      [AssociationTypeType.HasMany, 'has many'],
      [AssociationTypeType.HasOne, 'has one'],
      [AssociationTypeType.ManyToMany, 'many to many'],
    ]

    fdescribe.each(cases)('', (type, expected) => {
      fit(`(${type}) === ${expected}`, () => {
        expect(displayAssociationTypeType(type)).toEqual(expected)
      })
    })
  })

  fdescribe('displayThroughType', () => {
    const cases: [type: ThroughType, expected: string][] = [
      [ThroughType.ThroughTable, 'Through table'],
      [ThroughType.ThroughModel, 'Through model'],
    ]

    fdescribe.each(cases)('', (type, expected) => {
      fit(`(${type}) === ${expected}`, () => {
        expect(displayThroughType(type)).toEqual(expected)
      })
    })
  })

  fdescribe('associationsHaveSameForm', () => {
    const cases: [a: Association, b: Association, expected: boolean][] = [
      [belongsTo, belongsTo, true],
      [belongsTo, hasMany, false],
      [belongsTo, hasOne, true],
      [belongsTo, manyToManyTable, false],
      [belongsTo, manyToManyModel, false],

      [hasMany, belongsTo, false],
      [hasMany, hasMany, true],
      [hasMany, hasOne, false],
      [hasMany, manyToManyTable, true],
      [hasMany, manyToManyModel, true],

      [hasOne, belongsTo, true],
      [hasOne, hasMany, false],
      [hasOne, hasOne, true],
      [hasOne, manyToManyTable, false],
      [hasOne, manyToManyModel, false],

      [manyToManyTable, belongsTo, false],
      [manyToManyTable, hasMany, true],
      [manyToManyTable, hasOne, false],
      [manyToManyTable, manyToManyTable, true],
      [manyToManyTable, manyToManyModel, true],

      [manyToManyModel, belongsTo, false],
      [manyToManyModel, hasMany, true],
      [manyToManyModel, hasOne, false],
      [manyToManyModel, manyToManyTable, true],
      [manyToManyModel, manyToManyModel, true],
    ]
    fdescribe.each(cases)('', (a, b, expected) => {
      fit(`(${a.type.type}, ${b.type.type}) === ${expected}`, () => {
        expect(associationsHaveSameForm(a, b)).toEqual(expected)
      })
    })
  })

  fdescribe('associationTypeIsSingular', () => {
    const cases: [type: AssociationType, expected: boolean][] = [
      [belongsToType, true],
      [hasManyType, false],
      [hasOneType, true],
      [manyToManyTableType, false],
      [manyToManyModelType, false],
    ]
    fdescribe.each(cases)('', (type, expected) => {
      fit(`(${type.type}) === ${expected}`, () => {
        expect(associationTypeIsSingular(type)).toEqual(expected)
      })
    })
  })

  fdescribe('associationTypeIsPlural', () => {
    const cases: [type: AssociationType, expected: boolean][] = [
      [belongsToType, false],
      [hasManyType, true],
      [hasOneType, false],
      [manyToManyTableType, true],
      [manyToManyModelType, true],
    ]
    fdescribe.each(cases)('', (type, expected) => {
      fit(`(${type.type})=== ${'TODO'}`, () => {
        expect(associationTypeIsPlural(type)).toEqual(expected)
      })
    })
  })
})
