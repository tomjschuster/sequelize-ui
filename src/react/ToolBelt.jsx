import React from 'react'

const ToolBelt = ({ children, className, title, titleTag, ...props }) => (
  <div className={className ? `${className} toolbelt` : 'toolbelt'} {...props}>
    {title ? <Title text={title} /> : null}
    {children || null}
  </div>
)

const Title = ({ text, titleTag }) => {
  const TitleTag = titleTag || 'h3'
  return <TitleTag className='toolbelt__title'>{text}</TitleTag>
}
export default ToolBelt
