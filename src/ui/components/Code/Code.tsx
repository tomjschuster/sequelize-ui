import { Language } from '@src/core/files/fileSystem'
import { classnames, height, overflow, padding, toClassname } from '@src/ui/styles/classnames'
import { Highlight, Language as PrismLanguage } from 'prism-react-renderer'
import React from 'react'
import Markdown from '../Markdown'
import css from './code.module.css'

type CodeProps = {
  content?: string
  language?: Language
}

function Code({ content = '', language = Language.TypeScript }: CodeProps): React.ReactElement {
  if (language === Language.Markdown) {
    return (
      <Markdown
        className={classnames(height('h-full'), overflow('overflow-y-scroll'), padding('p-4'))}
        content={content}
      />
    )
  }

  return (
    <Highlight
      // Use css
      theme={{ plain: {}, styles: [] }}
      code={content}
      language={toPrismLanguage(language)}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={classnames(toClassname(css.code), toClassname(className), height('h-full'))}
          style={{ ...style, marginTop: 0 }}
        >
          {tokens.map((line, i) => (
            // eslint-disable-next-line react/jsx-key
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                // eslint-disable-next-line react/jsx-key
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}

function toPrismLanguage(language?: Language): PrismLanguage {
  switch (language) {
    case Language.Git:
      return 'git'
    case Language.Json:
    case Language.JavaScript:
      return 'javascript'
    case Language.TypeScript:
      return 'typescript'
    default:
      return 'typescript'
  }
}

export default React.memo(Code)
