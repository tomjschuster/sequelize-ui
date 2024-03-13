import { ExpectedSchemaCase } from '../cases'
import { default as blogCases } from './blog'
import { default as employeesCases } from './employees'
import { default as sakilaCases } from './sakila'
import { default as studentInformationSystemCases } from './studentInformationSystem'

const cases: ExpectedSchemaCase[] = [
  blogCases,
  employeesCases,
  sakilaCases,
  studentInformationSystemCases,
]

export default cases
