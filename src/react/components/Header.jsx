import React from 'react'
import PropTypes from 'prop-types'

const Header = ({ onTitleClick, actions = [] }) => (
  <header className='header-wrapper'>
    <div className='header'>
      <Title onClick={onTitleClick} />
      <div className='header__actions'>
        {actions.map(item => (
          <ActionButton key={item.label} {...item} />
        ))}
      </div>
    </div>
  </header>
)

Header.propTypes = {
  onTitleClick: PropTypes.func,
  actions: PropTypes.arrayOf(PropTypes.object)
}

const Title = ({ onClick }) => (
  <h1 onClick={onClick} className='header__title'>
    Sequelize UI
  </h1>
)

Title.propTypes = {
  onClick: PropTypes.func
}

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

ActionButton.propTypes = {
  href: PropTypes.string,
  icon: PropTypes.string,
  iconPosition: PropTypes.oneOf(['before', 'above', 'after', 'below']),
  newTab: PropTypes.bool,
  onClick: PropTypes.func,
  label: PropTypes.string,
  disabled: PropTypes.bool
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
