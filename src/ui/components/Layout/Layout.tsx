import {
  alignItems,
  backgroundColor,
  boxShadow,
  classnames,
  display,
  flex,
  flexDirection,
  fontSize,
  fontWeight,
  height,
  margin,
  padding,
  textDecoration,
  width,
} from '@src/ui/styles/classnames'
import { flexCenterBetween } from '@src/ui/styles/utils'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

type Props = React.PropsWithChildren<{
  title: string
  metaDescription?: string
}>

function Layout({ children, title, metaDescription }: Props): React.ReactElement {
  return (
    <>
      <Head>
        <title>{title}</title>
        <script async defer src="https://buttons.github.io/buttons.js"></script>
        {metaDescription && <meta name="description" content={metaDescription} />}
      </Head>
      <div
        className={classnames(
          height('h-screen'),
          width('w-screen'),
          display('flex'),
          flexDirection('flex-col'),
          alignItems('items-stretch'),
          backgroundColor('bg-gray-50'),
        )}
      >
        <header
          className={classnames(
            boxShadow('shadow'),
            padding('p-2'),
            display('flex'),
            alignItems('items-center'),
          )}
        >
          <Link href="/">
            <a title="Go to Sequelize UI Home" className={classnames(display('inline-block'))}>
              <h1
                className={classnames(
                  fontSize('text-2xl'),
                  display('flex'),
                  alignItems('items-center'),
                )}
              >
                <img
                  width="50px"
                  height="50px"
                  className={classnames(display('inline'), margin('mr-2'), height('h-8'))}
                  alt="Sequelize UI logo"
                  src="https://sequelizeui.app/static/images/sequelize-ui-tiny-white.svg"
                />
                Sequelize UI
              </h1>
            </a>
          </Link>
        </header>
        <main className={classnames(flex('flex-1'))}>{children}</main>
        <footer
          className={classnames(
            flexCenterBetween,
            flexDirection('flex-col', 'sm:flex-row-reverse'),
            // display('children:flex'),
            padding('p-2'),
            backgroundColor('bg-indigo-50'),
            boxShadow('shadow-inner'),
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
          <span className={classnames(margin('mt-2', 'sm:mt-0'), fontSize('text-sm'))}>
            Copyright &copy; {new Date().getFullYear()}
            <a
              className={classnames(
                textDecoration('hover:underline'),
                fontWeight('font-bold'),
                fontSize('text-sm'),
                margin('ml-1.5'),
              )}
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
