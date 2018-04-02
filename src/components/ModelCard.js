import React from 'react'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Button, Card } from 'semantic-ui-react'

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
    <Card.Content>
      <Card.Header>{model.name}</Card.Header>
      {(model.fields.length > 0 || model.associations.length > 0) && (
        <Card.Description>
          {model.fields.length > 0 && <p>{fieldsText(model.fields)}</p>}
          {model.associations.length > 0 && (
            <p>{associationsText(model.associations, modelNameObj)}</p>
          )}
        </Card.Description>
      )}
      <Card.Content extra>
        <Button icon='edit' onClick={gotoModel} />
        <Button icon='delete' onClick={removeModel} />
      </Card.Content>
    </Card.Content>
  </Card>

export default ModelCard
