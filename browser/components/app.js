import React, { Component } from 'react';
import { connect } from 'react-redux';
import { requestModelDownload } from '../redux/models';
import AppBar from 'material-ui/AppBar';
import ActionHome from 'material-ui/svg-icons/action/home';
import FlatButton from 'material-ui/FlatButton';


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


const mapStateToProps = ({ models }) => ({ models });
const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
