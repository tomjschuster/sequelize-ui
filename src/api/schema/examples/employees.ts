/**
 * Sample employee database
 * Copyright (C) 2007,2008, MySQL AB
 *
 * Original data created by Fusheng Wang and Carlo Zaniolo
 * http://timecenter.cs.aau.dk/software.htm
 *
 * Relational schema by Giuseppe Maxia
 * Data conversion from XML to relational by Patrick Crews
 * https://github.com/datacharmer/test_db/blob/master/employees.sql
 *
 * Sequelize UI TypeScript schema by Tom Schuster
 *
 * This work is licensed under the
 * Creative Commons Attribution-Share Alike 3.0 Unported License.
 * To view a copy of this license, visit
 * http://creativecommons.org/licenses/by-sa/3.0/ or send a letter to
 * Creative Commons, 171 Second Street, Suite 300,
 * San Francisco, California, 94105, USA.
 *
 */
import {
  association,
  belongsToType,
  dateDataType,
  enumDataType,
  field,
  hasManyType,
  integerDataType,
  manyToManyModelType,
  model,
  Model,
  schema,
  Schema,
  stringDataType,
} from '@src/core/schema'
import { fromParts } from '@src/utils/dateTime'
import { EMPLOYEES_ID } from './ids'

const time = fromParts(2020, 10, 1)

enum Id {
  Employees = '8AjE1F73O7k-d_8424U8A',
  Departments = 'UFlpanwFL8szZo5dtQct-',
  DepartmentEmployees = 'hs68eEzZVDTT7MEegYEvH',
  DepartmentManagers = 'zjM4z8Y5pvecG7TjIVajw',
  Titles = 'Ky0xNM91RIzSFEKcWUqZS',
  Salaries = 'Xq55KHZ19UT9ob31iT_D_',
}

const employee: Model = model({
  id: Id.Employees,
  name: 'employees',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      name: 'emp_no',
      type: integerDataType({ autoincrement: true }),
      primaryKey: true,
      required: true,
    }),
    field({
      name: 'birth_date',
      type: dateDataType(),
      required: true,
    }),
    field({
      name: 'first_name',
      type: stringDataType(),
      required: true,
    }),
    field({
      name: 'last_name',
      type: stringDataType(),
      required: true,
    }),
    field({
      name: 'gender',
      type: enumDataType({ values: ['M', 'F', 'O'] }),
      required: true,
    }),
    field({
      name: 'hire_date',
      type: dateDataType(),
      required: true,
    }),
  ],
  associations: [
    association({
      foreignKey: 'emp_no',
      type: hasManyType(),
      sourceModelId: Id.Employees,
      targetModelId: Id.Salaries,
    }),
    association({
      foreignKey: 'emp_no',
      type: hasManyType(),
      sourceModelId: Id.Employees,
      targetModelId: Id.Titles,
    }),
    association({
      alias: 'employingDepartment',
      foreignKey: 'emp_no',
      sourceModelId: Id.Employees,
      targetModelId: Id.Departments,
      type: manyToManyModelType(Id.DepartmentEmployees, 'dept_no'),
    }),
    association({
      alias: 'managedDepartment',
      foreignKey: 'emp_no',
      sourceModelId: Id.Employees,
      targetModelId: Id.Departments,
      type: manyToManyModelType(Id.DepartmentManagers, 'dept_no'),
    }),
  ],
})

const department: Model = model({
  id: Id.Departments,
  name: 'departments',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      name: 'dept_no',
      type: stringDataType(),
      primaryKey: true,
      required: true,
    }),
    field({
      name: 'dept_name',
      type: stringDataType(),
      required: true,
    }),
  ],
  associations: [
    association({
      alias: 'employee',
      foreignKey: 'emp_no',
      sourceModelId: Id.Departments,
      targetModelId: Id.Employees,
      type: manyToManyModelType(Id.DepartmentEmployees, 'dept_no'),
    }),
    association({
      alias: 'manager',
      foreignKey: 'emp_no',
      sourceModelId: Id.Departments,
      targetModelId: Id.Employees,
      type: manyToManyModelType(Id.DepartmentManagers, 'dept_no'),
    }),
    association({
      foreignKey: 'dept_no',
      type: hasManyType(),
      sourceModelId: Id.Departments,
      targetModelId: Id.DepartmentEmployees,
    }),
    association({
      foreignKey: 'dept_no',
      type: hasManyType(),
      sourceModelId: Id.Departments,
      targetModelId: Id.DepartmentManagers,
    }),
  ],
})

