import React from 'react'
import PropTypes from 'prop-types'

export const List = ({ className, ...props }) => {
  const listClassName = className ? 'list ' + className : 'list'
  return <ul className={listClassName} {...props} />
}

List.propTypes = {
  className: PropTypes.string
}

export const Title = ({ className, text, children, ...props }) => {
  const titleClassName = className ? 'list__title ' + className : 'list__title'
  return (
    <h3 className={titleClassName} {...props}>
      {text || null}
      {children || null}
    </h3>
  )
}

export const Item = ({ className, ...props }) => {
  const itemClassName = className ? 'list__item ' + className : 'list__item'
  return <li className={itemClassName} {...props} />
}

Item.propTypes = {
  className: PropTypes.string
}

export const Content = ({ className, text, children, ...props }) => {
  const contentClassName = className
    ? 'list__item__content ' + className
    : 'list__item__content'

  return (
    <span className={contentClassName} {...props}>
      {text || children}
    </span>
  )
}

Content.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ])
}

export const Actions = ({ className, ...props }) => {
  const actionsClassName = className
    ? 'list__item__actions ' + className
    : 'list__item__actions'
  return <span className={actionsClassName} {...props} />
}

Actions.propTypes = {
  className: PropTypes.string
}
