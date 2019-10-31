import React from 'react'
import PropTypes from 'prop-types'
import Button from './Button'

export default class Modal extends React.Component {
  static propTypes = {
    open: PropTypes.bool,
    className: PropTypes.string,
    title: PropTypes.string,
    onClose: PropTypes.func,
    footNote: PropTypes.arrayOf(PropTypes.element),
    actions: PropTypes.arrayOf(PropTypes.element),
    children: PropTypes.arrayOf(PropTypes.element)
  }

  render () {
    const overlayClassName = this.props.open
      ? 'modal__overlay'
      : 'modal__overlay closed'

    return (
      <div className={overlayClassName}>
        <div className='modal'>
          <div className='modal__header'>
            <h2 className='modal__title'>{this.props.title}</h2>
            <Button icon='cancel' onClick={this.props.onClose} />
          </div>
          <div className='modal__body'>{this.props.children}</div>
          <div className='modal__actions'>
            {this.props.actions}
            {this.props.footNote}
          </div>
        </div>
      </div>
    )
  }
}
