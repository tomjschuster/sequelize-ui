import ExternalLink from '@src/ui/routing/ExternalLink'
import { goTo } from '@src/ui/routing/navigation'
import { indexRoute, isOnIndex } from '@src/ui/routing/routes'
import {
  backgroundColor,
  borderColor,
  borderRadius,
  borderWidth,
  classnames,
  display,
  fontSize,
  maxHeight,
  overflow,
  padding,
  toClassname,
} from '@src/ui/styles/classnames'
import { inlineButton, link, list, section, text } from '@src/ui/styles/utils'
import { clear } from '@src/utils/localStorage'
import React from 'react'

interface Props {
  wrapper?: React.ComponentType<{ children?: React.ReactNode }>
  children: React.ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    const { wrapper: Wrapper } = this.props
    if (this.state.hasError) {
      const view = <ErrorView />
      return Wrapper ? <Wrapper>{view}</Wrapper> : view
    }

    return this.props.children
  }
}

function ErrorView(): React.ReactElement {
  const isHome = isOnIndex()
  const handleReset = React.useCallback(async () => {
    await clear()
    await goTo(indexRoute(), { pageLoad: true })
  }, [])

  return (
    <div
      className={classnames(
        section,
        padding('p-4'),
        backgroundColor('bg-red-50'),
        maxHeight('max-h-full'),
        overflow('overflow-y-scroll'),
        backgroundColor('bg-red-50', 'dark:bg-red-900'),
        borderRadius('rounded'),
        borderWidth('border'),
        borderColor('border-red-900', 'dark:border-red-100'),
      )}
    >
      <p className={text}>Sorry, there was an unexpected error. Please try one of the following:</p>
      <ul className={list}>
        {!isHome && (
          <li>
            Return{' '}
            <ExternalLink className={link} href="/">
              home
            </ExternalLink>
          </li>
        )}
        <li>Reload the page</li>
        <li>
          <button
            type="button"
            onClick={handleReset}
            className={classnames(
              inlineButton(),
              backgroundColor('hover:bg-green-100', toClassname('hover:dark:bg-green-800')),
            )}
          >
            Reset your data
          </button>
        </li>
        <li>
          <code className={classnames(display('inline'), fontSize('text-xs'))}>
            localStorage.clear()
          </code>{' '}
          in your browser&apos;s JavaScript console
        </li>
        <li>Try another browser or device</li>
        <li>
          <a
            className={link}
            target="_blank"
            rel="noreferrer"
            href="https://github.com/tomjschuster/sequelize-ui/issues"
          >
            Open an issue
          </a>
        </li>
      </ul>
    </div>
  )
}

export default ErrorBoundary
