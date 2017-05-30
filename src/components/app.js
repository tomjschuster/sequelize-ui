import React, { Component } from 'react'
import styles from '../../assets/style.css'
import AppBar from 'react-toolbox/lib/app_bar'
import { Layout, Panel } from 'react-toolbox'
import Autocomplete from 'react-toolbox/lib/autocomplete'
import Avatar from 'react-toolbox/lib/avatar'

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
    this.setState({ countries: value });
  }

  render () {
    return (
      <Layout>
        <Panel>
          <AppBar title='Sequelize UI' />
            <div style={{ padding: '2%' }}>
              <h2>Autocomplete</h2>
              <Autocomplete
                direction='down'
                selectedPosition='above'
                label='Choose countries'
                onChange={this.handleChange}
                source={source}
                value={this.state.countries}
              />
              <h2>Avatar</h2>
              <Avatar
                title='folder'
                icon='folder'
              />
              <h2>Button</h2>
              <h2>Card</h2>
              <h2>Chip</h2>
              <h2>Checkbox</h2>
              <h2>Date Picker</h2>
              <h2>Dialog</h2>
              <h2>Dropdown</h2>
              <h2>Font Icon</h2>
              <h2>Input</h2>
              <h2>Link</h2>
              <h2>List</h2>
              <h2>Menu</h2>
              <h2>Navigation</h2>
              <h2>Progress Bar</h2>
              <h2>Radio Buttons</h2>
              <h2>Slider</h2>
              <h2>Snackbar</h2>
              <h2>Switch</h2>
              <h2>Tabs</h2>
              <h2>Tooltip</h2>
            </div>
        </Panel>
      </Layout>
    )
  }
}
