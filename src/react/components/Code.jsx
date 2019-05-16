import React from 'react'
import PropTypes from 'prop-types'

import Prism from 'prismjs'
import '../../style/prism-cobalt.css'
import 'prismjs/components/prism-git.js'
import 'prismjs/components/prism-json.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

import JSZip from 'jszip'
import copy from 'copy-to-clipboard'
import { saveAs } from 'file-saver'

import Button from './Button.jsx'

export class Code extends React.Component {
  constructor (props) {
    super(props)
    this.preRef = React.createRef()
  }

  componentDidMount () {
    this.preRef.current && Prism.highlightAllUnder(this.preRef.current)
  }

  componentDidUpdate (prevProps) {
    if (
      prevProps.fileItem.content !== this.props.fileItem.code &&
      this.preRef.current
    ) {
      Prism.highlightAllUnder(this.preRef.current)
    }
  }

  render () {
    const { fileItem, children, className, ...props } = this.props
    const classText = className ? ' ' + className : ''
    const language = languageFromFilename(fileItem.name)

    const languageClass = language
      ? ' language-' + language
      : ' language-javascript'

    return (
      <div className='code__container'>
        <pre ref={this.preRef} className={classText + languageClass} {...props}>
          <code className={languageClass}>{fileItem.content || ''}</code>
        </pre>
      </div>
    )
  }
}

Code.propTypes = {
  fileItem: PropTypes.object.isRequired,
  className: PropTypes.string
}

export class CodeExplorer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { activePath: ['my-project', 'db', 'index.js'] }
  }

  selectFile = path => this.setState({ activePath: path })

  activeFile = () => findFile(this.state.activePath, [this.props.fileItem])

  renderExplorerItem = (fileItem, activePath, path = [], depth = 0) => {
    const currentPath = [...path, fileItem.name]
    const restActivePath = activePath.length === 0 ? [] : activePath.slice(1)
    const depthClass = ' depth-' + depth

    const key = currentPath.join('/')

    if (fileItem.files) {
      return (
        <React.Fragment key={key + 'fragment'}>
          <li
            className={
              'code-explorer__directory code-explorer__file-item' + depthClass
            }
            key={key}
          >
            <span className={'code-explorer__filename icon before folder'}>
              {fileItem.name}
            </span>
          </li>
          {fileItem.files
            .slice(0)
            .sort(compareFiles)
            .map(file =>
              this.renderExplorerItem(
                file,
                restActivePath,
                currentPath,
                depth + 1
              )
            )}
        </React.Fragment>
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
            'code-explorer__file code-explorer__file-item' +
            activeClass +
            depthClass
          }
          key={key}
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
    const fileItem = findFile(this.state.activePath, [this.props.fileItem])
    return <Code fileItem={fileItem} />
  }

  render () {
    const { className, fileItem, ...props } = this.props
    const classText = className ? className + ' ' : ''

    return (
      <div className={classText + 'code-explorer'} {...props}>
        <div className='code-explorer__explorer'>
          <ul key={'1'}>
            {this.renderExplorerItem(fileItem, this.state.activePath)}
          </ul>
        </div>
        <div className='code-explorer__code'>{this.renderCode()}</div>
      </div>
    )
  }
}

CodeExplorer.propTypes = {
  fileItem: PropTypes.object.isRequired,
  className: PropTypes.string
}

export class CodeFlyout extends React.Component {
  constructor (props) {
    super(props)

    if (props.project) {
      this.codeExplorer = React.createRef()
    }
  }

  clearMessage = id =>
    this.setState({ messages: this.state.messages.filter(m => m.id !== id) })

  downloadCode = () => {
    if (this.props.project) {
      downloadZip(this.props.fileItem)
        .then(() => this.props.newMessage('Code downloaded', 'success'))
        .catch(() => this.props.newMessage('Error downloading', 'error'))
    } else {
      downloadFile(this.props.fileItem)
        .then(() => this.props.newMessage('Code downloaded', 'success'))
        .catch(() => this.props.newMessage('Error downloading', 'error'))
    }
  }

  copyCode = () => {
    let success = false
    try {
      if (this.props.project) {
        const file = this.codeExplorer.current.activeFile()
        if (file) {
          success = copy(file.content)
        }
      } else {
        success = copy(this.props.fileItem.content)
      }
    } catch (_) {
      success = false
    }

    if (success) {
      this.props.newMessage('Copied to clipboard', 'success')
    } else {
      this.props.newMessage('Error copying', 'error')
    }
  }

  getFile = () => {
    if (this.props.project) {
      return this.codeExplorer.current && this.codeExplorer.current.activeFile()
    } else {
      return this.props.fileItem
    }
  }

  handleClose = () => this.props.onClose()

  render () {
    const { open, project, newMessage, ...props } = this.props

    const filename = project ? props.fileItem.name : props.fileItem.name
    const flyoutClass = open ? 'code-flyout open' : 'code-flyout'

    return (
      <React.Fragment>
        <aside className={flyoutClass}>
          <div className='code-flyout__top-menu'>
            <p className='code-flyout__top-menu__filename'>{filename}</p>
            <div className='code-flyout__top-menu__buttons'>
              <Button
                label='Download'
                icon='download'
                onClick={this.downloadCode}
              />
              <Button label='Copy' icon='copy' onClick={this.copyCode} />
              <Button label='Close' icon='cancel' onClick={this.handleClose} />
            </div>
          </div>
          {project ? (
            <CodeExplorer ref={this.codeExplorer} {...props} />
          ) : (
            <Code {...props} />
          )}
        </aside>
      </React.Fragment>
    )
  }
}

CodeFlyout.propTypes = {
  fileItem: PropTypes.object.isRequired,
  project: PropTypes.bool,
  newMessage: PropTypes.func.isRequired
}

const downloadZip = ({ name = 'my-project', files }) => {
  const zip = new JSZip()
  const folder = zip.folder(name)

  files.forEach(file => zipFile(folder, file))

  return zip.generateAsync({ type: 'blob' }).then(blob => saveAs(blob, name))
}

const downloadFile = ({ name, content }) => {
  const file = new Blob([content], { type: 'text/plain;charset=utf-8' })
  return new Promise(resolve => {
    saveAs(file, name)
    resolve(true)
  })
}

const zipFile = (zip, file) => {
  if (file.files) zipDir(zip, file)
  else zip.file(file.name, file.content)
}

const zipDir = (zip, dir) => {
  const folder = zip.folder(dir.name)
  for (let file of dir.files) zipFile(folder, file)
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
