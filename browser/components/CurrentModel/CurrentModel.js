import React, { Component } from 'react'
import { connect } from 'react-redux'

import ModelToolBar from './ModelToolBar'
import Fields from './Fields'
import Configuration from './Configuration'
import Associations from './Associations'

import { Tab, Tabs } from 'react-toolbox'

export class CurrentModel extends Component {
  constructor(props) {
    super(props)
    this.state = { tabIdx: 0 }
  }

  setTabIdx = tabIdx => this.setState({ tabIdx })

  render() {
    return (
      <div>
        <ModelToolBar />
        <Tabs
          id="current-model-tabs"
          index={this.state.tabIdx}
          onChange={this.setTabIdx}
        >
          <Tab label="Fields">
            <Fields />
          </Tab>
          <Tab label="Configuration">
            <Configuration />
          </Tab>
          <Tab label="Associations">
            <Associations />
          </Tab>
        </Tabs>
      </div>
    )
  }
}

const mapStateToProps = ({ models }) => ({ models })
const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(CurrentModel)
