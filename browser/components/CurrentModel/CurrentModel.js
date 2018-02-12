import React, { Component } from 'react'

/*----------  APP COMPONENTS  ----------*/
import ModelToolBar from './ModelToolBar'
import Fields from './Fields'
import Configuration from './Configuration'
import Associations from './Associations'

/*----------  UI LIBRARY COMPONENTS  ----------*/
import { Tab, Tabs } from 'react-toolbox'

/*----------  COMPONENT  ----------*/
export class CurrentModel extends Component {
  constructor(props) {
    super(props)
    this.state = { tabIdx: 0 }
  }

  setTabIdx = tabIdx => this.setState({ tabIdx })

  render() {
    return (
      <div>
        <ModelToolBar
          models={this.props.models}
          currentModel={this.props.currentModel}
        />
        <Tabs index={this.state.tabIdx} onChange={this.setTabIdx}>
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

export default CurrentModel
