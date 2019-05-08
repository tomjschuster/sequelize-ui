import React from 'react'

const Header = ({ onTitleClick, actions = [] }) => (
  <header className='header'>
    <Title onClick={onTitleClick} />
    <div className='header__actions'>
      {actions.map(item => (
        <ActionButton key={item.label} {...item} />
      ))}
    </div>
  </header>
)

const Title = ({ onClick }) => (
  <h1 onClick={onClick} className='header__title'>
    Sequelize UI
  </h1>
)

const ActionButton = ({
  href,
  icon,
  iconPosition,
  newTab,
  onClick,
  label,
  disabled = false
}) => {
  const iconClassName = getIconClass(icon, iconPosition)
  return href ? (
    <a
      href={href}
      className={'header__actions__button' + iconClassName}
      onClick={onClick}
      disabled={disabled}
      target={newTab ? '_blank' : '_self'}
    >
      {label}
    </a>
  ) : (
    <button
      className={'header__actions__button' + iconClassName}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}

const getIconClass = (icon, position) => {
  if (icon) {
    switch (position) {
      case 'before':
        return ` icon before ${icon}`
      case 'above':
        return ` icon above ${icon}`
      case 'after':
        return ` icon after ${icon}`
      case 'below':
        return ` icon below ${icon}`
      default:
        return ` icon before ${icon}`
    }
  } else {
    return ''
  }
}

export default Header
