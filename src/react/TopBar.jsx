import React from 'react'

const TopBar = ({ onTitleClick, actions = [] }) => (
  <header className='top-bar'>
    <Title onClick={onTitleClick} />
    <div className='top-bar__actions'>
      {actions.map(item => (
        <ActionButton key={item.label} {...item} />
      ))}
    </div>
  </header>
)

const Title = ({ onClick }) => (
  <h1 onClick={onClick} className='top-bar__title'>
    Sequelize UI
  </h1>
)

const ActionButton = ({ href, newTab, onClick, label, disabled = false }) =>
  href ? (
    <a
      href={href}
      className='top-bar__actions__button'
      onClick={onClick}
      disabled={disabled}
      target={newTab ? '_blank' : '_self'}
    >
      {label}
    </a>
  ) : (
    <button
      className='top-bar__actions__button'
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )

export default TopBar
