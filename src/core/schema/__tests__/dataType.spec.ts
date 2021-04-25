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
} from './__fixtures__/dataType'

fdescribe('schema dataTypes', () => {
  fdescribe('displayDataType', () => {
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
      [{ ...enum_, values: ['foo', 'bar'] }, 'Enum (foo, bar)'],
      [array, 'Array (String)'],
      [json, 'JSON'],
      [jsonB, 'JSONB'],
      [blob, 'Blob'],
      [uuid, 'UUID'],
    ]
    fdescribe.each(cases)('', (type, expected) => {
      fit(`${type} === ${expected}`, () => {
        expect(displayDataType(type)).toEqual(expected)
      })
    })
  })

  fdescribe('displayDataTypeType', () => {
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
    fdescribe.each(cases)('', (type, expected) => {
      fit(`${type} === ${expected}`, () => {
        expect(displayDataTypeType(type)).toEqual(expected)
      })
    })
  })

  fdescribe('dataTypeFromDataTypeType', () => {
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
    fdescribe.each(cases)('', (type, expected) => {
      fit(`${type} === ${expected}`, () => {
        expect(dataTypeFromDataTypeType(type)).toEqual(expected)
      })
    })
  })

  fdescribe('stringDataType', () => {
    it('creates a stringDataType datatype', () => {
      expect(stringDataType()).toEqual(string)
    })
  })

  fdescribe('textDataType', () => {
    it('creates a textDataType datatype', () => {
      expect(textDataType()).toEqual(text)
    })
  })

  fdescribe('ciTextDataType', () => {
    it('creates a ciTextDataType datatype', () => {
      expect(ciTextDataType()).toEqual(ciText)
    })
  })

  fdescribe('integerDataType', () => {
    it('creates a integerDataType datatype', () => {
      expect(integerDataType()).toEqual(integer)
    })
  })

  fdescribe('bigIntDataType', () => {
    it('creates a bigIntDataType datatype', () => {
      expect(bigIntDataType()).toEqual(bigInt)
    })
  })

  fdescribe('smallIntDataType', () => {
    it('creates a smallIntDataType datatype', () => {
      expect(smallIntDataType()).toEqual(smallInt)
    })
  })

  fdescribe('floatDataType', () => {
    it('creates a floatDataType datatype', () => {
      expect(floatDataType()).toEqual(float)
    })
  })

  fdescribe('realDataType', () => {
    it('creates a realDataType datatype', () => {
      expect(realDataType()).toEqual(real)
    })
  })

  fdescribe('doubleDataType', () => {
    it('creates a doubleDataType datatype', () => {
      expect(doubleDataType()).toEqual(double)
    })
  })

  fdescribe('decimalDataType', () => {
    it('creates a decimalDataType datatype', () => {
      expect(decimalDataType()).toEqual(decimal)
    })
  })

  fdescribe('dateTimeDataType', () => {
    it('creates a dateTimeDataType datatype', () => {
      expect(dateTimeDataType()).toEqual(dateTime)
    })
  })

  fdescribe('dateDataType', () => {
    it('creates a dateDataType datatype', () => {
      expect(dateDataType()).toEqual(date)
    })
  })

  fdescribe('timeDataType', () => {
    it('creates a timeDataType datatype', () => {
      expect(timeDataType()).toEqual(time)
    })
  })

  fdescribe('booleanDataType', () => {
    it('creates a booleanDataType datatype', () => {
      expect(booleanDataType()).toEqual(boolean)
    })
  })

  fdescribe('enumDataType', () => {
    it('creates a enumDataType datatype', () => {
      expect(enumDataType()).toEqual(enum_)
    })
  })

  fdescribe('arrayDataType', () => {
    it('creates a arrayDataType datatype', () => {
      expect(arrayDataType()).toEqual(array)
    })
  })

  fdescribe('jsonDataType', () => {
    it('creates a jsonDataType datatype', () => {
      expect(jsonDataType()).toEqual(json)
    })
  })

  fdescribe('jsonBDataType', () => {
    it('creates a jsonBDataType datatype', () => {
      expect(jsonBDataType()).toEqual(jsonB)
    })
  })

  fdescribe('blobDataType', () => {
    it('creates a blobDataType datatype', () => {
      expect(blobDataType()).toEqual(blob)
    })
  })

  fdescribe('uuidDataType', () => {
    it('creates a uuidDataType datatype', () => {
      expect(uuidDataType()).toEqual(uuid)
    })
  })

  fdescribe('isStringType', () => {
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
    fdescribe.each(cases)('', (type, expected) => {
      fit(`${type} === ${expected}`, () => {
        expect(isStringType(type)).toEqual(expected)
      })
    })
  })

  fdescribe('isDateTimeType', () => {
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
    fdescribe.each(cases)('', (type, expected) => {
      fit(`${type} === ${expected}`, () => {
        expect(isDateTimeType(type)).toEqual(expected)
      })
    })
  })

  fdescribe('isDateTimeType', () => {
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
    fdescribe.each(cases)('', (type, expected) => {
      fit(`${type} === ${expected}`, () => {
        expect(isDateTimeType(type)).toEqual(expected)
      })
    })
  })

  fdescribe('isDateTimeType', () => {
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
    fdescribe.each(cases)('', (type, expected) => {
      fit(`${type} === ${expected}`, () => {
        expect(isDateTimeType(type)).toEqual(expected)
      })
    })
  })

  fdescribe('isDateTimeType', () => {
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
    fdescribe.each(cases)('', (type, expected) => {
      fit(`${type} === ${expected}`, () => {
        expect(isNumericType(type)).toEqual(expected)
      })
    })

    fdescribe('isNumberType', () => {
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
      fdescribe.each(cases)('', (type, expected) => {
        fit(`${type} === ${expected}`, () => {
          expect(isNumberType(type)).toEqual(expected)
        })
      })
    })

    fdescribe('isNumberType', () => {
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
      fdescribe.each(cases)('', (type, expected) => {
        fit(`${type} === ${expected}`, () => {
          expect(isIntegerType(type)).toEqual(expected)
        })
      })
    })
  })
})
