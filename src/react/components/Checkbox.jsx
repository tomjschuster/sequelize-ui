import React from 'react'
import PropTypes from 'prop-types'

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

Checkbox.propTypes = {
  id: PropTypes.string,
  checked: PropTypes.bool,
  onCheck: PropTypes.func,
  className: PropTypes.string,
  labelProps: PropTypes.object
}

export default Checkbox
