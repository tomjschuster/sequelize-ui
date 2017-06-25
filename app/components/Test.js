import React, { Component } from 'react'
import AppBar from 'react-toolbox/lib/app_bar'
import { Layout, Panel } from 'react-toolbox/lib/layout'
import { Tab, Tabs } from 'react-toolbox/lib/tabs'

import Counter from './Counter'
import ComponentsDemo from './ComponentsDemo'
import CustomColors from './CustomColors'

export default class Test extends Component {
  state = {
    index: 0
  }

  handleTabChange = index => {
    this.setState({ index })
  }

  render () {
    return (
      <Layout>
        <Panel>
          <AppBar title='Sequelize UI' />
            <div style={{ padding: '2%' }}>
              <Tabs
                index={this.state.index}
                onChange={this.handleTabChange}
              >
                <Tab label='Counter'>
                  <Counter />
                </Tab>
                <Tab label='Components'>
                  <ComponentsDemo />
                </Tab>
                <Tab label='Custom Colors'>
                  <CustomColors />
                </Tab>
              </Tabs>
            </div>
        </Panel>
      </Layout>
    )
  }
}
