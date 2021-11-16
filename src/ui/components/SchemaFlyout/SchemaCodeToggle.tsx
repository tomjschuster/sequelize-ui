import { classnames } from '@src/ui/styles/classnames'
import React from 'react'
import Toggle from '../form/Toggle'
import CodeIcon from '../icons/Code'
import CubeIcon from '../icons/Cube'

type SchemaCodeToggleProps = {
  code: boolean
  disabled: boolean
  onSelectCode: () => void
  onSelectSchema: () => void
}
export default function SchemaCodeToggle({
  code,
  disabled,
  onSelectCode,
  onSelectSchema,
}: SchemaCodeToggleProps): React.ReactElement | null {
  const handleChange = (value: boolean) => (value ? onSelectCode() : onSelectSchema())

  return (
    <Toggle
      value={code}
      options={{ code: true, schema: false }}
      disabled={() => disabled}
      display={(v) =>
        v ? (
          <span className={classnames('flex', 'items-center', 'justify-center', 'w-16')}>
            <CodeIcon />
            <span className={classnames('ml-1')}>Code</span>
          </span>
        ) : (
          <span className={classnames('flex', 'items-center', 'justify-center', 'w-16')}>
            <CubeIcon />
            <span className={classnames('ml-1')}>Schema</span>
          </span>
        )
      }
      onChange={handleChange}
    />
  )
}
