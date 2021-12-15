import { classnames } from '@src/ui/styles/classnames'
import { flexCenter } from '@src/ui/styles/utils'
import React from 'react'
import ToggleButton from '../form/ToggleButton'
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
    <ToggleButton
      value={code}
      options={{ code: true, schema: false }}
      disabled={() => disabled}
      display={(v) => (
        <span className={classnames(flexCenter, 'w-16')}>
          {v ? <CodeIcon /> : <CubeIcon />}
          <span className={classnames('ml-1')}>{v ? 'Code' : 'Schema'}</span>
        </span>
      )}
      onChange={handleChange}
    />
  )
}
