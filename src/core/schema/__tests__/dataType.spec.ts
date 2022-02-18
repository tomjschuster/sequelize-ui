import {
  arrayDataType,
  bigIntDataType,
  blobDataType,
  booleanDataType,
  ciTextDataType,
  DataType,
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
  resetType,
  smallIntDataType,
  stringDataType,
  textDataType,
  timeDataType,
  uuidDataType,
  UuidType,
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
} from './__fixtures__/dataType'

describe('schema dataTypes', () => {
  describe('displayDataType', () => {
    const cases: [type: DataType, expected: string][] = [
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
      [{ ...enum_, values: ['foo', 'bar'] }, 'Enum (values: foo; bar)'],
      [array, 'Array (String)'],
      [json, 'JSON'],
      [jsonB, 'JSONB'],
      [blob, 'Blob'],
      [uuid, 'UUID'],
    ]
    describe.each(cases)('', (type, expected) => {
      it(`${type} === ${expected}`, () => {
        expect(displayDataType(type)).toEqual(expected)
      })
    })
  })

  describe('displayDataTypeType', () => {
    const cases: [type: DataTypeType, expected: string][] = [
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
    describe.each(cases)('', (type, expected) => {
      it(`${type} === ${expected}`, () => {
        expect(displayDataTypeType(type)).toEqual(expected)
      })
    })
  })

  describe('typeWithoutOptions', () => {
    const cases: [type: DataType, expected: DataType][] = [
      [string, string],
      [text, text],
      [ciText, ciText],
      [{ ...integer, autoincrement: true }, integer],
      [{ ...bigInt, autoincrement: true }, bigInt],
      [{ ...smallInt, autoincrement: true }, smallInt],
      [float, float],
      [real, real],
      [double, double],
      [decimal, decimal],
      [{ ...dateTime, defaultNow: true }, dateTime],
      [{ ...date, defaultNow: true }, date],
      [{ ...time, defaultNow: true }, time],
      [boolean, boolean],
      [enum_, enum_],
      [array, array],
      [json, json],
      [jsonB, jsonB],
      [blob, blob],
      [{ ...uuid, defaultVersion: UuidType.V1 }, uuid],
    ]
    describe.each(cases)('', (type, expected) => {
      it(`${type} === ${expected}`, () => {
        expect(resetType(type)).toEqual(expected)
      })
    })
  })

  describe('dataTypeFromDataTypeType', () => {
    const cases: [type: DataTypeType, expected: DataType][] = [
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
    describe.each(cases)('', (type, expected) => {
      it(`${type} === ${expected}`, () => {
        expect(dataTypeFromDataTypeType(type)).toEqual(expected)
      })
    })
  })

  describe('stringDataType', () => {
    it('creates a stringDataType datatype', () => {
      expect(stringDataType()).toEqual(string)
    })
  })

  describe('textDataType', () => {
    it('creates a textDataType datatype', () => {
      expect(textDataType()).toEqual(text)
    })
  })

  describe('ciTextDataType', () => {
    it('creates a ciTextDataType datatype', () => {
      expect(ciTextDataType()).toEqual(ciText)
    })
  })

  describe('integerDataType', () => {
    it('creates a integerDataType datatype', () => {
      expect(integerDataType()).toEqual(integer)
    })
  })

  describe('bigIntDataType', () => {
    it('creates a bigIntDataType datatype', () => {
      expect(bigIntDataType()).toEqual(bigInt)
    })
  })

  describe('smallIntDataType', () => {
    it('creates a smallIntDataType datatype', () => {
      expect(smallIntDataType()).toEqual(smallInt)
    })
  })

  describe('floatDataType', () => {
    it('creates a floatDataType datatype', () => {
      expect(floatDataType()).toEqual(float)
    })
  })

  describe('realDataType', () => {
    it('creates a realDataType datatype', () => {
      expect(realDataType()).toEqual(real)
    })
  })

  describe('doubleDataType', () => {
    it('creates a doubleDataType datatype', () => {
      expect(doubleDataType()).toEqual(double)
    })
  })

  describe('decimalDataType', () => {
    it('creates a decimalDataType datatype', () => {
      expect(decimalDataType()).toEqual(decimal)
    })
  })

  describe('dateTimeDataType', () => {
    it('creates a dateTimeDataType datatype', () => {
      expect(dateTimeDataType()).toEqual(dateTime)
    })
  })

  describe('dateDataType', () => {
    it('creates a dateDataType datatype', () => {
      expect(dateDataType()).toEqual(date)
    })
  })

  describe('timeDataType', () => {
    it('creates a timeDataType datatype', () => {
      expect(timeDataType()).toEqual(time)
    })
  })

  describe('booleanDataType', () => {
    it('creates a booleanDataType datatype', () => {
      expect(booleanDataType()).toEqual(boolean)
    })
  })

  describe('enumDataType', () => {
    it('creates a enumDataType datatype', () => {
      expect(enumDataType()).toEqual(enum_)
    })
  })

  describe('arrayDataType', () => {
    it('creates a arrayDataType datatype', () => {
      expect(arrayDataType()).toEqual(array)
    })
  })

  describe('jsonDataType', () => {
    it('creates a jsonDataType datatype', () => {
      expect(jsonDataType()).toEqual(json)
    })
  })

  describe('jsonBDataType', () => {
    it('creates a jsonBDataType datatype', () => {
      expect(jsonBDataType()).toEqual(jsonB)
    })
  })

  describe('blobDataType', () => {
    it('creates a blobDataType datatype', () => {
      expect(blobDataType()).toEqual(blob)
    })
  })

  describe('uuidDataType', () => {
    it('creates a uuidDataType datatype', () => {
      expect(uuidDataType()).toEqual(uuid)
    })
  })

  describe('isStringType', () => {
    const cases: [type: DataType, expected: boolean][] = [
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
    describe.each(cases)('', (type, expected) => {
      it(`${type} === ${expected}`, () => {
        expect(isStringType(type)).toEqual(expected)
      })
    })
  })

  describe('isDateTimeType', () => {
    const cases: [type: DataType, expected: boolean][] = [
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
    describe.each(cases)('', (type, expected) => {
      it(`${type} === ${expected}`, () => {
        expect(isDateTimeType(type)).toEqual(expected)
      })
    })
  })

  describe('isDateTimeType', () => {
    const cases: [type: DataType, expected: boolean][] = [
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
    describe.each(cases)('', (type, expected) => {
      it(`${type} === ${expected}`, () => {
        expect(isDateTimeType(type)).toEqual(expected)
      })
    })
  })

  describe('isDateTimeType', () => {
    const cases: [type: DataType, expected: boolean][] = [
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
    describe.each(cases)('', (type, expected) => {
      it(`${type} === ${expected}`, () => {
        expect(isDateTimeType(type)).toEqual(expected)
      })
    })
  })

  describe('isDateTimeType', () => {
    const cases: [type: DataType, expected: boolean][] = [
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
    describe.each(cases)('', (type, expected) => {
      it(`${type} === ${expected}`, () => {
        expect(isNumericType(type)).toEqual(expected)
      })
    })

    describe('isNumberType', () => {
      const cases: [type: DataType, expected: boolean][] = [
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
      describe.each(cases)('', (type, expected) => {
        it(`${type} === ${expected}`, () => {
          expect(isNumberType(type)).toEqual(expected)
        })
      })
    })

    describe('isNumberType', () => {
      const cases: [type: DataType, expected: boolean][] = [
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
      describe.each(cases)('', (type, expected) => {
        it(`${type} === ${expected}`, () => {
          expect(isIntegerType(type)).toEqual(expected)
        })
      })
    })
  })
})
