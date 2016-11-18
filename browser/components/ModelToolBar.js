'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

/*----------  LIBRARY COMPONENTS  ----------*/
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';

/*----------  COLORS  ----------*/
import { red400, white, blueGrey200} from 'material-ui/styles/colors';


export class ModelToolBar extends Component {
  render() {
    let { model,
          updateModelName,
          createModel,
          saveModel,
          deleteModel } = this.props;
    return (
      <Toolbar>
        <ToolbarGroup firstChild={true}>
        <ToolbarSeparator/>
        <div className="model-name-input">
          <TextField value={model.name}
                     style={{
                       fontSize: '1.5em'
                     }}
                     onChange={updateModelName}
                     hintText="Model Name"
                     hintStyle={{color: '#555'}}/>
        </div>
        <ToolbarSeparator/>
        { model.id && <RaisedButton label="Save"
                                    primary={true}
                                    onClick={() => saveModel(model)} /> }
        { model.id && <RaisedButton label="Delete"
                                    labelColor={white}
                                    backgroundColor={red400}
                            onClick={() => deleteModel(model)} /> }
        { !model.id && <RaisedButton label="Create"
                                     disabled={!model.name}
                                     disabledBackgroundColor={blueGrey200}
                                     secondary={true}
                                     onClick={createModel} /> }
        </ToolbarGroup>
      </Toolbar>
    );
  }
}


/*----------  CONNECT TO STORE  ----------*/
const mapStateToProps = ({ models }) => ({ models });
const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModelToolBar);
