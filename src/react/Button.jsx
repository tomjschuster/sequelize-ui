import React from 'react'

const Button = ({
  className,
  label,
  icon,
  iconPosition,
  primary,
  secondary,
  children,
  ...props
}) => (
  <button
    className={getClass({ className, icon, iconPosition, primary, secondary })}
    {...props}
  >
    {label || null}
    {children || null}
  </button>
)

const getClass = ({ className, icon, iconPosition, primary, secondary }) => {
  const classes = [
    className,
    'button',
    getIconClass(icon, iconPosition),
    primary ? 'primary' : null,
    secondary ? 'secondary' : null
  ]

  return classes.filter(x => x).join(' ')
}

const getIconClass = (icon, position) => {
  if (icon) {
    switch (position) {
      case 'before':
        return `icon--before ${icon}`
      case 'after':
        return `icon--after ${icon}`
      case 'under':
        return `icon--under ${icon}`
      default:
        return `icon ${icon}`
    }
  } else {
    return null
  }
}

export default Button
