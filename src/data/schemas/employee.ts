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
import { AssociationTypeType, DataTypeType, Model, Schema, ThroughType } from '@src/core/schema'
import { fromParts } from '@src/utils/dateTime'
import { DEMO_SCHEMA_EMPLOYEE_ID } from './demoSchemaIds'

const time = fromParts(2020, 10, 1)

enum Id {
  Employees = '1',
  Departments = '2',
  DepartmentEmployees = '3',
  DepartmentManagers = '4',
  Titles = '5',
  Salaries = '6',
}

const employee: Model = {
  id: Id.Employees,
  name: 'employees',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: '1',
      name: 'emp_no',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: '2',
      name: 'birth_date',
      type: { type: DataTypeType.Date },
      required: true,
    },
    {
      id: '3',
      name: 'first_name',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      id: '4',
      name: 'last_name',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      id: '5',
      name: 'gender',
      type: { type: DataTypeType.Enum, values: ['M', 'F', 'O'] },
      required: true,
    },
    {
      id: '6',
      name: 'hire_date',
      type: { type: DataTypeType.Date },
      required: true,
    },
  ],
  associations: [
    {
      id: '1',
      foreignKey: 'emp_no',
      type: { type: AssociationTypeType.HasMany },
      sourceModelId: Id.Employees,
      targetModelId: Id.Salaries,
    },
    {
      id: '2',
      foreignKey: 'emp_no',
      type: { type: AssociationTypeType.HasMany },
      sourceModelId: Id.Employees,
      targetModelId: Id.Titles,
    },
    {
      id: '3',
      alias: 'employingDepartment',
      foreignKey: 'emp_no',
      sourceModelId: Id.Employees,
      targetModelId: Id.Departments,
      type: {
        type: AssociationTypeType.ManyToMany,
        through: { type: ThroughType.ThroughModel, modelId: Id.DepartmentEmployees },
        targetFk: 'dept_no',
      },
    },
    {
      id: '4',
      alias: 'managedDepartment',
      foreignKey: 'emp_no',
      sourceModelId: Id.Employees,
      targetModelId: Id.Departments,
      type: {
        type: AssociationTypeType.ManyToMany,
        through: { type: ThroughType.ThroughModel, modelId: Id.DepartmentManagers },
        targetFk: 'dept_no',
      },
    },
  ],
}

const department: Model = {
  id: Id.Departments,
  name: 'departments',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: '7',
      name: 'dept_no',
      type: { type: DataTypeType.String },
      primaryKey: true,
      required: true,
    },
    {
      id: '8',
      name: 'dept_name',
      type: { type: DataTypeType.String },
      required: true,
    },
  ],
  associations: [
    {
      id: '5',
      alias: 'employee',
      sourceModelId: Id.Departments,
      targetModelId: Id.Employees,
      type: {
        type: AssociationTypeType.ManyToMany,
        through: { type: ThroughType.ThroughModel, modelId: Id.DepartmentEmployees },
      },
    },
    {
      id: '5',
      alias: 'manager',
      sourceModelId: Id.Departments,
      targetModelId: Id.Employees,
      type: {
        type: AssociationTypeType.ManyToMany,
        through: { type: ThroughType.ThroughModel, modelId: Id.DepartmentManagers },
      },
    },
    {
      id: '6',
      foreignKey: 'dept_no',
      type: { type: AssociationTypeType.HasMany },
      sourceModelId: Id.Departments,
      targetModelId: Id.DepartmentEmployees,
    },
    {
      id: '7',
      foreignKey: 'dept_no',
      type: { type: AssociationTypeType.HasMany },
      sourceModelId: Id.Departments,
      targetModelId: Id.DepartmentManagers,
    },
  ],
}

const departmentEmployee: Model = {
  id: Id.DepartmentEmployees,
  name: 'dept_emp',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: '9',
      name: 'emp_no',
      type: { type: DataTypeType.Integer },
      primaryKey: true,
      required: true,
    },
    {
      id: '10',
      name: 'dept_no',
      type: { type: DataTypeType.String },
      primaryKey: true,
      required: true,
    },
    {
      id: '11',
      name: 'from_date',
      type: { type: DataTypeType.Date },
      required: true,
    },
    {
      id: '12',
      name: 'to_date',
      type: { type: DataTypeType.Date },
      required: true,
    },
  ],
  associations: [
    {
      id: '8',
      foreignKey: 'emp_no',
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: Id.DepartmentEmployees,
      targetModelId: Id.Employees,
    },
    {
      id: '9',
      foreignKey: 'dept_no',
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: Id.DepartmentEmployees,
      targetModelId: Id.Departments,
    },
  ],
}

const departmentManager: Model = {
  id: Id.DepartmentManagers,
  name: 'dept_manager',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: '13',
      name: 'emp_no',
      type: { type: DataTypeType.Integer },
      primaryKey: true,
      required: true,
    },
    {
      id: '14',
      name: 'dept_no',
      type: { type: DataTypeType.String },
      primaryKey: true,
      required: true,
    },
    {
      id: '15',
      name: 'from_date',
      type: { type: DataTypeType.Date },
      required: true,
    },
    {
      id: '16',
      name: 'to_date',
      type: { type: DataTypeType.Date },
      required: true,
    },
  ],
  associations: [
    {
      id: '10',
      foreignKey: 'emp_no',
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: Id.DepartmentManagers,
      targetModelId: Id.Employees,
    },
    {
      id: '11',
      foreignKey: 'dept_no',
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: Id.DepartmentManagers,
      targetModelId: Id.Departments,
    },
  ],
}

const title: Model = {
  id: Id.Titles,
  name: 'titles',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: '17',
      name: 'emp_no',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: '18',
      name: 'title',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      id: '19',
      name: 'from_date',
      type: { type: DataTypeType.Date },
      primaryKey: true,
      required: true,
    },
    {
      id: '20',
      name: 'to_date',
      type: { type: DataTypeType.Date },
    },
  ],
  associations: [
    {
      id: '12',
      foreignKey: 'emp_no',
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: Id.Titles,
      targetModelId: Id.Employees,
    },
  ],
}

const salary: Model = {
  id: Id.Salaries,
  name: 'salaries',
  createdAt: time,
  updatedAt: time,
  fields: [
    {
      id: '21',
      name: 'emp_no',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: '22',
      name: 'salary',
      type: { type: DataTypeType.Integer },
      required: true,
    },
    {
      id: '23',
      name: 'from_date',
      type: { type: DataTypeType.Date },
      primaryKey: true,
      required: true,
    },
    {
      id: '24',
      name: 'to_date',
      type: { type: DataTypeType.Date },
    },
  ],
  associations: [
    {
      id: '13',
      foreignKey: 'emp_no',
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: Id.Salaries,
      targetModelId: Id.Employees,
    },
  ],
}

// https://github.com/datacharmer/test_db
const employeeSchema: Schema = {
  id: DEMO_SCHEMA_EMPLOYEE_ID,
  name: 'employee dataset',
  createdAt: time,
  updatedAt: time,
  models: [employee, department, departmentEmployee, departmentManager, title, salary],
}

export default employeeSchema
