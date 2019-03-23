import React from 'react'
import { withMedia } from 'react-media-query-hoc'

const topbarClassName = smallScreen =>
  smallScreen ? 'top-bar --small' : 'top-bar'

const TopBar = ({ onTitleClick, media, actions = [] }) => (
  <header className={topbarClassName(media.smallScreen)}>
    <Title onClick={onTitleClick} compact={media.tinyScreen} />
    <div className='top-bar__actions'>
      {actions.map(item => (
        <ActionButton key={item.label} {...item} />
      ))}
    </div>
  </header>
)

const Title = ({ compact, onClick }) => (
  <h1 onClick={onClick} className='top-bar__title'>
    Sequelize UI
  </h1>
)

const ActionButton = ({
  onClick = () => {},
  label,
  icon,
  disabled = false
}) => (
  <button
    className='top-bar__actions__button'
    onClick={onClick}
    disabled={disabled}
  >
    {label}
  </button>
)

export default withMedia(TopBar)
