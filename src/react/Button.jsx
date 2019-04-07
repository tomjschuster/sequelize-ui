import React from 'react'

const Button = ({ label, icon, children, ...props }) => (
  <button className={icon ? `button icon ${icon}` : 'button'} {...props}>
    {label || null}
    {children || null}
  </button>
)

export default Button
