import React, { Component } from 'react';
import { connect } from 'react-redux';
import { requestModelDownload } from '../redux/models';

/*----------  LIBRARY COMPONENTS  ----------*/
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

/*----------  COMPONENT  ----------*/
export class App extends Component {
  render() {
    let { children, models } = this.props;
    return (
      <div>
          <AppBar showMenuIconButton={false}
                  iconElementRight={<FlatButton label="Download Model"/>}
                  onRightIconButtonTouchTap={() => requestModelDownload(models)}/>
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
