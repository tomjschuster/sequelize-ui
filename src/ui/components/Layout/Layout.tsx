import { classnames } from '@src/ui/styles/classnames'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

type Props = React.PropsWithChildren<{
  title: string
}>

function Layout({ children, title }: Props): React.ReactElement {
  return (
    <>
      <Head>
        <title>{title}</title>
        <script async defer src="https://buttons.github.io/buttons.js"></script>
      </Head>
      <div
        className={classnames(
          'bg-gray-50',
          'flex',
          'flex-col',
          'items-stretch',
          'h-screen',
          'w-screen',
        )}
      >
        <header className={classnames('shadow', 'p-2', 'flex', 'items-center')}>
          <Link href="/">
            <a title="Go to Sequelize UI Home" className={classnames('inline-block')}>
              <h1 className={classnames('text-2xl', 'flex', 'items-center')}>
                <img
                  className={classnames('inline', 'mr-2', 'h-8')}
                  src="https://sequelizeui.app/static/images/sequelize-ui-tiny-white.svg"
                />
                Sequelize UI
              </h1>
            </a>
          </Link>
        </header>
        <main className={classnames('flex-1')}>{children}</main>
        <footer
          className={classnames(
            'shadow-inner',
            'bg-indigo-50',
            'p-2',
            'flex',
            'justify-between',
            'items-center',
            'children:flex',
            'flex-col',
            'sm:flex-row-reverse',
          )}
        >
          <a
            className="github-button"
            href="https://github.com/tomjschuster/sequelize-ui"
            data-size="large"
            data-show-count="true"
            aria-label="Star tomjschuster/sequelize-ui on GitHub"
          >
            Star
          </a>
          <span className={classnames('mt-2', 'sm:mt-0', 'text-sm')}>
            Copyright &copy; {new Date().getFullYear()}
            <a
              className={classnames('hover:underline', 'font-bold', 'text-sm', 'ml-1.5')}
              href="https://github.com/tomjschuster"
            >
              Tom Schuster
            </a>
          </span>
        </footer>
      </div>
    </>
  )
}

export default Layout
