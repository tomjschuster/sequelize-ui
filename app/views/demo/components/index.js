import React, { Component } from 'react'
import { Tab, Tabs } from 'react-toolbox/lib/tabs'

import MainLayout from 'ui-library/MainLayout'

import Counter from './Counter'
import ComponentsDemo from './ComponentsDemo'
import CustomColors from './CustomColors'

export default class Demo extends Component {
  state = {
    index: 0
  }

  handleTabChange = index => {
    this.setState({ index })
  }

  render () {
    const {
      demo: { counterValue },
      incrementCounter,
      decrementCounter,
      resetCounter
    } = this.props

    return (
      <MainLayout>
        <Tabs
          index={this.state.index}
          onChange={this.handleTabChange}
        >
          <Tab label='Counter'>
            <Counter
              value={counterValue}
              increment={incrementCounter}
              decrement={decrementCounter}
              reset={resetCounter}
            />
          </Tab>
          <Tab label='Components'>
            <ComponentsDemo />
          </Tab>
          <Tab label='Custom Colors'>
            <CustomColors />
          </Tab>
        </Tabs>
      </MainLayout>
    )
  }
}
