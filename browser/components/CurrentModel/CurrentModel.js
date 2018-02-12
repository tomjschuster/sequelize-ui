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
    const isNew = !this.props.models.find(
      ({ id }) => id === this.props.currentModel.id
    )

    return (
      <section>
        <h3>Current Model</h3>
        <ModelToolBar
          models={this.props.models}
          currentModel={this.props.currentModel}
          isNew={isNew}
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
      </section>
    )
  }
}

export default CurrentModel
