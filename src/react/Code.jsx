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

  componentDidUpdate (prevProps) {
    if (prevProps.code !== this.props.code) {
      Prism.highlightAllUnder(this.preRef.current)
    }
  }

  copyCode = () => this.props.code && copy(this.props.code)

  render () {
    const {
      code,
      children,
      className,
      copyButton,
      onHide,
      ...props
    } = this.props
    const classText = className ? className + ' ' : ''

    const languageClass = this.props.language
      ? 'language-' + this.props.language
      : ''

    return (
      <pre ref={this.preRef} className={classText + languageClass} {...props}>
        <code className={languageClass}>{code || children || ''}</code>
        <div className='code__actions'>
          {copyButton ? (
            <button className='code__copy' onClick={this.copyCode}>
              Copy
            </button>
          ) : null}
          {this.props.onHide ? (
            <button className='code__hide' onClick={onHide}>
              Hide
            </button>
          ) : null}
        </div>
      </pre>
    )
  }
}

export class MultiCode extends React.Component {
  constructor (props) {
    super(props)
    this.state = { activePath: [] }
  }

  selectFile = path => this.setState({ activePath: path })

  renderExplorerItem = (fileItem, path = []) => {
    const currentPath = [...path, fileItem.name]
    if (fileItem.files) {
      return (
        <li key={fileItem.name}>
          <span>{fileItem.name}</span>
          <ul>
            {fileItem.files.map(file =>
              this.renderExplorerItem(file, currentPath)
            )}
          </ul>
        </li>
      )
    } else {
      return (
        <li key={fileItem.name}>
          <span onClick={() => this.selectFile(currentPath)}>
            {fileItem.name}
          </span>
        </li>
      )
    }
  }

  renderCode = () => {
    const file = findFile(this.state.activePath, [this.props.rootFileItem])
    const language = file ? languageFromFilename(file.name) : null
    return (
      <Code code={file ? file.content : null} language={language} copyButton />
    )
  }

  render () {
    const { className, rootFileItem, ...props } = this.props
    const classText = className ? className + ' ' : ''

    return (
      <div className={classText + 'multi-code'} {...props}>
        <div className='multi-code__explorer'>
          <ul>{this.renderExplorerItem(rootFileItem)}</ul>
        </div>
        <div className='multi-code__code'>{this.renderCode()}</div>
      </div>
    )
  }
}

const findFile = (path, files) => {
  const [currentFileName, ...restPath] = path
  const fileItem = files.find(file => file.name === currentFileName)

  if (!fileItem) {
    return null
  }

  if (restPath.length === 0 && fileItem.content) {
    return fileItem
  }

  if (restPath.length > 0 && fileItem.files) {
    return findFile(restPath, fileItem.files)
  }

  return null
}

const languageFromFilename = filename => {
  if (hardcodedLanguageFiles[filename]) {
    return hardcodedLanguageFiles[filename]
  }

  const parts = filename.split('.')

  if (parts.length <= 1) {
    return null
  }

  const extension = parts[parts.length - 1]
  return languageFromExtension(extension)
}

const hardcodedLanguageFiles = {
  '.gitignore': 'git'
}

const languageFromExtension = extension => {
  switch (extension) {
    case 'js':
      return 'javascript'
    case 'json':
      return 'json'
    default:
      return null
  }
}
