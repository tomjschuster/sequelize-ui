'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { removeModel } from '../redux/models';
import { receiveModel, resetModel } from '../redux/currentModel';
import { convertFields } from '../utils';

import IconButton from 'material-ui/IconButton';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import DeleteForeverIcon from 'material-ui/svg-icons/action/delete-forever';
import {grey200, teal200, darkBlack } from 'material-ui/styles/colors';

let SelectableList = makeSelectable(List);

export class ModelList extends Component {
  render() {
    let { models,
          currentModel,
          receiveModel,
          deleteModel } = this.props;
    return (
      <SelectableList>
        <div>
          <h5 className="center-align" style={{color: darkBlack}}>
            {models.length ? 'Your Models' : 'You have no models...'}
          </h5>
        <Subheader className="center-align">
          {models.length ? 'Click to edit' : 'Create one below'}
        </Subheader>
        </div>
        { models.map((model, modelIdx) => {
          let fieldString = convertFields(model.fields);
          return (
            <div key={modelIdx}>
              <ListItem
                rightIconButton={
                  <IconButton onClick={() => deleteModel(model)}>
                    <DeleteForeverIcon/>
                  </IconButton>
                }
                innerDivStyle={{
                  color: 'black',
                  backgroundColor: model.id === currentModel.id ? teal200 : grey200,
                  opacity: model.id === currentModel.id ? 0.95 : 0.85
                }}
                primaryText={model.name}
                secondaryText={`Fields: ${fieldString}`}
                secondaryTextLines={1}
                onClick={() => receiveModel(model)}
              />
              <Divider inset={true} />
            </div>
          );
        })
        }
      </SelectableList>
    );
  }
}

let lastDeleted = null;

const mapStateToProps = ({ models, currentModel }) => ({ models, currentModel });
const mapDispatchToProps = dispatch => ({
  deleteModel: model => {
    dispatch(removeModel(model));
    lastDeleted = model;
    dispatch(resetModel());
  },
  receiveModel: model => {
    if (!lastDeleted || model.id !== lastDeleted.id) dispatch(receiveModel(model));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModelList);
