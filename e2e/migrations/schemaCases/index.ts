import { ExpectedSchemaCase } from '../cases'
import { default as blogCases } from './blog'
import { default as employeesCases } from './employees'
import { default as sakilaCases } from './sakila'
import { default as studentInfoSystemCases } from './studentInfoSystem'

const cases: ExpectedSchemaCase[] = [blogCases, employeesCases, sakilaCases, studentInfoSystemCases]

export default cases
