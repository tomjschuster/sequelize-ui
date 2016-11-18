'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import ConfirmDialog from './ConfirmDialog';
import CurrentModel from './CurrentModel';
import ModelList from './ModelList';

export class Main extends Component {
  render() {
    return (
      <div>
        <div className="your-models">
          <div className="row">
            <div className="col s12 m6 push-m3">
              <ModelList/>
            </div>
          </div>
        </div>
        <div className="field-definitions">
          <CurrentModel/>
        </div>
        <div className="dialogs">
          <ConfirmDialog/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({}) => ({});
const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
