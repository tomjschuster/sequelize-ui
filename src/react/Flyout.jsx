import React from 'react'

const Flyout = ({ children, className, open, title, onClose, ...props }) => {
  const classes = [
    ['flyout', true],
    ['open', open],
    [className, !!className]
  ]

  const flyoutClass =
    classes.filter(([_, x]) => x).map(([x, _]) => x).join(' ')

  return (
    <div className={flyoutClass}>
      <div className='flyout__header'>
        <button onClick={onClose}>X</button>
        {title ? <h2>{title}</h2> : null}
      </div>
      {children || null}
    </div>
  )
}

export default Flyout
