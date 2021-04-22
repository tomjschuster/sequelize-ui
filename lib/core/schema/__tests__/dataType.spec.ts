import { expect } from 'chai'
import forEach from 'mocha-each'
import {
  arrayDataType,
  bigIntDataType,
  blobDataType,
  booleanDataType,
  ciTextDataType,
  dataTypeFromDataTypeType,
  DataTypeType,
  dateDataType,
  dateTimeDataType,
  decimalDataType,
  displayDataType,
  displayDataTypeType,
  doubleDataType,
  enumDataType,
  floatDataType,
  integerDataType,
  isDateTimeType,
  isIntegerType,
  isNumberType,
  isNumericType,
  isStringType,
  jsonBDataType,
  jsonDataType,
  realDataType,
  smallIntDataType,
  stringDataType,
  textDataType,
  timeDataType,
  uuidDataType,
} from '../dataType'
import {
  array,
  bigInt,
  blob,
  boolean,
  ciText,
  date,
  dateTime,
  decimal,
  double,
  enum_,
  float,
  integer,
  json,
  jsonB,
  real,
  smallInt,
  string,
  text,
  time,
  uuid,
} from '../__fixtures__/dataType'

describe('schema dataTypes', () => {
  describe('displayDataType', () => {
    const cases = [
      [string, 'String'],
      [text, 'Text'],
      [ciText, 'CI Text'],
      [integer, 'Integer'],
      [bigInt, 'Big Int'],
      [smallInt, 'Small Int'],
      [float, 'Float'],
      [real, 'Real'],
      [double, 'Double'],
      [decimal, 'Decimal'],
      [dateTime, 'Date Time'],
      [date, 'Date'],
      [time, 'Time'],
      [boolean, 'Boolean'],
      [enum_, 'Enum'],
      [{ ...enum_, values: ['foo', 'bar'] }, 'Enum (foo, bar)'],
      [array, 'Array (String)'],
      [json, 'JSON'],
      [jsonB, 'JSONB'],
      [blob, 'Blob'],
      [uuid, 'UUID'],
    ]
    forEach(cases).describe('', (type, expected) => {
      it(`${type} === ${expected}`, () => {
        expect(displayDataType(type)).to.equal(expected)
      })
    })
  })

  describe('displayDataTypeType', () => {
    const cases = [
      [DataTypeType.String, 'String'],
      [DataTypeType.Text, 'Text'],
      [DataTypeType.CiText, 'CI Text'],
      [DataTypeType.Integer, 'Integer'],
      [DataTypeType.BigInt, 'Big Int'],
      [DataTypeType.SmallInt, 'Small Int'],
      [DataTypeType.Float, 'Float'],
      [DataTypeType.Real, 'Real'],
      [DataTypeType.Double, 'Double'],
      [DataTypeType.Decimal, 'Decimal'],
      [DataTypeType.DateTime, 'Date Time'],
      [DataTypeType.Date, 'Date'],
      [DataTypeType.Time, 'Time'],
      [DataTypeType.Boolean, 'Boolean'],
      [DataTypeType.Enum, 'Enum'],
      [DataTypeType.Array, 'Array'],
      [DataTypeType.Json, 'JSON'],
      [DataTypeType.JsonB, 'JSONB'],
      [DataTypeType.Blob, 'Blob'],
      [DataTypeType.Uuid, 'UUID'],
    ]
    forEach(cases).describe('', (type, expected) => {
      it(`${type} === ${expected}`, () => {
        expect(displayDataTypeType(type)).to.equal(expected)
      })
    })
  })

  describe('dataTypeFromDataTypeType', () => {
    const cases = [
      [DataTypeType.String, string],
      [DataTypeType.Text, text],
      [DataTypeType.CiText, ciText],
      [DataTypeType.Integer, integer],
      [DataTypeType.BigInt, bigInt],
      [DataTypeType.SmallInt, smallInt],
      [DataTypeType.Float, float],
      [DataTypeType.Real, real],
      [DataTypeType.Double, double],
      [DataTypeType.Decimal, decimal],
      [DataTypeType.DateTime, dateTime],
      [DataTypeType.Date, date],
      [DataTypeType.Time, time],
      [DataTypeType.Boolean, boolean],
      [DataTypeType.Enum, enum_],
      [DataTypeType.Array, array],
      [DataTypeType.Json, json],
      [DataTypeType.JsonB, jsonB],
      [DataTypeType.Blob, blob],
      [DataTypeType.Uuid, uuid],
    ]
    forEach(cases).describe('', (type, expected) => {
      it(`${type} === ${expected}`, () => {
        expect(dataTypeFromDataTypeType(type)).to.eql(expected)
      })
    })
  })

  describe('stringDataType', () => {
    it('should create a stringDataType datatype', () => {
      expect(stringDataType()).to.eql(string)
    })
  })

  describe('textDataType', () => {
    it('should create a textDataType datatype', () => {
      expect(textDataType()).to.eql(text)
    })
  })

  describe('ciTextDataType', () => {
    it('should create a ciTextDataType datatype', () => {
      expect(ciTextDataType()).to.eql(ciText)
    })
  })

  describe('integerDataType', () => {
    it('should create a integerDataType datatype', () => {
      expect(integerDataType()).to.eql(integer)
    })
  })

  describe('bigIntDataType', () => {
    it('should create a bigIntDataType datatype', () => {
      expect(bigIntDataType()).to.eql(bigInt)
    })
  })

  describe('smallIntDataType', () => {
    it('should create a smallIntDataType datatype', () => {
      expect(smallIntDataType()).to.eql(smallInt)
    })
  })

  describe('floatDataType', () => {
    it('should create a floatDataType datatype', () => {
      expect(floatDataType()).to.eql(float)
    })
  })

  describe('realDataType', () => {
    it('should create a realDataType datatype', () => {
      expect(realDataType()).to.eql(real)
    })
  })

  describe('doubleDataType', () => {
    it('should create a doubleDataType datatype', () => {
      expect(doubleDataType()).to.eql(double)
    })
  })

  describe('decimalDataType', () => {
    it('should create a decimalDataType datatype', () => {
      expect(decimalDataType()).to.eql(decimal)
    })
  })

  describe('dateTimeDataType', () => {
    it('should create a dateTimeDataType datatype', () => {
      expect(dateTimeDataType()).to.eql(dateTime)
    })
  })

  describe('dateDataType', () => {
    it('should create a dateDataType datatype', () => {
      expect(dateDataType()).to.eql(date)
    })
  })

  describe('timeDataType', () => {
    it('should create a timeDataType datatype', () => {
      expect(timeDataType()).to.eql(time)
    })
  })

  describe('booleanDataType', () => {
    it('should create a booleanDataType datatype', () => {
      expect(booleanDataType()).to.eql(boolean)
    })
  })

  describe('enumDataType', () => {
    it('should create a enumDataType datatype', () => {
      expect(enumDataType()).to.eql(enum_)
    })
  })

  describe('arrayDataType', () => {
    it('should create a arrayDataType datatype', () => {
      expect(arrayDataType()).to.eql(array)
    })
  })

  describe('jsonDataType', () => {
    it('should create a jsonDataType datatype', () => {
      expect(jsonDataType()).to.eql(json)
    })
  })

  describe('jsonBDataType', () => {
    it('should create a jsonBDataType datatype', () => {
      expect(jsonBDataType()).to.eql(jsonB)
    })
  })

  describe('blobDataType', () => {
    it('should create a blobDataType datatype', () => {
      expect(blobDataType()).to.eql(blob)
    })
  })

  describe('uuidDataType', () => {
    it('should create a uuidDataType datatype', () => {
      expect(uuidDataType()).to.eql(uuid)
    })
  })

  describe('isStringType', () => {
    const cases = [
      [string, true],
      [text, false],
      [ciText, false],
      [integer, false],
      [bigInt, false],
      [smallInt, false],
      [float, false],
      [real, false],
      [double, false],
      [decimal, false],
      [dateTime, false],
      [date, false],
      [time, false],
      [boolean, false],
      [enum_, false],
      [array, false],
      [json, false],
      [jsonB, false],
      [blob, false],
      [uuid, false],
    ]
    forEach(cases).describe('', (type, expected) => {
      it(`${type} === ${expected}`, () => {
        expect(isStringType(type)).to.equal(expected)
      })
    })
  })

  describe('isDateTimeType', () => {
    const cases = [
      [string, false],
      [text, false],
      [ciText, false],
      [integer, false],
      [bigInt, false],
      [smallInt, false],
      [float, false],
      [real, false],
      [double, false],
      [decimal, false],
      [dateTime, true],
      [date, true],
      [time, true],
      [boolean, false],
      [enum_, false],
      [array, false],
      [json, false],
      [jsonB, false],
      [blob, false],
      [uuid, false],
    ]
    forEach(cases).describe('', (type, expected) => {
      it(`${type} === ${expected}`, () => {
        expect(isDateTimeType(type)).to.equal(expected)
      })
    })
  })

  describe('isDateTimeType', () => {
    const cases = [
      [string, false],
      [text, false],
      [ciText, false],
      [integer, false],
      [bigInt, false],
      [smallInt, false],
      [float, false],
      [real, false],
      [double, false],
      [decimal, false],
      [dateTime, true],
      [date, true],
      [time, true],
      [boolean, false],
      [enum_, false],
      [array, false],
      [json, false],
      [jsonB, false],
      [blob, false],
      [uuid, false],
    ]
    forEach(cases).describe('', (type, expected) => {
      it(`${type} === ${expected}`, () => {
        expect(isDateTimeType(type)).to.equal(expected)
      })
    })
  })

  describe('isDateTimeType', () => {
    const cases = [
      [string, false],
      [text, false],
      [ciText, false],
      [integer, false],
      [bigInt, false],
      [smallInt, false],
      [float, false],
      [real, false],
      [double, false],
      [decimal, false],
      [dateTime, true],
      [date, true],
      [time, true],
      [boolean, false],
      [enum_, false],
      [array, false],
      [json, false],
      [jsonB, false],
      [blob, false],
      [uuid, false],
    ]
    forEach(cases).describe('', (type, expected) => {
      it(`${type} === ${expected}`, () => {
        expect(isDateTimeType(type)).to.equal(expected)
      })
    })
  })

  describe('isDateTimeType', () => {
    const cases = [
      [string, false],
      [text, false],
      [ciText, false],
      [integer, false],
      [bigInt, false],
      [smallInt, false],
      [float, false],
      [real, false],
      [double, false],
      [decimal, true],
      [dateTime, false],
      [date, false],
      [time, false],
      [boolean, false],
      [enum_, false],
      [array, false],
      [json, false],
      [jsonB, false],
      [blob, false],
      [uuid, false],
    ]
    forEach(cases).describe('', (type, expected) => {
      it(`${type} === ${expected}`, () => {
        expect(isNumericType(type)).to.equal(expected)
      })
    })

    describe('isNumberType', () => {
      const cases = [
        [string, false],
        [text, false],
        [ciText, false],
        [integer, true],
        [bigInt, true],
        [smallInt, true],
        [float, true],
        [real, true],
        [double, true],
        [decimal, true],
        [dateTime, false],
        [date, false],
        [time, false],
        [boolean, false],
        [enum_, false],
        [array, false],
        [json, false],
        [jsonB, false],
        [blob, false],
        [uuid, false],
      ]
      forEach(cases).describe('', (type, expected) => {
        it(`${type} === ${expected}`, () => {
          expect(isNumberType(type)).to.equal(expected)
        })
      })
    })

    describe('isNumberType', () => {
      const cases = [
        [string, false],
        [text, false],
        [ciText, false],
        [integer, true],
        [bigInt, true],
        [smallInt, true],
        [float, false],
        [real, false],
        [double, false],
        [decimal, false],
        [dateTime, false],
        [date, false],
        [time, false],
        [boolean, false],
        [enum_, false],
        [array, false],
        [json, false],
        [jsonB, false],
        [blob, false],
        [uuid, false],
      ]
      forEach(cases).describe('', (type, expected) => {
        it(`${type} === ${expected}`, () => {
          expect(isIntegerType(type)).to.equal(expected)
        })
      })
    })
  })
})
