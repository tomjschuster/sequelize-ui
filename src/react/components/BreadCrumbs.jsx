import React from 'react'

const BreadCrumbs = ({ crumbs }) => (
  <nav className='breadcrumbs'>
    <ol>
      {crumbs.map(({ text, onClick, disabled }) => (
        <Crumb key={text} text={text} onClick={onClick} disabled={disabled} />
      ))}
    </ol>
  </nav>
)

const Crumb = ({ text, onClick, disabled }) => (
  <li className={crumbClass({ onClick, disabled })}>
    <a onClick={onClick && !disabled ? onClick : null}>{text}</a>
  </li>
)

const crumbClass = ({ onClick, disabled }) =>
  onClick && !disabled ? 'breadcrumbs__crumb' : 'breadcrumbs__crumb inactive'

export default BreadCrumbs
