import ExternalLink from '@src/ui/routing/ExternalLink'
import { classnames, margin } from '@src/ui/styles/classnames'
import { list, text } from '@src/ui/styles/utils'
import React from 'react'

const LS_URL = 'https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage'
const XSS_URL = 'https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting'
const DEPS_URL =
  'https://raw.githubusercontent.com/tomjschuster/sequelize-ui-ts/master/package-lock.json'

export default function SchemaStorageInfo(): React.ReactElement {
  return (
    <>
      <p className={classnames(text)}>
        Sequelize UI stores schemas you create and edit in your browser&apos;s&nbsp;
        <ExternalLink newTab href={LS_URL}>
          <code>localStorage</code>
        </ExternalLink>
        . This means:
      </p>
      <ul className={classnames(list, margin('mb-4'))}>
        <li>Schemas you create are saved in the current browser on your current device.</li>
        <li>
          Clearing <code>localStorage</code> or site data from your browser&apos;s dev tools will
          erase any schemas you have created.
        </li>
        <li>
          The data for schemas you create can be read by any JavaScript running on this website.
          Sequelize UI does not intentionally send this data over the network, but&nbsp;
          <ExternalLink newTab href={XSS_URL}>
            XSS attacks
          </ExternalLink>
          &nbsp;are still possible through browser extensions or any of Sequelize UI&apos;s&nbsp;
          <ExternalLink newTab href={DEPS_URL}>
            third party dependencies
          </ExternalLink>
          .
        </li>
      </ul>
      <p className={classnames(text)}>
        Therefore, it is strongly recommend that you do not store any proprietary or personally
        identifiable information in Sequelize UI, and that you clear your data or use an incognito
        browser tab if you are on a shared device.
      </p>
      <p className={classnames(text)}>
        After clearing your data, you can still use the included example schemas to preview
        Sequelize code.
      </p>
    </>
  )
}
