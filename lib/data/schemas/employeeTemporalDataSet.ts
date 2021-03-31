import { AssociationType, DataTypeType, Model, Schema, ThroughType } from '@lib/core'

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
    { foreignKey: 'emp_no', type: AssociationType.HasMany, targetModelId: Id.Salaries },
    { foreignKey: 'emp_no', type: AssociationType.HasMany, targetModelId: Id.Titles },
    {
      alias: 'employingDepartment',
      foreignKey: 'emp_no',
      targetFk: 'dept_no',
      type: AssociationType.ManyToMany,
      through: { type: ThroughType.ThroughModel, modelId: Id.DepartmentEmployees },
      targetModelId: Id.Departments,
    },
    {
      alias: 'managedDepartment',
      foreignKey: 'emp_no',
      targetFk: 'dept_no',
      type: AssociationType.ManyToMany,
      through: { type: ThroughType.ThroughModel, modelId: Id.DepartmentManagers },
      targetModelId: Id.Departments,
    },
  ],
}

const department: Model = {
  id: Id.Departments,
  name: 'departments',
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
      alias: 'employee',
      type: AssociationType.ManyToMany,
      through: { type: ThroughType.ThroughModel, modelId: Id.DepartmentEmployees },
      targetModelId: Id.Employees,
    },
    {
      alias: 'manager',
      type: AssociationType.ManyToMany,
      through: { type: ThroughType.ThroughModel, modelId: Id.DepartmentManagers },
      targetModelId: Id.Employees,
    },
    {
      foreignKey: 'dept_no',
      type: AssociationType.HasMany,
      targetModelId: Id.DepartmentEmployees,
    },
    { foreignKey: 'dept_no', type: AssociationType.HasMany, targetModelId: Id.DepartmentManagers },
  ],
}

const departmentEmployee: Model = {
  id: Id.DepartmentEmployees,
  name: 'dept_emp',
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
    { foreignKey: 'emp_no', type: AssociationType.BelongsTo, targetModelId: Id.Employees },
    { foreignKey: 'dept_no', type: AssociationType.BelongsTo, targetModelId: Id.Departments },
  ],
}

const departmentManager: Model = {
  id: Id.DepartmentManagers,
  name: 'dept_manager',
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
    { foreignKey: 'emp_no', type: AssociationType.BelongsTo, targetModelId: Id.Employees },
    { foreignKey: 'dept_no', type: AssociationType.BelongsTo, targetModelId: Id.Departments },
  ],
}

const title: Model = {
  id: Id.Titles,
  name: 'titles',
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
    { foreignKey: 'emp_no', type: AssociationType.BelongsTo, targetModelId: Id.Employees },
  ],
}

const salary: Model = {
  id: Id.Salaries,
  name: 'salaries',
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
    { foreignKey: 'emp_no', type: AssociationType.BelongsTo, targetModelId: Id.Employees },
  ],
}

// https://github.com/datacharmer/test_db
const schema: Schema = {
  id: 'demo-employee',
  name: 'employee_temporal_dataset',
  models: [employee, department, departmentEmployee, departmentManager, title, salary],
}

export default schema
