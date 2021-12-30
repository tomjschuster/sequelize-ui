import { Language } from '@src/core/files/fileSystem'
import { classnames, fontSize, height, overflow, padding } from '@src/ui/styles/classnames'
import Highlight, { defaultProps, Language as PrismLanguage } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/vsLight'
import React from 'react'
import Markdown from '../Markdown'

type CodeProps = {
  content?: string
  language?: Language
}

function Code({ content = '', language = Language.TypeScript }: CodeProps): React.ReactElement {
  if (language === Language.Markdown) {
    return (
      <Markdown
        className={classnames(height('h-full'), overflow('overflow-y-scroll'))}
        content={content}
      />
    )
  }

  return (
    <Highlight {...defaultProps} theme={theme} code={content} language={toPrismLanguage(language)}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className} ${classnames(
            height('h-full'),
            fontSize('text-xs', 'md:text-sm'),
            padding('p-2'),
          )}`}
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
    case Language.JavaScript:
      return 'javascript'
    case Language.Json:
      return 'json'
    case Language.TypeScript:
      return 'typescript'
    default:
      return 'typescript'
  }
}

export default React.memo(Code)