const departmentEmployee: Model = model({
  id: Id.DepartmentEmployees,
  name: 'dept_emp',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      name: 'emp_no',
      type: integerDataType(),
      primaryKey: true,
      required: true,
    }),
    field({
      name: 'dept_no',
      type: stringDataType(),
      primaryKey: true,
      required: true,
    }),
    field({
      name: 'from_date',
      type: dateDataType(),
      required: true,
    }),
    field({
      name: 'to_date',
      type: dateDataType(),
      required: true,
    }),
  ],
  associations: [
    association({
      foreignKey: 'emp_no',
      type: belongsToType(),
      sourceModelId: Id.DepartmentEmployees,
      targetModelId: Id.Employees,
    }),
    association({
      foreignKey: 'dept_no',
      type: belongsToType(),
      sourceModelId: Id.DepartmentEmployees,
      targetModelId: Id.Departments,
    }),
  ],
})

const departmentManager: Model = model({
  id: Id.DepartmentManagers,
  name: 'dept_manager',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      name: 'emp_no',
      type: integerDataType(),
      primaryKey: true,
      required: true,
    }),
    field({
      name: 'dept_no',
      type: stringDataType(),
      primaryKey: true,
      required: true,
    }),
    field({
      name: 'from_date',
      type: dateDataType(),
      required: true,
    }),
    field({
      name: 'to_date',
      type: dateDataType(),
      required: true,
    }),
  ],
  associations: [
    association({
      foreignKey: 'emp_no',
      type: belongsToType(),
      sourceModelId: Id.DepartmentManagers,
      targetModelId: Id.Employees,
    }),
    association({
      foreignKey: 'dept_no',
      type: belongsToType(),
      sourceModelId: Id.DepartmentManagers,
      targetModelId: Id.Departments,
    }),
  ],
})

const title: Model = model({
  id: Id.Titles,
  name: 'titles',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      name: 'emp_no',
      type: integerDataType({ autoincrement: false }),
      primaryKey: true,
      required: true,
    }),
    field({
      name: 'title',
      type: stringDataType(),
      required: true,
    }),
    field({
      name: 'from_date',
      type: dateDataType(),
      primaryKey: true,
      required: true,
    }),
    field({
      name: 'to_date',
      type: dateDataType(),
      required: true,
    }),
  ],
  associations: [
    association({
      foreignKey: 'emp_no',
      type: belongsToType(),
      sourceModelId: Id.Titles,
      targetModelId: Id.Employees,
    }),
  ],
})

const salary: Model = model({
  id: Id.Salaries,
  name: 'salaries',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      name: 'emp_no',
      type: integerDataType({ autoincrement: false }),
      primaryKey: true,
      required: true,
    }),
    field({
      name: 'salary',
      type: integerDataType(),
      required: true,
    }),
    field({
      name: 'from_date',
      type: dateDataType(),
      primaryKey: true,
      required: true,
    }),
    field({
      name: 'to_date',
      type: dateDataType(),
    }),
  ],
  associations: [
    association({
      foreignKey: 'emp_no',
      type: belongsToType(),
      sourceModelId: Id.Salaries,
      targetModelId: Id.Employees,
    }),
  ],
})

const employeeSchema: Schema = schema({
  id: EMPLOYEES_ID,
  name: 'employee dataset',
  createdAt: time,
  updatedAt: time,
  models: [employee, department, departmentEmployee, departmentManager, title, salary],
})

export default employeeSchema
