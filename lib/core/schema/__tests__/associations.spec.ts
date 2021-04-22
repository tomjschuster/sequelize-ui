import { expect } from 'chai'
import forEach from 'mocha-each'
import {
  associationsHaveSameForm,
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

describe('schema dataTypes', () => {
  describe('displayAssociationType', () => {
    const cases = [
      [belongsTo, 'belongs to'],
      [hasMany, 'has many'],
      [hasOne, 'has one'],
      [manyToManyTable, 'many to many'],
      [manyToManyModel, 'many to many'],
    ]

    forEach(cases).describe('', (a, expected) => {
      it(`(${a.type.type}) === ${expected}`, () => {
        expect(displayAssociation(a)).to.equal(expected)
      })
    })
  })

  describe('displayAssociationTypeType', () => {
    const cases = [
      [AssociationTypeType.BelongsTo, 'belongs to'],
      [AssociationTypeType.HasMany, 'has many'],
      [AssociationTypeType.HasOne, 'has one'],
      [AssociationTypeType.ManyToMany, 'many to many'],
    ]

    forEach(cases).describe('', (type, expected) => {
      it(`(${type}) === ${expected}`, () => {
        expect(displayAssociationTypeType(type)).to.equal(expected)
      })
    })
  })

  describe('displayThroughType', () => {
    const cases = [
      [ThroughType.ThroughTable, 'Through table'],
      [ThroughType.ThroughModel, 'Through model'],
    ]

    forEach(cases).describe('', (type, expected) => {
      it(`(${type}) === ${expected}`, () => {
        expect(displayThroughType(type)).to.equal(expected)
      })
    })
  })

  describe('associationsHaveSameForm', () => {
    const cases = [
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
    forEach(cases).describe('', (a, b, expected) => {
      it(`(${a.type.type}, ${b.type.type}) === ${expected}`, () => {
        expect(associationsHaveSameForm(a, b)).to.equal(expected)
      })
    })
  })

  describe('associationTypeIsSingular', () => {
    const cases = [
      [belongsToType, true],
      [hasManyType, false],
      [hasOneType, true],
      [manyToManyTableType, false],
      [manyToManyModelType, false],
    ]
    forEach(cases).describe('', (type, expected) => {
      it(`(${type.type}) === ${expected}`, () => {
        expect(associationTypeIsSingular(type)).to.equal(expected)
      })
    })
  })

  describe('associationTypeIsPlural', () => {
    const cases = [
      [belongsToType, false],
      [hasManyType, true],
      [hasOneType, false],
      [manyToManyTableType, true],
      [manyToManyModelType, true],
    ]
    forEach(cases).describe('', (type, expected) => {
      it(`(${type.type})=== ${'TODO'}`, () => {
        expect(associationTypeIsPlural(type)).to.equal(expected)
      })
    })
  })
})
