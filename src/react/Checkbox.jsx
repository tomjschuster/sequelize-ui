import React from 'react'

const Checkbox = ({ id, label, checked, onCheck, className, ...props }) =>
  <div className={className ? `checkbox ${className}` : 'checkbox'} {...props}>
    <input type='checkbox' id={id} checked={checked} onChange={evt => onCheck(evt.target.checked, evt)} />
    <label htmlFor={id}>{label}</label>
  </div>

export default Checkbox
