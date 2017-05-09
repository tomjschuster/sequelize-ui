'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Ace from './Ace'

export class NotFound extends Component {
  render() {
    return (
       <Ace />
    )
  }
}


const mapStateToProps = state => ({})
const mapDispatchToProps = dispatch => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotFound)
