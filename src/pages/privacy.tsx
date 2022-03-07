import withLayout from '@src/ui/hocs/withLayout'
import ExternalLink from '@src/ui/routing/ExternalLink'
import { classnames, height, margin, maxWidth, overflow, padding } from '@src/ui/styles/classnames'
import { list, text, title } from '@src/ui/styles/utils'
import React from 'react'

function Privacy(): React.ReactElement {
  return (
    <div
      className={classnames(
        overflow('overflow-y-scroll'),
        height('h-full'),
        padding('p-6'),
        maxWidth('max-w-screen-lg'),
        margin('mx-auto'),
      )}
    >
      <h1 className={classnames(title)}>Privacy Policy</h1>
      <p className={classnames(text)}>Last updated: January 26, 2022</p>
      <p className={classnames(text)}>
        Sequelize UI does not use cookies and does not collect any personal data.
      </p>
      <p className={classnames(text)}>
        Sequelize UI is a static HTML and JavaScript application that runs entirely in your browser.
        All application data is stored locally in your browser and is never sent to any servers. In
        order for Sequelize UI to function, the following information is stored in your browser:
      </p>
      <ul className={classnames(list, margin('mb-2'))}>
        <li>
          Appearance settings, like whether the site should be displayed in light mode or dark mode
        </li>
        <li>
          Database schema models you edit through Sequelize UI&nbsp;s interface for viewing
          Sequelize ORM code
        </li>
      </ul>
      <p className={classnames(text)}>
        This data is stored directly in your browser. It contains no directly identifying
        information and can be cleared by deleting your browsing history. Sequelize UI uses{' '}
        <ExternalLink href="https://www.cloudflare.com/">Cloudflare</ExternalLink> for application
        hosting, DNS and caching. Sequelize UI data which is stored in the browser is never sent to
        Cloudflare&apos; servers or to any other third party.
      </p>
      <p className={classnames(text)}>
        Please read Cloudflare&apos;{' '}
        <ExternalLink href="https://www.cloudflare.com/privacypolicy/">privacy policy</ExternalLink>{' '}
        for more information.
      </p>
    </div>
  )
}

export default withLayout(() => ({
  title: `Sequelize UI | Privacy Policy`,
}))(Privacy)
