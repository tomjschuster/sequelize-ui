import React from 'react'

const ToolBelt = ({ children, ...props }) => (
  <div className='toolbelt' {...props}>
    {children || null}
  </div>
)

export const ToolBeltButton = ({ icon, children, label, ...props }) => (
  <button
    className={icon ? `toolbelt__button icon ${icon}` : 'toolbelt__button'}
    {...props}
  >
    {label || null}
    {children || null}
  </button>
)

export default ToolBelt
