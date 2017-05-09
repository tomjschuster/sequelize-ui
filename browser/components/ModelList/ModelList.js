'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import ModelListItem from './ModelListItem'

import { List, makeSelectable } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import { darkBlack } from 'material-ui/styles/colors'

let SelectableList = makeSelectable(List)

class ModelList extends Component {
  render() {
    let { models } = this.props
    return (
      <div className='your-models'>
        <div className='row'>
          <div className='col s12 m6 push-m3'>
            <SelectableList>
              <div>
                <h5 className='center-align' style={{color: darkBlack}}>
                  {models.length ? 'Your Models' : 'You have no models...'}
                </h5>
                <Subheader className='center-align'>
                  {models.length ? 'Click to edit' : 'Create one below'}
                </Subheader>
              </div>
              { models.map((model, idx) => {
                console.log(model)
                return (
                    <ModelListItem key={idx} model={model} />
                )
                })}
            </SelectableList>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ models }) => ({ models })
const mapDispatchToProps = dispatch => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModelList)
