import { classnames, margin } from '@src/ui/styles/classnames'
import { linkBlue, list, text } from '@src/ui/styles/utils'
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
        <a className={classnames(linkBlue)} href={LS_URL} target="_blank" rel="noreferrer">
          <code>localStorage</code>
        </a>
        . This means:
      </p>
      <ul className={classnames(list, margin('mb-4'))}>
        <li>Schemas you create are only saved in the current browser on your current device.</li>
        <li>
          Clearing <code>localStorage</code> or site data for https://sequelizeui.app in your
          browser&apos;s dev tools will erase any schemas you have created.
        </li>
        <li>
          The data for schemas you create can be read by any JavaScript running on this website.
          Sequelize UI does not explicitly send this data over the network, but&nbsp;
          <a className={classnames(linkBlue)} href={XSS_URL} target="_blank" rel="noreferrer">
            XSS attacks
          </a>
          &nbsp;are still possible through browser extensions or any of Sequelize UI&apos;s&nbsp;
          <a className={classnames(linkBlue)} href={DEPS_URL} target="_blank" rel="noreferrer">
            third party dependencies
          </a>
          .
        </li>
      </ul>
      <p className={classnames(text)}>
        Therefore, it is strongly recommend that you do not store any proprietary or personally
        identifiable information in Sequelize UI, and that you clear your data or use an incognito
        browser tab if you are on a shared device.
      </p>
      <p className={classnames(text)}>
        After clearing your data, the demo schemas will still be available to preview Sequelize code
        with different database configurations.
      </p>
    </>
  )
}
