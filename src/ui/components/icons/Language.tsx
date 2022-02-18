import { Language } from '@src/core/files/fileSystem'
import React from 'react'
import GitIcon from './Git'
import JavaScriptIcon from './JavaScript'
import JsonIcon from './Json'
import MarkdownIcon from './Markdown'
import TypeScriptIcon from './TypeScript'

type LanguageIconProps = {
  language: Language
}

export default function LanguageIcon({ language }: LanguageIconProps): React.ReactElement {
  switch (language) {
    case Language.Git:
      return <GitIcon fill="#f34f29" />
    case Language.JavaScript:
      return <JavaScriptIcon fill="#f1dd35" />
    case Language.Json:
      return <JsonIcon fill="#f1dd35" />
    case Language.Markdown:
      return <MarkdownIcon fill="#2889b0" />
    case Language.TypeScript:
      return <TypeScriptIcon fill="#358ef1" />
    default:
      return <></>
  }
}
