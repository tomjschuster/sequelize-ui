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
    {
      id: '1',
      foreignKey: 'emp_no',
      type: AssociationType.HasMany,
      sourceModelId: Id.Employees,
      targetModelId: Id.Salaries,
    },
    {
      id: '2',
      foreignKey: 'emp_no',
      type: AssociationType.HasMany,
      sourceModelId: Id.Employees,
      targetModelId: Id.Titles,
    },
    {
      id: '3',
      alias: 'employingDepartment',
      foreignKey: 'emp_no',
      targetFk: 'dept_no',
      type: AssociationType.ManyToMany,
      through: { type: ThroughType.ThroughModel, modelId: Id.DepartmentEmployees },
      sourceModelId: Id.Employees,
      targetModelId: Id.Departments,
    },
    {
      id: '4',
      alias: 'managedDepartment',
      foreignKey: 'emp_no',
      targetFk: 'dept_no',
      type: AssociationType.ManyToMany,
      through: { type: ThroughType.ThroughModel, modelId: Id.DepartmentManagers },
      sourceModelId: Id.Employees,
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
      id: '5',
      alias: 'employee',
      type: AssociationType.ManyToMany,
      through: { type: ThroughType.ThroughModel, modelId: Id.DepartmentEmployees },
      sourceModelId: Id.Departments,
      targetModelId: Id.Employees,
    },
    {
      id: '5',
      alias: 'manager',
      type: AssociationType.ManyToMany,
      through: { type: ThroughType.ThroughModel, modelId: Id.DepartmentManagers },
      sourceModelId: Id.Departments,
      targetModelId: Id.Employees,
    },
    {
      id: '6',
      foreignKey: 'dept_no',
      type: AssociationType.HasMany,
      sourceModelId: Id.Departments,
      targetModelId: Id.DepartmentEmployees,
    },
    {
      id: '7',
      foreignKey: 'dept_no',
      type: AssociationType.HasMany,
      sourceModelId: Id.Departments,
      targetModelId: Id.DepartmentManagers,
    },
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
    {
      id: '8',
      foreignKey: 'emp_no',
      type: AssociationType.BelongsTo,
      sourceModelId: Id.DepartmentEmployees,
      targetModelId: Id.Employees,
    },
    {
      id: '9',
      foreignKey: 'dept_no',
      type: AssociationType.BelongsTo,
      sourceModelId: Id.DepartmentEmployees,
      targetModelId: Id.Departments,
    },
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
    {
      id: '10',
      foreignKey: 'emp_no',
      type: AssociationType.BelongsTo,
      sourceModelId: Id.DepartmentManagers,
      targetModelId: Id.Employees,
    },
    {
      id: '11',
      foreignKey: 'dept_no',
      type: AssociationType.BelongsTo,
      sourceModelId: Id.DepartmentManagers,
      targetModelId: Id.Departments,
    },
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
    {
      id: '12',
      foreignKey: 'emp_no',
      type: AssociationType.BelongsTo,
      sourceModelId: Id.Titles,
      targetModelId: Id.Employees,
    },
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
    {
      id: '13',
      foreignKey: 'emp_no',
      type: AssociationType.BelongsTo,
      sourceModelId: Id.Salaries,
      targetModelId: Id.Employees,
    },
  ],
}

// https://github.com/datacharmer/test_db
const schema: Schema = {
  id: 'demo-employee',
  name: 'employee_temporal_dataset',
  models: [employee, department, departmentEmployee, departmentManager, title, salary],
}

export default schema
