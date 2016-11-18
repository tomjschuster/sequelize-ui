'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

/*----------  ACTION/THUNK CREATORS  ----------*/
import { addModel, removeModel, updateModel } from '../redux/models';

/*----------  LOCAL COMPONENTS  ----------*/
import ModelToolBar from './ModelToolBar';
import Fields from './Fields';
import Configuration from './Configuration';

/*----------  LIBRARY COMPONENTS  ----------*/
import Paper from 'material-ui/Paper';
import {Tabs, Tab} from 'material-ui/Tabs';


/*----------  COMPONENT  ----------*/
export class ModelBuilder extends Component {
  render() {
    let { tabIdx,
          model,
          expandedFields,
          setTabIdx,
          toggleFieldState,
          updateModelName,
          addField,
          updateField,
          updateValidation,
          deleteField,
          updateConfig,
          updateMethod,
          createModel,
          saveModel,
          deleteModel } = this.props;
    return (
      <Paper>
        <ModelToolBar model={model}
                      updateModelName={updateModelName}
                      createModel={createModel}
                      saveModel={saveModel}
                      deleteModel={deleteModel}/>
        <Tabs value={tabIdx}>
          <Tab label="Fields" value={0} onClick={() => setTabIdx(0)}>
            <Fields model={model}
                    expandedFields={expandedFields}
                    toggleFieldState={toggleFieldState}
                    addField={addField}
                    updateField={updateField}
                    updateValidation={updateValidation}
                    deleteField={deleteField}/>
          </Tab>
          <Tab label="Configuration" value={1} onClick={() => setTabIdx(1)}>
            <Configuration model={model}
                           updateConfig={updateConfig}
                           updateMethod={updateMethod}/>
          </Tab>
        </Tabs>
      </Paper>
    );
  }
}


/*----------  CONNECT TO STORE  ----------*/
const mapStateToProps = ({ models }) => ({ models });
const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModelBuilder);
