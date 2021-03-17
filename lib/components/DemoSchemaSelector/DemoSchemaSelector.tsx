import { DemoSchemaType } from '@lib/data/schemas'
import { qsValueToStringEnum } from '@lib/utils'
import React from 'react'

type DemoSchemaSelectorProps = {
  schema?: DemoSchemaType
  onChange: (schema: DemoSchemaType) => void
}

export default function DemoSchemaSelector({
  schema,
  onChange,
}: DemoSchemaSelectorProps): React.ReactElement {
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const changedSchema = qsValueToStringEnum(DemoSchemaType, evt.target.value)
    changedSchema && onChange(changedSchema)
  }

  return (
    <div className="bg-gray-200">
      <label className="inline-flex items-center mt-3">
        <input
          type="radio"
          className="form-radio h-5 w-5 text-blue-600"
          onChange={handleChange}
          value={DemoSchemaType.Sakila}
          checked={schema == DemoSchemaType.Sakila}
        />
        <span className="ml-2 text-gray-700">Sakila</span>
      </label>

      <label className="inline-flex items-center mt-3">
        <input
          type="radio"
          className="form-radio h-5 w-5 text-blue-600"
          onChange={handleChange}
          value={DemoSchemaType.Employee}
          checked={schema === DemoSchemaType.Employee}
        />
        <span className="ml-2 text-gray-700">Temporal Employee Data Set</span>
      </label>
    </div>
  )
}
