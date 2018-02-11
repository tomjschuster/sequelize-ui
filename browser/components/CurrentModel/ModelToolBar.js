import React from 'react'
import { connect } from 'react-redux'

import { saveModel, removeModel } from '../../redux/models'
import { resetModel, setModelName } from '../../redux/currentModel'
import Input from 'react-toolbox/lib/input'
import { Button } from 'react-toolbox/lib/button'

const ModelToolBar = ({
  models,
  currentModel,
  updateModelName,
  saveModel,
  deleteModel
}) => (
  <div>
    <Input
      value={currentModel.name}
      onChange={value => updateModelName(value)}
      label="Model Name"
    />
    {currentModel.id && (
      <Button
        label="Save"
        primary
        raised
        onClick={() => saveModel(models, currentModel, false)}
      />
    )}
    {currentModel.id && (
      <Button
        label="Delete"
        raised
        accent
        onClick={() => deleteModel(currentModel.id)}
      />
    )}
    {!currentModel.id && (
      <Button
        label="Create"
        disabled={!currentModel.name}
        primary
        raised
        onClick={() => saveModel(models, currentModel, true)}
      />
    )}
  </div>
)

const mapDispatchToProps = dispatch => ({
  saveModel: (models, model, isNew) =>
    dispatch(saveModel(models, model, isNew)),
  updateModelName: name => dispatch(setModelName(name)),
  deleteModel: id => {
    dispatch(removeModel(id))
    dispatch(resetModel())
  }
})

export default connect(null, mapDispatchToProps)(ModelToolBar)
