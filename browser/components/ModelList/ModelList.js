'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import ModelListItem from './ModelListItem'
import {
  List,
  ListItem,
  ListSubHeader,
  ListDivider,
  ListCheckbox
} from 'react-toolbox/lib/list'

// import { List, makeSelectable } from 'material-ui/List'
// import Subheader from 'material-ui/Subheader'
// import { darkBlack } from 'material-ui/styles/colors'

// let SelectableList = makeSelectable(List)

class ModelList extends Component {
  render() {
    let { models } = this.props
    return (
      <div className="your-models">
        <div>
          <div>
            <List>
              <div>
                <h3>
                  {models.length ? 'Your Models' : 'You have no models...'}
                </h3>
                <h4>{models.length ? 'Click to edit' : 'Create one below'}</h4>
              </div>
              {models.map((model, idx) => {
                return <ModelListItem key={idx} model={model} />
              })}
            </List>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ models }) => ({ models })
const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(ModelList)
