import React from 'react'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Button } from 'react-toolbox/lib/button'
import {
  Card,
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

/* ----------  COMPONENT  ---------- */
const ModelCard = ({
  // State
  isCurrent,
  modelNameObj,
  model,
  // Actions
  gotoModel,
  removeModel
}) =>
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

export default ModelCard
