'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import { saveModel, removeModel } from '../../redux/models'
import { resetModel, setModelName } from '../../redux/currentModel'

import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar'
import { red400, white, blueGrey200} from 'material-ui/styles/colors'


export class ModelToolBar extends Component {
  render() {
    let { currentModel,
          updateModelName,
          saveModel,
          deleteModel } = this.props
    return (
      <Toolbar>
        <ToolbarGroup firstChild={true}>
        <ToolbarSeparator />
        <div className='model-name-input'>
          <TextField
            value={currentModel.name}
            style={{
              fontSize: '1.5em'
            }}
            onChange={(evt) => updateModelName(evt.target.value)}
            hintText='Model Name'
            hintStyle={{color: '#555'}}
          />
        </div>
        <ToolbarSeparator />
        { currentModel.id &&
            <RaisedButton
              label='Save'
              primary={true}
              onClick={() => saveModel(currentModel, false)}
            />
        }
        { currentModel.id &&
          <RaisedButton
            label='Delete'
            labelColor={white}
            backgroundColor={red400}
            onClick={() => deleteModel(currentModel)}
          />
        }
        { !currentModel.id &&
            <RaisedButton
              label='Create'
              disabled={!currentModel.name}
              disabledBackgroundColor={blueGrey200}
              secondary={true}
              onClick={() => saveModel(currentModel, true)}
            />
        }
        </ToolbarGroup>
      </Toolbar>
    )
  }
}


const mapStateToProps = ({ currentModel }) => ({ currentModel })
const mapDispatchToProps = dispatch => ({
  saveModel: (model, isNew) => dispatch(saveModel(model, isNew)),
  updateModelName: name => dispatch(setModelName(name)),
  deleteModel: model => {
    dispatch(removeModel(model))
    dispatch(resetModel())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModelToolBar)
