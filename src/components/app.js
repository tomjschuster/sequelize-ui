import React, { Component } from 'react'
import styles from '../../assets/style.css'
console.log(styles)
export default class App extends Component {
  render () {
    return (
      <div className={styles.testClass}>
        <h1>Sequelize UI</h1>
      </div>
    )
  }
}
