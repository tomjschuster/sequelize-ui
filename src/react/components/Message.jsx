import React from 'react'

export default class Message extends React.Component {
  constructor (props) {
    super(props)

    this.state = { visible: false }

    if (this.props.time) {
      setTimeout(() => this.hide(), this.props.time - 500)
    }
  }

  componentDidMount () {
    setTimeout(() => this.show(), 0)
  }

  show = () => this.setState({ visible: true })
  hide = () => this.setState({ visible: false })

  render () {
    const customClass = this.props.className ? ' ' + this.props.className : ''
    const errorClass = this.props.type === 'error' ? ' error' : ''
    const hiddenClass = this.state.visible ? '' : ' hidden'
    const className = 'message' + customClass + hiddenClass + errorClass
    return <div className={className}>{this.props.message}</div>
  }
}
