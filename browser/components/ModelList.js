'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

/*----------  LIBRARY COMPONENTS  ----------*/
import IconButton from 'material-ui/IconButton';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';


/*----------  ICONS  ----------*/
import DeleteForeverIcon from 'material-ui/svg-icons/action/delete-forever';

/*----------  COLORS  ----------*/
import {grey200, teal200, darkBlack } from 'material-ui/styles/colors';


let SelectableList = makeSelectable(List);

/*----------  CONSTANTS AND HELPER FUNCTIONS  ----------*/
import { convertFields } from '../utils';


/*----------  COMPONENT  ----------*/
export class ModelList extends Component {
  render() {
    let { models,
          selectedIdx,
          getModel,
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
                <IconButton onClick={() => deleteModel(model, modelIdx)}>
                  <DeleteForeverIcon/>
                </IconButton>
              }
              innerDivStyle={{
                color: 'black',
                backgroundColor: selectedIdx === modelIdx ? teal200 : grey200,
                opacity: selectedIdx === modelIdx ? 0.95 : 0.85
              }}
              primaryText={model.name}
              secondaryText={`Fields: ${fieldString}`}
              secondaryTextLines={1}
              onClick={() => getModel(model, modelIdx)}
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


/*----------  CONNECT TO STORE  ----------*/
const mapStateToProps = ({ models }) => ({ models });
const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModelList);
