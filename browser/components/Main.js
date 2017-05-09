'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import ModelList from './ModelList/ModelList'
import CurrentModel from './CurrentModel/CurrentModel'
import ConfirmDialog from './ConfirmDialog'

export class Main extends Component {
  render() {
    return (
      <div>
        <ModelList/>
        <CurrentModel/>
        <ConfirmDialog/>
      </div>
    )
  }
}

const mapStateToProps = ({}) => ({})
const mapDispatchToProps = dispatch => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main)
