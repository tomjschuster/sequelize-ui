import React from 'react'
import * as Styles from './styles'

type SchemasErrorProps = {
  onClickClearData: () => void
}
export default function SchemasError({ onClickClearData }: SchemasErrorProps): React.ReactElement {
  return (
    <div className={Styles.container}>
      <p className={Styles.text}>
        Sorry, there was a problem loading your previously saved schemas.
      </p>
      <p className={Styles.text}>
        Please try the following:
        <ul className={Styles.list}>
          <li>Reload the page</li>
          <li>
            <button type="button" onClick={onClickClearData} className={Styles.clearDataButton}>
              Reset your data
            </button>
          </li>
          <li>
            <pre className={Styles.lsCode}>localStorage.clear()</pre> in your console
          </li>
        </ul>
      </p>
    </div>
  )
}
