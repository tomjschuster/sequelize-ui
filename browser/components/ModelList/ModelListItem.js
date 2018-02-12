import React from 'react'
import { connect } from 'react-redux'

/*----------  ACTION/THUNK CREATORS  ----------*/
import { removeModel } from '../../redux/models'
import { receiveModel } from '../../redux/currentModel'

/*----------  UI LIBRARY COMPONENTS  ----------*/
import { ListItem } from 'react-toolbox/lib/list'
import { IconButton } from 'react-toolbox/lib/button'

/*----------  HELPERS  ----------*/
const fieldsText = fields => {
  return `Fields: ${fields.map(({ name }) => name).join(', ')}`
}

const associationsText = (associations, modelNameObj) => {
  const targets = associations.reduce(
    (acc, assoc) =>
      acc[assoc.target]
        ? acc
        : { ...acc, [assoc.target]: modelNameObj[assoc.target] },
    {}
  )
  return `Associations: ${Object.values(targets).join(', ')}`
}

/*----------  LOCAL COMPONENTS  ----------*/
const ModelContent = ({
  model: { name, fields, associations },
  modelNameObj
}) => (
  <div>
    <h4>{name}</h4>
    {fields.length > 0 && <p>{fieldsText(fields)}</p>}
    {associations.length > 0 && (
      <p>{associationsText(associations, modelNameObj)}</p>
    )}
  </div>
)

/*----------  COMPONENT  ----------*/
const ModelListItem = ({
  model,
  isCurrent,
  selectModel,
  deleteModel,
  modelNameObj
}) => (
  <ListItem
    className={isCurrent ? 'active' : ''}
    selectable
    rightIcon={
      <IconButton
        icon="delete_forever"
        onClick={evt => {
          evt.stopPropagation()
          deleteModel(model.id)
        }}
      />
    }
    itemContent={<ModelContent model={model} modelNameObj={modelNameObj} />}
    onClick={() => selectModel(model)}
  />
)

/*----------  CONNECT  ----------*/
const mapDispatchToProps = dispatch => ({
  deleteModel: id => {
    dispatch(removeModel(id))
  },
  selectModel: model => {
    dispatch(receiveModel(model))
  }
})

export default connect(null, mapDispatchToProps)(ModelListItem)
