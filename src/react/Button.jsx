import React from 'react'

const Button = ({ label, icon, iconPosition, children, ...props }) => (
  <button className={getClass({ icon, iconPosition })} {...props}>
    {label || null}
    {children || null}
  </button>
)

const getClass = ({ icon, iconPosition }) =>
  icon ? `button ${getIconClass(iconPosition)} ${icon}` : 'button'

const getIconClass = position => {
  switch (position) {
    case 'before':
      return 'icon--before'
    case 'after':
      return 'icon--after'
    case 'under':
      return 'icon--under'
    default:
      return 'icon'
  }
}

export default Button
