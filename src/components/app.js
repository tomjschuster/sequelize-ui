import React, { Component } from 'react'
import styles from '../../assets/style.css'
import AppBar from 'react-toolbox/lib/app_bar'

export default class App extends Component {
  render () {
    return (
      <div className={styles.testClass}>
        <AppBar title='Sequelize UI' />
        <p className={styles.primaryColor}>
          The primary color  
        </p>
      </div>
    )
  }
}
