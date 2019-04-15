import React from 'react'
import Prism from 'prismjs'
import copy from 'copy-to-clipboard'

export default class Code extends React.Component {
  constructor (props) {
    super(props)
    this.preRef = React.createRef()
  }

  componentDidMount () {
    Prism.highlightAllUnder(this.preRef.current)
  }

  copyCode = () => this.props.code && copy(this.props.code)

  render () {
    const { code, children, className, ...props } = this.props
    const classText = className ? className + ' ' : ''

    return (
      <pre
        ref={this.preRef}
        className={classText + 'language-javascript code'}
        {...props}
      >
        <code className='language-javascript'>{code || children || ''}</code>
        <div className='code__actions'>
          {this.props.copyButton ? (
            <button className='code__copy' onClick={this.copyCode}>
              Copy
            </button>
          ) : null}
          {this.props.onHide ? (
            <button className='code__hide' onClick={this.props.onHide}>
              Hide
            </button>
          ) : null}
        </div>
      </pre>
    )
  }
}
