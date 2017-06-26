// Adapted from https://github.com/ReactTraining/react-router
import React from 'react'
import { history } from './index'

export class Link extends React.Component {

  handleClick = (evt) => {
    const { onClick, replace, to, target } = this.props
    if (onClick) onClick(evt)

    const isValidClick = !evt.defaultPrevented &&
      evt.button === 0 && // left click
      !target &&
      !(evt.metaKey || evt.altKey || evt.ctrlKey || evt.shiftKey)

    if (isValidClick) {
      event.preventDefault()
      if (replace) {
        history.replace(to)
      } else {
        history.push(to)
      }
    }

  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { replace, to, ...props } = this.props

    const location = typeof to === 'string' ? { pathname: to } : to
    const href = history.createHref(location)

    return <a {...props} onClick={this.handleClick} href={href} />
  }
}

export default Link
