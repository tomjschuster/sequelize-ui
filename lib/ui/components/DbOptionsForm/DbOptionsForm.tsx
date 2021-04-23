import {
  DatabaseCaseStyle,
  DatabaseNounForm,
  DatabaseOptions,
  displayDatabaseCaseStyle,
  displayDatabaseNounForm,
  displaySqlDialect,
  SqlDialect,
} from '@lib/core/database'
import Radio from '@lib/ui/components/form/Radio'
import React from 'react'

type DbOptionsFormProps = {
  dbOptions: DatabaseOptions
  onChange: (dbOptions: DatabaseOptions) => void
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
      <Radio<DatabaseCaseStyle>
        value={dbOptions.caseStyle}
        options={DatabaseCaseStyle}
        display={displayDatabaseCaseStyle}
        onChange={(caseStyle) => onChange({ ...dbOptions, caseStyle })}
      />
      <Radio<DatabaseNounForm>
        value={dbOptions.nounForm}
        options={DatabaseNounForm}
        display={displayDatabaseNounForm}
        onChange={(nounForm) => onChange({ ...dbOptions, nounForm })}
      />
      <Radio<boolean>
        value={dbOptions.timestamps}
        options={{ true: true, false: false }}
        display={(x) => (x ? 'timestamps' : 'no timestamps')}
        onChange={(timestamps) => onChange({ ...dbOptions, timestamps })}
      />
    </>
  )
}
