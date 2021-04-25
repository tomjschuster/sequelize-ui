import {
  Association,
  associationsHaveSameForm,
  AssociationType,
  associationTypeIsPlural,
  associationTypeIsSingular,
  AssociationTypeType,
  belongsToType,
  displayAssociation,
  displayAssociationTypeType,
  displayThroughType,
  hasManyType,
  hasOneType,
  manyToManyModelType,
  manyToManyTableType,
  ThroughType,
} from '../association'
import {
  belongsTo,
  belongsToType_,
  hasMany,
  hasManyType_,
  hasOne,
  hasOneType_,
  manyToManyModel,
  manyToManyModelType_,
  manyToManyTable,
  manyToManyTableType_,
} from './__fixtures__/association'

describe('schema dataTypes', () => {
  describe('displayAssociationType', () => {
    const cases: [a: Association, expected: string][] = [
      [belongsTo, 'belongs to'],
      [hasMany, 'has many'],
      [hasOne, 'has one'],
      [manyToManyTable, 'many to many'],
      [manyToManyModel, 'many to many'],
    ]

    describe.each(cases)('', (a, expected) => {
      it(`(${a.type.type}) === ${expected}`, () => {
        expect(displayAssociation(a)).toEqual(expected)
      })
    })
  })

  describe('displayAssociationTypeType', () => {
    const cases: [type: AssociationTypeType, expected: string][] = [
      [AssociationTypeType.BelongsTo, 'belongs to'],
      [AssociationTypeType.HasMany, 'has many'],
      [AssociationTypeType.HasOne, 'has one'],
      [AssociationTypeType.ManyToMany, 'many to many'],
    ]

    describe.each(cases)('', (type, expected) => {
      it(`(${type}) === ${expected}`, () => {
        expect(displayAssociationTypeType(type)).toEqual(expected)
      })
    })
  })

  describe('displayThroughType', () => {
    const cases: [type: ThroughType, expected: string][] = [
      [ThroughType.ThroughTable, 'Through table'],
      [ThroughType.ThroughModel, 'Through model'],
    ]

    describe.each(cases)('', (type, expected) => {
      it(`(${type}) === ${expected}`, () => {
        expect(displayThroughType(type)).toEqual(expected)
      })
    })
  })

  describe('associationsHaveSameForm', () => {
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
    describe.each(cases)('', (a, b, expected) => {
      it(`(${a.type.type}, ${b.type.type}) === ${expected}`, () => {
        expect(associationsHaveSameForm(a, b)).toEqual(expected)
      })
    })
  })

  describe('associationTypeIsSingular', () => {
    const cases: [type: AssociationType, expected: boolean][] = [
      [belongsToType_, true],
      [hasManyType_, false],
      [hasOneType_, true],
      [manyToManyTableType_, false],
      [manyToManyModelType_, false],
    ]
    describe.each(cases)('', (type, expected) => {
      it(`(${type.type}) === ${expected}`, () => {
        expect(associationTypeIsSingular(type)).toEqual(expected)
      })
    })
  })

  describe('associationTypeIsPlural', () => {
    const cases: [type: AssociationType, expected: boolean][] = [
      [belongsToType_, false],
      [hasManyType_, true],
      [hasOneType_, false],
      [manyToManyTableType_, true],
      [manyToManyModelType_, true],
    ]
    describe.each(cases)('', (type, expected) => {
      it(`(${type.type})=== ${'TODO'}`, () => {
        expect(associationTypeIsPlural(type)).toEqual(expected)
      })
    })
  })

  describe('belongsToType', () => {
    it('returns the correct value', () => {
      expect(belongsToType()).toEqual(belongsToType_)
    })
  })

  describe('hasManyType', () => {
    it('returns the correct value', () => {
      expect(hasManyType()).toEqual(hasManyType_)
    })
  })

  describe('hasOneType', () => {
    it('returns the correct value', () => {
      expect(hasOneType()).toEqual(hasOneType_)
    })
  })

  describe('manyToManyTableType', () => {
    it('returns the correct value', () => {
      expect(manyToManyTableType(manyToManyTableType_.through.table)).toEqual(manyToManyTableType_)
    })
  })

  describe('manyToManyModelType', () => {
    it('returns the correct value', () => {
      expect(manyToManyModelType(manyToManyModelType_.through.modelId)).toEqual(
        manyToManyModelType_,
      )
    })
  })
})
