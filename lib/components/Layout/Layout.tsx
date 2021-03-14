import Head from 'next/head'
import Link from 'next/link'
import React, { ReactNode } from 'react'
import * as styles from './styles'

type Props = {
  title: string
  children?: ReactNode
}

function Layout({ children, title }: Props): React.ReactElement {
  return (
    <>
      <Head>
        <title>{title}</title>
        <script async defer src="https://buttons.github.io/buttons.js"></script>
      </Head>
      <div className={styles.pageWrapper}>
        <header className={styles.header}>
          <Link href="/">
            <a title="Go to Sequelize UI Home" className={styles.logoLink}>
              <h1 className={styles.logoHeading}>
                <img
                  className={styles.logo}
                  src="https://sequelizeui.app/static/images/sequelize-ui-tiny-white.svg"
                />
                Sequelize UI
              </h1>
            </a>
          </Link>
        </header>
        <main className={styles.main}>{children}</main>
        <footer className={styles.footer}>
          <a
            className="github-button"
            href="https://github.com/tomjschuster/sequelize-ui"
            data-size="large"
            data-show-count="true"
            aria-label="Star tomjschuster/sequelize-ui on GitHub"
          >
            Star
          </a>
          <span className={styles.copyright}>
            Copyright &copy; {new Date().getFullYear()}
            <a className={styles.authorLink} href="https://github.com/tomjschuster">
              Tom Schuster
            </a>
          </span>
        </footer>
      </div>
    </>
  )
}

export default Layout
