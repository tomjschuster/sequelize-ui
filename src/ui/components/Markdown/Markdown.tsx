import { classnames, toClassname, WithClassname } from '@src/ui/styles/classnames'
import React from 'react'
import css from './markdown.module.css'

type MarkdownProps = WithClassname<{
  content: string
}>

function Markdown({ content, className }: MarkdownProps): React.ReactElement {
  const [markdown, setMarkdown] = React.useState<string>()

  React.useEffect(() => {
    renderMarkdown(content).then(setMarkdown)
  }, [content])

  return (
    <div
      className={classnames(className, toClassname(css.markdownBody))}
      dangerouslySetInnerHTML={{ __html: markdown || placeholderSpaces(content) }}
    />
  )
}

function placeholderSpaces(content: string): string {
  const lines = content.split('\n').length
  return '<br/>'.repeat(lines + 1)
}

async function renderMarkdown(content: string): Promise<string> {
  const [{ marked }, { default: DOMPurify }] = await Promise.all([
    import('marked'),
    import('dompurify'),
  ])
  return DOMPurify.sanitize(await marked(content))
}

export default React.memo(Markdown)
