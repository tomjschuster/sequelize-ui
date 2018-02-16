import React from 'react'

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
  receiveModel,
  removeModel,
  modelNameObj
}) => (
  <ListItem
    className={isCurrent ? 'active' : ''}
    selectable
    itemContent={<ModelContent model={model} modelNameObj={modelNameObj} />}
    rightIcon={
      <IconButton
        icon="delete_forever"
        onClick={evt => {
          evt.stopPropagation()
          removeModel()
        }}
      />
    }
    onClick={receiveModel}
  />
)

export default ModelListItem
