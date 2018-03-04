import React from 'react'
import { Link } from 'react-router-dom'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { ListItem } from 'react-toolbox/lib/list'
import { Button } from 'react-toolbox/lib/button'
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu'
import {
  Card,
  CardMedia,
  CardTitle,
  CardText,
  CardActions
} from 'react-toolbox/lib/card'

/* ----------  HELPERS  ---------- */
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

/* ----------  LOCAL COMPONENTS  ---------- */
const ModelContent = ({
  model: { id, name, fields, associations },
  modelNameObj
}) => (
  <div>
    <Link to={`/models/${id}`}>{name}</Link>
    {fields.length > 0 && <p>{fieldsText(fields)}</p>}
    {associations.length > 0 && (
      <p>{associationsText(associations, modelNameObj)}</p>
    )}
  </div>
)

const ActionsMenu = ({ gotoModel, removeModel }) => (
  <IconMenu icon='more_vert'>
    <MenuItem value='edit' icon='edit' caption='Edit' onClick={gotoModel} />
    <MenuItem
      value='delete'
      icon='delete_forever'
      caption='delete'
      onClick={removeModel}
    />
  </IconMenu>
)

/* ----------  COMPONENT  ---------- */
const ModelCard = ({
  // State
  isCurrent,
  modelNameObj,
  model,
  // Actions
  gotoModel,
  removeModel
}) => (
  <Card>
    <CardTitle title={model.name} />
    {(model.fields.length > 0 || model.associations.length > 0) && (
      <CardText>
        {model.fields.length > 0 && <p>{fieldsText(model.fields)}</p>}
        {model.associations.length > 0 && (
          <p>{associationsText(model.associations, modelNameObj)}</p>
        )}
      </CardText>
    )}
    <CardActions>
      <Button label='Edit' icon='edit' onClick={gotoModel} />
      <Button label='Delete' icon='delete_forever' onClick={removeModel} />
    </CardActions>
  </Card>
)

export default ModelCard
