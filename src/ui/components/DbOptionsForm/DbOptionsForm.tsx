import {
  DbCaseStyle,
  DbNounForm,
  DbOptions,
  displayDatabaseCaseStyle,
  displayDatabaseNounForm,
  displaySqlDialect,
  SqlDialect,
} from '@src/core/database'
import Select from '@src/ui/components/form/Select'
import {
  classnames,
  display,
  gap,
  gridColumn,
  gridTemplateColumns,
} from '@src/ui/styles/classnames'
import React from 'react'
import { autofillDisable } from '../form/shared/utils'

type DbOptionsFormProps = {
  dbOptions: DbOptions
  onChange: (dbOptions: DbOptions) => void
}
export default function DbOptionsForm({
  dbOptions,
  onChange,
}: DbOptionsFormProps): React.ReactElement {
  return (
    <form
      className={classnames(
        display('grid'),
        gridTemplateColumns('grid-cols-12'),
        gap('gap-x-4', 'sm:gap-x-8', 'gap-y-1'),
      )}
      {...autofillDisable}
    >
      <Select<SqlDialect>
        id="sql-dialect"
        label="SQL dialect"
        className={classnames(gridColumn('col-span-12', '2xs:col-span-6', 'lg:col-span-4'))}
        value={dbOptions.sqlDialect}
        options={SqlDialect}
        display={displaySqlDialect}
        onChange={(sqlDialect) => onChange({ ...dbOptions, sqlDialect })}
      />
      <Select<DbCaseStyle>
        id="case-style"
        label="Case style"
        className={classnames(gridColumn('col-span-12', '2xs:col-span-6', 'lg:col-span-4'))}
        value={dbOptions.caseStyle}
        options={DbCaseStyle}
        display={displayDatabaseCaseStyle}
        onChange={(caseStyle) => onChange({ ...dbOptions, caseStyle })}
      />
      <Select<DbNounForm>
        id="noun-form"
        label="Table name format"
        className={classnames(gridColumn('col-span-12', '2xs:col-span-6', 'lg:col-span-4'))}
        value={dbOptions.nounForm}
        options={DbNounForm}
        display={displayDatabaseNounForm}
        onChange={(nounForm) => onChange({ ...dbOptions, nounForm })}
      />
      <Select<boolean | null>
        id="prefix-pks"
        label="Primary key format"
        className={classnames(gridColumn('col-span-12', '2xs:col-span-6', 'lg:col-span-4'))}
        value={dbOptions.prefixPks}
        options={{ notFound: null, false: false, true: true }}
        display={(x) => (x === null ? '' : x ? 'Table name' : 'Use "id"')}
        onChange={(prefixPks) => onChange({ ...dbOptions, prefixPks })}
      />
      <Select<boolean>
        id="timestamps"
        label="Timestamps"
        className={classnames(gridColumn('col-span-12', '2xs:col-span-6', 'lg:col-span-4'))}
        value={dbOptions.timestamps}
        options={{ true: true, false: false }}
        display={(x) => (x ? 'Yes' : 'No')}
        onChange={(timestamps) => onChange({ ...dbOptions, timestamps })}
      />
      <Select<boolean>
        id="migrations"
        label="Migrations"
        className={classnames(gridColumn('col-span-12', '2xs:col-span-6', 'lg:col-span-4'))}
        value={dbOptions.migrations}
        options={{ true: true, false: false }}
        display={(x) => (x ? 'Yes' : 'No')}
        onChange={(migrations) => onChange({ ...dbOptions, migrations })}
      />
    </form>
  )
}
