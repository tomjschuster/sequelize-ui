import React from 'react'
import PropTypes from 'prop-types'

export default class Message extends React.Component {
  constructor (props) {
    super(props)

    this.state = { visible: false }
  }

  componentDidMount () {
    setTimeout(() => this.show(), 0)
  }

  componentDidUpdate (oldProps) {
    if (oldProps.messages.length < this.props.messages.length) {
      clearTimeout(this.messageTimeout)

      if (!this.state.visible) {
        setTimeout(() => this.show(), 0)
      }

      this.messageTimeout = setTimeout(() => this.hide(), this.props.time - 500)
    }
  }

  show = () => this.setState({ visible: true })
  hide = () => this.setState({ visible: false })

  render () {
    const message = this.props.messages[0] || null
    const customClass = this.props.className ? ' ' + this.props.className : ''
    const errorClass = message && message.type === 'error' ? ' error' : ''
    const hiddenClass = this.state.visible ? '' : ' hidden'
    const className = 'message' + customClass + hiddenClass + errorClass
    return message ? <div className={className}>{message.text}</div> : null
  }
}

Message.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object),
  className: PropTypes.string,
  time: PropTypes.number
}
