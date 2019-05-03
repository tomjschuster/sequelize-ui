import React from 'react'
import Prism from 'prismjs'
import copy from 'copy-to-clipboard'

export default class Code extends React.Component {
  constructor (props) {
    super(props)
    this.preRef = React.createRef()
  }

  componentDidMount () {
    this.preRef.current && Prism.highlightAllUnder(this.preRef.current)
  }

  componentDidUpdate (prevProps) {
    if (prevProps.code !== this.props.code && this.preRef.current) {
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
    const classText = className ? ' ' + className : ''

    const languageClass = this.props.language
      ? ' language-' + this.props.language
      : 'language-javascript'
    console.log('code', code.length)
    return (
      <pre
        ref={this.preRef}
        className={'code' + classText + languageClass}
        {...props}
      >
        <code className={languageClass}>{code || ''}</code>
        <div className='code__actions'>
          {code && copyButton ? (
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

export class CodeExplorer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { activePath: ['my-project', 'db', 'index.js'] }
  }

  selectFile = path => this.setState({ activePath: path })

  renderExplorerItem = (fileItem, activePath, path = []) => {
    const currentPath = [...path, fileItem.name]
    const restActivePath = activePath.length === 0 ? [] : activePath.slice(1)

    if (fileItem.files) {
      return (
        <li
          className='code-explorer__directory code-explorer__file-item'
          key={fileItem.name}
        >
          <span className={'code-explorer__filename icon before folder'}>
            {fileItem.name}
          </span>
          <ul>
            {fileItem.files
              .slice(0)
              .sort(compareFiles)
              .map(file =>
                this.renderExplorerItem(file, restActivePath, currentPath)
              )}
          </ul>
        </li>
      )
    } else {
      const active =
        restActivePath.length === 0 && activePath[0] === fileItem.name
      const language = languageFromFilename(fileItem.name)
      const iconClass = language
        ? ' icon before ' + iconFromLanguage(language)
        : ' icon before code'

      const activeClass = active ? ' active' : ''

      return (
        <li
          className={
            'code-explorer__file code-explorer__file-item' + activeClass
          }
          key={fileItem.name}
        >
          <span
            className={'code-explorer__filename' + iconClass}
            onClick={() => this.selectFile(currentPath)}
          >
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
      <Code code={file ? file.content : ''} language={language} copyButton />
    )
  }

  render () {
    const { className, rootFileItem, ...props } = this.props
    const classText = className ? className + ' ' : ''

    return (
      <div className={classText + 'code-explorer'} {...props}>
        <div className='code-explorer__explorer'>
          <ul>
            {this.renderExplorerItem(rootFileItem, this.state.activePath)}
          </ul>
        </div>
        <div className='code-explorer__code'>{this.renderCode()}</div>
      </div>
    )
  }
}

const compareFiles = (a, b) => compareFileType(a, b) || compareFilename(a, b)
const compareFileType = (a, b) => (a.files ? -1 : b.files ? 1 : 0)
const compareFilename = (a, b) => a.name.localeCompare(b.name)

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

const iconFromLanguage = language => {
  switch (language) {
    case 'javascript':
      return 'nodejs'
    case 'json':
      return 'json'
    case 'git':
      return 'git'
    default:
      return null
  }
}
