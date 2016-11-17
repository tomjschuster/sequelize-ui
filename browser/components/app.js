'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { requestDbDownload } from '../redux/models';

/*----------  LIBRARY COMPONENTS  ----------*/
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';

/*----------  ICONS  ----------*/
import GridOn from 'material-ui/svg-icons/image/grid-on';
import NewFolder from 'material-ui/svg-icons/file/create-new-folder';


/*----------  COMPONENT  ----------*/
export class App extends Component {
  render() {
    let { children, models } = this.props;
    return (
      <div>
          <AppBar title="Sequelize UI"
                  iconElementLeft={<IconButton><NewFolder /></IconButton>}
                  iconElementRight={<FlatButton label="Download Models"/>}
                  onRightIconButtonTouchTap={() => requestDbDownload(models)}/>
        <div id="main">
          { children }
        </div>
      </div>
    );
  }
}


/*----------  CONNECT  ----------*/
const mapStateToProps = ({ models }) => ({ models });
const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
