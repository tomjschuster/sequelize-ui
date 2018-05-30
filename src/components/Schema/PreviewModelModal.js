import React from 'react'
import { withMedia } from 'react-media-query-hoc'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import { Modal, Button, Icon, Table, Segment, List } from 'semantic-ui-react'

/* ----------  CONSTANTS  ---------- */
import {
  displayRelationship,
  displayOption,
  displayMethod
} from '../../constants'

/* ----------  HELPERS  ---------- */
const objectKeysWithValues = obj =>
  Object.entries(obj).reduce((acc, [k, v]) => v ? [...acc, k] : acc, [])

const objectEntriesWithValues = obj =>
  Object.entries(obj).reduce((acc, [k, v]) => v ? [...acc, [k, v]] : acc, [])

const checkIf = condition => condition
  ? <Icon color='green' name='checkmark' size='large' /> : null

const viewMethods = methods =>
  <Segment>
    <List>
      {methods.map(method =>
        <List.Item key={method}>{displayMethod(method)}</List.Item>
      )}
    </List>
  </Segment>

const viewOptions = options =>
  <Segment>
    <List>
      <List.Item><List.Header>Options</List.Header></List.Item>
      {options.map(([option, value]) =>
        <List.Item key={option}>
          {typeof value === 'boolean'
            ? displayOption(option) : `${displayOption(option)}: ${value}`
          }
        </List.Item>
      )}
    </List>
  </Segment>

const viewAssociations = (associations, modelNamesById) =>
  <Segment>
    <List>
      <List.Item><List.Header>Associations</List.Header></List.Item>
      {associations.map(({ id, target, relationship }) =>
        <List.Item key={id}>
          {displayRelationship(relationship)} {modelNamesById[target]}
        </List.Item>
      )}
    </List>
  </Segment>

const viewFields = (fields, media) => {
  return (
    media.smallScreen
      ? <React.Fragment>
        {fields.map((field, idx) => (
          <Table
            attached
            celled
            structured
            unstackable
            textAlign='center'
            key={field.id}
          >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan='2'>{field.name}</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Data Type</Table.Cell>
                <Table.Cell>{field.type}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Primary Key</Table.Cell>
                <Table.Cell>{checkIf(field.primaryKey)}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Unique Key</Table.Cell>
                <Table.Cell>{checkIf(field.unique)}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Not Null</Table.Cell>
                <Table.Cell>{checkIf(!field.allowNull)}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Default Value</Table.Cell>
                <Table.Cell>{field.default}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Auto Increment</Table.Cell>
                <Table.Cell>{checkIf(field.autoIncrement)}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        ))}
      </React.Fragment>
      : <Table celled unstackable compact textAlign='center' size='large'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Field</Table.HeaderCell>
            <Table.HeaderCell>Data Type</Table.HeaderCell>
            <Table.HeaderCell>Primary Key</Table.HeaderCell>
            <Table.HeaderCell>Unique Key</Table.HeaderCell>
            <Table.HeaderCell>Not Null</Table.HeaderCell>
            <Table.HeaderCell>Default Value</Table.HeaderCell>
            <Table.HeaderCell>Auto Increment</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fields.map(field => (
            <Table.Row key={field.id}>
              <Table.Cell>{field.name}</Table.Cell>
              <Table.Cell>{field.type}</Table.Cell>
              <Table.Cell>{checkIf(field.primaryKey)}</Table.Cell>
              <Table.Cell>{checkIf(field.unique)}</Table.Cell>
              <Table.Cell>{checkIf(!field.allowNull)}</Table.Cell>
              <Table.Cell>{field.default}</Table.Cell>
              <Table.Cell>{checkIf(field.autoIncrement)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
  )
}

class PreviewModelModal extends React.Component {
  static handleTab = (evt, otherClass) => {
    if (evt.key === 'Tab') {
      evt.preventDefault()
      document.querySelector(otherClass).focus()
    }
  }

  render () {
    const { model, close, edit, media, modelNamesById } = this.props

    const fields = model ? model.fields : []
    const methods = model ? objectKeysWithValues(model.methods) : []
    const options = model ? objectEntriesWithValues(model.config) : []
    const assocs = model ? model.associations : []

    const hasConfig =
      (fields.length + methods.length + options.length + assocs.length) > 0

    return (
      <Modal
        closeOnDimmerClick
        open={Boolean(model)}
        onClose={close}
        size='large'
        className='preview-modal'
      >
        {model &&
        <React.Fragment>
          <Modal.Header>
            {model.name}
            <Button
              className='close-btn'
              icon='cancel'
              onClick={close}
              onKeyDown={evt => PreviewModelModal.handleTab(evt, '.edit-btn')}
            />
            <Button
              className='edit-btn'
              icon='edit'
              onClick={edit}
              onKeyDown={evt => PreviewModelModal.handleTab(evt, '.close-btn')}
            />
          </Modal.Header>
          <Modal.Content>
            {hasConfig
              ? (
                <Modal.Description>
                  {fields.length ? viewFields(fields, media) : null}
                  {methods.length ? viewMethods(methods) : null}
                  {options.length ? viewOptions(options) : null}
                  {assocs.length ? viewAssociations(assocs, modelNamesById) : null}
                </Modal.Description>)
              : (
                <Modal.Description>
                  No fields or configuration.
                </Modal.Description>)
            }
          </Modal.Content>
        </React.Fragment>
        }
      </Modal>
    )
  }
}

export default withMedia(PreviewModelModal)
