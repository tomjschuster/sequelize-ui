import { Language } from '@src/core/files/fileSystem'
import React from 'react'
import GitIcon from './Git'
import JavaScriptIcon from './JavaScript'
import JsonIcon from './Json'
import TypeScriptIcon from './TypeScript'

type LanguageIconProps = {
  language: Language
}

export default function LanguageIcon({ language }: LanguageIconProps): React.ReactElement {
  switch (language) {
    case Language.Git:
      return <GitIcon fill="#374151" />
    case Language.JavaScript:
      return <JavaScriptIcon fill="#374151" />
    case Language.Json:
      return <JsonIcon fill="#374151" />
    case Language.TypeScript:
      return <TypeScriptIcon fill="#374151" />
    default:
      return <></>
  }
}
