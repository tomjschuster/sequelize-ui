import React from 'react'

const Checkbox = ({
  id,
  label,
  checked,
  onCheck,
  className,
  labelProps = {},
  ...inputProps
}) => (
  <React.Fragment>
    <input
      className={className ? `checkbox ${className}` : 'checkbox'}
      type='checkbox'
      id={id}
      key={id ? id + '-checkbox' : null}
      checked={checked}
      onChange={evt => onCheck(evt.target.checked, evt)}
      {...inputProps}
    />
    <label
      className={className ? `checkbox ${className}` : 'checkbox'}
      htmlFor={id}
      key={id ? id + '-label' : null}
      {...labelProps}
    >
      {label}
    </label>
  </React.Fragment>
)

export default Checkbox
