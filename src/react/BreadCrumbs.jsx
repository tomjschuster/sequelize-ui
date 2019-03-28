import React from 'react'

const BreadCrumbs = ({ crumbs }) => (
  <nav>
    <ol>
      {crumbs.map(({ text, onClick, disabled }) => (
        <Crumb key={text} text={text} onClick={onClick} disabled={disabled} />
      ))}
    </ol>
  </nav>
)

const Crumb = ({ text, onClick, disabled }) => (
  <li>
    <a onClick={onClick && !disabled ? onClick : null}>{text}</a>
  </li>
)

export default BreadCrumbs
