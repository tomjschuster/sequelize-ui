import {
  alignItems,
  classnames,
  display,
  fontSize,
  padding,
} from '@src/ui/styles/classnames/__generated__/tailwindcss-classnames'
import { Override } from '@src/utils/types'
import React from 'react'
import { FieldProps } from '../shared/types'
import { autofillDisable } from '../shared/utils'

type CheckboxProps = Override<
  Omit<FieldProps<boolean, React.InputHTMLAttributes<HTMLInputElement>>, 'value'>,
  { checked: boolean }
>

function Checkbox({ id, label, checked, onChange, ...rest }: CheckboxProps): React.ReactElement {
  const handleChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => onChange(evt.target.checked, evt),
    [onChange],
  )

  return (
    <label className={classnames(display('flex'), alignItems('items-center'))} htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        {...autofillDisable}
        {...rest}
      />
      <span className={classnames(padding('pl-2'), fontSize('text-sm'))}>{label}</span>
    </label>
  )
}

export default React.memo(Checkbox) as typeof Checkbox
