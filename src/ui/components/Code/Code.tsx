import { Language } from '@src/core/files'
import Highlight, { defaultProps, Language as PrismLanguage } from 'prism-react-renderer'
import React from 'react'

type CodeProps = {
  content?: string
  language?: Language
}

function Code({ content = '', language = Language.TypeScript }: CodeProps): React.ReactElement {
  return (
    <Highlight
      {...defaultProps}
      theme={undefined}
      code={content}
      language={toPrismLanguage(language)}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
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
