import React from 'react'
import { connect } from 'react-redux'

import { removeModel } from '../../redux/models'
import { receiveModel, resetModel } from '../../redux/currentModel'
import { modelSummary } from '../../utils'
import { ListItem } from 'react-toolbox/lib/list'
import { IconButton } from 'react-toolbox/lib/button'

const ModelListItem = ({ model, currentModel, selectModel, deleteModel }) => (
  <ListItem
    rightIcon={
      <IconButton icon="delete_forever" onClick={() => deleteModel(model)} />
    }
    caption={model.name}
    legend={modelSummary(model)}
    onClick={() => selectModel(model)}
  />
)

let lastDeleted = null

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

export default connect(null, mapDispatchToProps)(ModelListItem)
