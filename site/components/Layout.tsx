import Head from 'next/head'
import Link from 'next/link'
import React, { ReactNode } from 'react'

type Props = {
  title: string
  children?: ReactNode
}

const Layout = ({ children, title }: Props) => (
  <>
    <Head>
      <title>{title}</title>
      <script async defer src="https://buttons.github.io/buttons.js"></script>
    </Head>
    <div className="flex flex-col items-stretch h-screen">
      <header className="shadow p-2">
        <Link href="/">
          <a title="Go to Sequelize UI Home" className="inline-block">
            <h1 className="text-2xl">
              <img
                className="inline mr-2 h-8"
                src="https://sequelizeui.app/static/images/sequelize-ui-tiny-white.svg"
              />
              Sequelize UI
            </h1>
          </a>
        </Link>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="shadow-inner bg-blue-100 p-4 flex justify-between items-center children:flex flex-col sm:flex-row ">
        <a
          className="github-button"
          href="https://github.com/tomjschuster/sequelize-ui"
          data-size="large"
          data-show-count="true"
          aria-label="Star tomjschuster/sequelize-ui on GitHub"
        >
          Star
        </a>
        <span className="mt-2 sm:mt-0">
          Copyright &copy; {new Date().getFullYear()}
          <a className="hover:underline font-bold ml-1.5" href="https://github.com/tomjschuster">
            Tom Schuster
          </a>
        </span>
      </footer>
    </div>
  </>
)

export default Layout
