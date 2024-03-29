import employeesSchema from '@src/api/schema/examples/employees'
import { ExpectedSchemaCase } from '../cases'

const cases: ExpectedSchemaCase = {
  schema: employeesSchema,
  tableColumns: {
    snakePlural: {
      SequelizeMeta: ['name'],
      departments: ['created_at', 'dept_name', 'dept_no', 'updated_at'],
      dept_emps: ['created_at', 'dept_no', 'emp_no', 'from_date', 'to_date', 'updated_at'],
      dept_managers: ['created_at', 'dept_no', 'emp_no', 'from_date', 'to_date', 'updated_at'],
      employees: [
        'birth_date',
        'created_at',
        'emp_no',
        'first_name',
        'gender',
        'hire_date',
        'last_name',
        'updated_at',
      ],
      salaries: ['created_at', 'emp_no', 'from_date', 'salary', 'to_date', 'updated_at'],
      titles: ['created_at', 'emp_no', 'from_date', 'title', 'to_date', 'updated_at'],
    },
    snakeSingular: {
      SequelizeMeta: ['name'],
      department: ['created_at', 'dept_name', 'dept_no', 'updated_at'],
      dept_emp: ['created_at', 'dept_no', 'emp_no', 'from_date', 'to_date', 'updated_at'],
      dept_manager: ['created_at', 'dept_no', 'emp_no', 'from_date', 'to_date', 'updated_at'],
      employee: [
        'birth_date',
        'created_at',
        'emp_no',
        'first_name',
        'gender',
        'hire_date',
        'last_name',
        'updated_at',
      ],
      salary: ['created_at', 'emp_no', 'from_date', 'salary', 'to_date', 'updated_at'],
      title: ['created_at', 'emp_no', 'from_date', 'title', 'to_date', 'updated_at'],
    },
    camelPlural: {
      SequelizeMeta: ['name'],
      Departments: ['createdAt', 'deptName', 'deptNo', 'updatedAt'],
      DeptEmps: ['createdAt', 'deptNo', 'empNo', 'fromDate', 'toDate', 'updatedAt'],
      DeptManagers: ['createdAt', 'deptNo', 'empNo', 'fromDate', 'toDate', 'updatedAt'],
      Employees: [
        'birthDate',
        'createdAt',
        'empNo',
        'firstName',
        'gender',
        'hireDate',
        'lastName',
        'updatedAt',
      ],
      Salaries: ['createdAt', 'empNo', 'fromDate', 'salary', 'toDate', 'updatedAt'],
      Titles: ['createdAt', 'empNo', 'fromDate', 'title', 'toDate', 'updatedAt'],
    },
    camelSingular: {
      SequelizeMeta: ['name'],
      Department: ['createdAt', 'deptName', 'deptNo', 'updatedAt'],
      DeptEmp: ['createdAt', 'deptNo', 'empNo', 'fromDate', 'toDate', 'updatedAt'],
      DeptManager: ['createdAt', 'deptNo', 'empNo', 'fromDate', 'toDate', 'updatedAt'],
      Employee: [
        'birthDate',
        'createdAt',
        'empNo',
        'firstName',
        'gender',
        'hireDate',
        'lastName',
        'updatedAt',
      ],
      Salary: ['createdAt', 'empNo', 'fromDate', 'salary', 'toDate', 'updatedAt'],
      Title: ['createdAt', 'empNo', 'fromDate', 'title', 'toDate', 'updatedAt'],
    },
    noTimestamps: {
      SequelizeMeta: ['name'],
      departments: ['dept_name', 'dept_no'],
      dept_emps: ['dept_no', 'emp_no', 'from_date', 'to_date'],
      dept_managers: ['dept_no', 'emp_no', 'from_date', 'to_date'],
      employees: ['birth_date', 'emp_no', 'first_name', 'gender', 'hire_date', 'last_name'],
      salaries: ['emp_no', 'from_date', 'salary', 'to_date'],
      titles: ['emp_no', 'from_date', 'title', 'to_date'],
    },
    prefixPks: {
      SequelizeMeta: ['name'],
      departments: ['created_at', 'dept_name', 'dept_no', 'updated_at'],
      dept_emps: ['created_at', 'dept_no', 'emp_no', 'from_date', 'to_date', 'updated_at'],
      dept_managers: ['created_at', 'dept_no', 'emp_no', 'from_date', 'to_date', 'updated_at'],
      employees: [
        'birth_date',
        'created_at',
        'emp_no',
        'first_name',
        'gender',
        'hire_date',
        'last_name',
        'updated_at',
      ],
      salaries: ['created_at', 'emp_no', 'from_date', 'salary', 'to_date', 'updated_at'],
      titles: ['created_at', 'emp_no', 'from_date', 'title', 'to_date', 'updated_at'],
    },
  },
}

export default cases
