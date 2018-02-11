'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import { removeModel } from '../../redux/models'
import { receiveModel, resetModel } from '../../redux/currentModel'
import { modelSummary } from '../../utils'
import { ListItem, ListDivider } from 'react-toolbox/lib/list'
import { IconButton } from 'react-toolbox/lib/button'

class ModelListItem extends Component {
  render() {
    let { model, currentModel, selectModel, deleteModel } = this.props
    return (
      <div>
        <ListItem
          rightIcon={
            <IconButton
              icon="delete_forever"
              onClick={() => deleteModel(model)}
            />
          }
          caption={model.name}
          legend={modelSummary(model)}
          onClick={() => selectModel(model)}
        />
        <ListDivider inset={true} />
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
    if (!lastDeleted || model.id !== lastDeleted.id) {
      dispatch(receiveModel(model))
    }
    lastDeleted = null
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ModelListItem)
