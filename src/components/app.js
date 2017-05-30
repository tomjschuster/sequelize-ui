import React, { Component } from 'react'
import styles from '../../assets/style.css'
import AppBar from 'react-toolbox/lib/app_bar'
import { Layout, Panel } from 'react-toolbox'
import Autocomplete from 'react-toolbox/lib/autocomplete'

const source = {
  'ES-es': 'Spain',
  'TH-th': 'Thailand',
  'EN-gb': 'England',
  'EN-en': 'USA'
}

export default class App extends Component {
  state = {
    countries: ['ES-es', 'TH-th']
  }

  handleChange = (value) => {
    this.setState({countries: value});
  }

  render () {
    return (
      <Layout>
        <Panel>
          <AppBar title='Sequelize UI' />
            <Autocomplete
              direction="down"
              selectedPosition="above"
              label="Choose countries"
              onChange={this.handleChange}
              source={source}
              value={this.state.countries}
            />

        </Panel>
      </Layout>
    )
  }
}
