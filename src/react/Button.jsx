import React from 'react'

export default class Button extends React.Component {
  constructor (props) {
    super(props)
    this.ref = React.createRef()
  }

  focus () {
    this.ref.current.focus()
  }

  render () {
    const {
      className,
      label,
      icon,
      iconPosition,
      primary,
      secondary,
      children,
      ...props
    } = this.props

    return (
      <button
        ref={this.ref}
        className={getClass({
          className,
          icon,
          iconPosition,
          primary,
          secondary
        })}
        {...props}
      >
        {label || null}
        {children || null}
      </button>
    )
  }
}

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
        return `icon before ${icon}`
      case 'above':
        return `icon above ${icon}`
      case 'after':
        return `icon after ${icon}`
      case 'below':
        return `icon below ${icon}`
      default:
        return `icon before ${icon}`
    }
  } else {
    return null
  }
}
