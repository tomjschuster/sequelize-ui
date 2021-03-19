import EnumRadio from '@lib/components/EnumRadio'
import {
  DatabaseCaseStyle,
  DatabaseNounForm,
  DatabaseOptions,
  displayDatabaseCaseStyle,
  displayDatabaseNounForm,
  displaySqlDialect,
  SqlDialect,
} from '@lib/core'
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
      <EnumRadio
        value={dbOptions.sqlDialect}
        enumConst={SqlDialect}
        display={displaySqlDialect}
        onChange={(sqlDialect) => onChange({ ...dbOptions, sqlDialect })}
      />
      <EnumRadio
        value={dbOptions.caseStyle}
        enumConst={DatabaseCaseStyle}
        display={displayDatabaseCaseStyle}
        onChange={(caseStyle) => onChange({ ...dbOptions, caseStyle })}
      />
      <EnumRadio
        value={dbOptions.nounForm}
        enumConst={DatabaseNounForm}
        display={displayDatabaseNounForm}
        onChange={(nounForm) => onChange({ ...dbOptions, nounForm })}
      />
      <EnumRadio
        value={dbOptions.timestamps}
        enumConst={{ true: true, false: false }}
        display={(x) => (x ? 'timestamps' : 'no timestamps')}
        onChange={(timestamps) => onChange({ ...dbOptions, timestamps })}
      />
    </>
  )
}
