'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import ModelToolBar from './ModelToolBar'
import Fields from './Fields'
import Configuration from './Configuration'
import Associations from './Associations'
import Paper from 'material-ui/Paper'

import {Tabs, Tab} from 'material-ui/Tabs'


export class CurrentModel extends Component {
  constructor(props) {
    super(props)
    this.state = { tabIdx: 0 }
    this.setTabIdx = this.setTabIdx.bind(this)
  }

  setTabIdx(tabIdx) {
    this.setState({tabIdx})
  }

  render() {
    return (
      <Paper>
        <ModelToolBar />
        <Tabs
          id='current-model-tabs'
          value={this.state.tabIdx}
        >
          <Tab
            label='Fields'
            value={0}
            onClick={() => this.setTabIdx(0)}
          >
            <Fields />
          </Tab>
          <Tab
            label='Configuration'
            value={1}
            onClick={() => this.setTabIdx(1)}
          >
            <Configuration />
          </Tab>
          <Tab
            label='Associations'
            value={2}
            onClick={() => this.setTabIdx(2)}
          >
            <Associations />
          </Tab>
        </Tabs>
      </Paper>
    )
  }
}


const mapStateToProps = ({ models }) => ({ models })
const mapDispatchToProps = dispatch => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentModel)
