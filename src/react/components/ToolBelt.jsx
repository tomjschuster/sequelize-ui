import React from 'react'
import PropTypes from 'prop-types'

const ToolBelt = ({ children, className, title, titleTag, ...props }) => (
  <div className={className ? `${className} toolbelt` : 'toolbelt'} {...props}>
    {title ? <Title text={title} titleTag={titleTag} /> : null}
    {children || null}
  </div>
)

ToolBelt.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.string,
  titleTag: PropTypes.string
}

const Title = ({ text, titleTag }) => {
  const TitleTag = titleTag || 'h3'
  return <TitleTag className='toolbelt__title'>{text}</TitleTag>
}

Title.propTypes = {
  text: PropTypes.string,
  titleTag: PropTypes.string
}

export default ToolBelt
