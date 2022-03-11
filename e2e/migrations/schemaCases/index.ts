import { ExpectedSchemaCase } from '../cases'
import { default as blogCases } from './blog'
import { default as employeesCases } from './employees'
import { default as sakilaCases } from './sakila'

const cases: ExpectedSchemaCase[] = [blogCases, employeesCases, sakilaCases]

export default cases
