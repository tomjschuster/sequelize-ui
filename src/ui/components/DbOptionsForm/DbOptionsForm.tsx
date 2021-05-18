import {
  DbCaseStyle,
  DbNounForm,
  DbOptions,
  displayDatabaseCaseStyle,
  displayDatabaseNounForm,
  displaySqlDialect,
  SqlDialect,
} from '@src/core/database'
import Radio from '@src/ui/components/form/Radio'
import React from 'react'

type DbOptionsFormProps = {
  dbOptions: DbOptions
  onChange: (dbOptions: DbOptions) => void
}
export default function DbOptionsForm({
  dbOptions,
  onChange,
}: DbOptionsFormProps): React.ReactElement {
  return (
    <>
      <Radio<SqlDialect>
        value={dbOptions.sqlDialect}
        options={SqlDialect}
        display={displaySqlDialect}
        onChange={(sqlDialect) => onChange({ ...dbOptions, sqlDialect })}
      />
      <Radio<DbCaseStyle>
        value={dbOptions.caseStyle}
        options={DbCaseStyle}
        display={displayDatabaseCaseStyle}
        onChange={(caseStyle) => onChange({ ...dbOptions, caseStyle })}
      />
      <Radio<DbNounForm>
        value={dbOptions.nounForm}
        options={DbNounForm}
        display={displayDatabaseNounForm}
        onChange={(nounForm) => onChange({ ...dbOptions, nounForm })}
      />
      <Radio<boolean | null>
        value={dbOptions.prefixPks}
        options={{ true: true, false: false, notFound: null }}
        display={(x) =>
          x === null
            ? `don't change pks`
            : x
            ? 'prefix pk field with table name'
            : 'use "id" as default pk field'
        }
        onChange={(prefixPks) => onChange({ ...dbOptions, prefixPks })}
      />
      <Radio<boolean>
        value={dbOptions.timestamps}
        options={{ true: true, false: false }}
        display={(x) => (x ? 'timestamps' : 'no timestamps')}
        onChange={(timestamps) => onChange({ ...dbOptions, timestamps })}
      />
      <Radio<boolean>
        value={dbOptions.migrations}
        options={{ true: true, false: false }}
        display={(x) => (x ? 'migrations' : 'no migrations')}
        onChange={(migrations) => onChange({ ...dbOptions, migrations })}
      />
    </>
  )
}
