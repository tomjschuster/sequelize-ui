import React from 'react'
import { connect } from 'react-redux'

/*----------  ACTION/THUNK CREATORS  ----------*/
import { saveModel, removeModel } from '../../redux/models'
import { resetModel, setModelName } from '../../redux/currentModel'

/*----------  UI LIBRARY COMPONENTS  ----------*/
import Input from 'react-toolbox/lib/input'
import { Button } from 'react-toolbox/lib/button'

/*----------  COMPONENT  ----------*/
const ModelToolBar = ({
  models,
  currentModel,
  updateModelName,
  saveModel,
  deleteModel,
  isNew
}) => (
  <div>
    <Input
      value={currentModel.name}
      onChange={value => updateModelName(value)}
      label="Model Name"
    />
    {!isNew && (
      <Button
        label="Save"
        primary
        raised
        onClick={() => saveModel(models, currentModel, false)}
      />
    )}
    {!isNew && (
      <Button
        label="Delete"
        raised
        accent
        onClick={() => deleteModel(currentModel.id)}
      />
    )}
    {isNew && (
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

/*----------  CONNECT  ----------*/
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
