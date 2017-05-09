'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import { removeModel } from '../../redux/models'
import { receiveModel, resetModel } from '../../redux/currentModel'
import { modelSummary } from '../../utils'

import IconButton from 'material-ui/IconButton'
import { ListItem } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import DeleteForeverIcon from 'material-ui/svg-icons/action/delete-forever'
import {grey200, teal200 } from 'material-ui/styles/colors'


class ModelListItem extends Component {
  render() {
    let { model,
          currentModel,
          selectModel,
          deleteModel } = this.props
    return (
      <div>
        <ListItem
          rightIconButton={
            <IconButton onClick={() => deleteModel(model)}>
              <DeleteForeverIcon />
            </IconButton>
          }
          innerDivStyle={{
            color: 'black',
            backgroundColor: model.id === currentModel.id ? teal200 : grey200,
            opacity: model.id === currentModel.id ? 0.95 : 0.85
          }}
          primaryText={model.name}
          secondaryText={modelSummary(model)}
          secondaryTextLines={1}
          onClick={() => selectModel(model)} />
        <Divider inset={true} />
      </div>
    )
  }
}

let lastDeleted = null

const mapStateToProps = ({ models, currentModel }) => ({ models, currentModel })
const mapDispatchToProps = dispatch => ({
  deleteModel: model => {
    dispatch(removeModel(model))
    lastDeleted = model
    dispatch(resetModel())
  },
  selectModel: model => {
    if (!lastDeleted || model.id !== lastDeleted.id) dispatch(receiveModel(model))
    lastDeleted = null
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModelListItem)
