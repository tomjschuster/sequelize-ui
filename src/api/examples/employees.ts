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
import shortid from 'shortid'
import { EMPLOYEES_ID } from './ids'

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
      id: shortid(),
      name: 'emp_no',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: shortid(),
      name: 'birth_date',
      type: { type: DataTypeType.Date },
      required: true,
    },
    {
      id: shortid(),
      name: 'first_name',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      id: shortid(),
      name: 'last_name',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      id: shortid(),
      name: 'gender',
      type: { type: DataTypeType.Enum, values: ['M', 'F', 'O'] },
      required: true,
    },
    {
      id: shortid(),
      name: 'hire_date',
      type: { type: DataTypeType.Date },
      required: true,
    },
  ],
  associations: [
    {
      id: shortid(),
      foreignKey: 'emp_no',
      type: { type: AssociationTypeType.HasMany },
      sourceModelId: Id.Employees,
      targetModelId: Id.Salaries,
    },
    {
      id: shortid(),
      foreignKey: 'emp_no',
      type: { type: AssociationTypeType.HasMany },
      sourceModelId: Id.Employees,
      targetModelId: Id.Titles,
    },
    {
      id: shortid(),
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
      id: shortid(),
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
      id: shortid(),
      name: 'dept_no',
      type: { type: DataTypeType.String },
      primaryKey: true,
      required: true,
    },
    {
      id: shortid(),
      name: 'dept_name',
      type: { type: DataTypeType.String },
      required: true,
    },
  ],
  associations: [
    {
      id: shortid(),
      alias: 'employee',
      sourceModelId: Id.Departments,
      targetModelId: Id.Employees,
      type: {
        type: AssociationTypeType.ManyToMany,
        through: { type: ThroughType.ThroughModel, modelId: Id.DepartmentEmployees },
      },
    },
    {
      id: shortid(),
      alias: 'manager',
      sourceModelId: Id.Departments,
      targetModelId: Id.Employees,
      type: {
        type: AssociationTypeType.ManyToMany,
        through: { type: ThroughType.ThroughModel, modelId: Id.DepartmentManagers },
      },
    },
    {
      id: shortid(),
      foreignKey: 'dept_no',
      type: { type: AssociationTypeType.HasMany },
      sourceModelId: Id.Departments,
      targetModelId: Id.DepartmentEmployees,
    },
    {
      id: shortid(),
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
      id: shortid(),
      name: 'emp_no',
      type: { type: DataTypeType.Integer },
      primaryKey: true,
      required: true,
    },
    {
      id: shortid(),
      name: 'dept_no',
      type: { type: DataTypeType.String },
      primaryKey: true,
      required: true,
    },
    {
      id: shortid(),
      name: 'from_date',
      type: { type: DataTypeType.Date },
      required: true,
    },
    {
      id: shortid(),
      name: 'to_date',
      type: { type: DataTypeType.Date },
      required: true,
    },
  ],
  associations: [
    {
      id: shortid(),
      foreignKey: 'emp_no',
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: Id.DepartmentEmployees,
      targetModelId: Id.Employees,
    },
    {
      id: shortid(),
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
      id: shortid(),
      name: 'emp_no',
      type: { type: DataTypeType.Integer },
      primaryKey: true,
      required: true,
    },
    {
      id: shortid(),
      name: 'dept_no',
      type: { type: DataTypeType.String },
      primaryKey: true,
      required: true,
    },
    {
      id: shortid(),
      name: 'from_date',
      type: { type: DataTypeType.Date },
      required: true,
    },
    {
      id: shortid(),
      name: 'to_date',
      type: { type: DataTypeType.Date },
      required: true,
    },
  ],
  associations: [
    {
      id: shortid(),
      foreignKey: 'emp_no',
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: Id.DepartmentManagers,
      targetModelId: Id.Employees,
    },
    {
      id: shortid(),
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
      id: shortid(),
      name: 'emp_no',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: shortid(),
      name: 'title',
      type: { type: DataTypeType.String },
      required: true,
    },
    {
      id: shortid(),
      name: 'from_date',
      type: { type: DataTypeType.Date },
      primaryKey: true,
      required: true,
    },
    {
      id: shortid(),
      name: 'to_date',
      type: { type: DataTypeType.Date },
    },
  ],
  associations: [
    {
      id: shortid(),
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
      id: shortid(),
      name: 'emp_no',
      type: { type: DataTypeType.Integer, autoincrement: true },
      primaryKey: true,
      required: true,
    },
    {
      id: shortid(),
      name: 'salary',
      type: { type: DataTypeType.Integer },
      required: true,
    },
    {
      id: shortid(),
      name: 'from_date',
      type: { type: DataTypeType.Date },
      primaryKey: true,
      required: true,
    },
    {
      id: shortid(),
      name: 'to_date',
      type: { type: DataTypeType.Date },
    },
  ],
  associations: [
    {
      id: shortid(),
      foreignKey: 'emp_no',
      type: { type: AssociationTypeType.BelongsTo },
      sourceModelId: Id.Salaries,
      targetModelId: Id.Employees,
    },
  ],
}

// https://github.com/datacharmer/test_db
const employeeSchema: Schema = {
  id: EMPLOYEES_ID,
  name: 'employee dataset',
  createdAt: time,
  updatedAt: time,
  models: [employee, department, departmentEmployee, departmentManager, title, salary],
}

export default employeeSchema
