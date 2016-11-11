import React, { Component } from 'react';
import { connect } from 'react-redux';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';

const sequelizeDataTypes = [
  {textKey: 'String', valueKey: 'STRING'},
  {textKey: 'Text', valueKey: 'TEXT'},
  {textKey: 'Boolean', valueKey: 'BOOLEAN'},
  {textKey: 'Integer', valueKey: 'INTEGER'},
  {textKey: 'Decimal', valueKey: 'DECIMAL'},
  {textKey: 'Float', valueKey: 'FLOAT'},
  {textKey: 'Array', valueKey: 'ARRAY'},
  {textKey: 'Date', valueKey: 'DATE'},
];

const dataSourceConfig = {
  text: 'textKey',
  value: 'valueKey',
};


export class DataTypeDropDown extends Component {
  render() {
    let { currType, idx, onClick } = this.props;
    return (
    <IconMenu
      iconButtonElement={<FlatButton label={currType || 'Data Type'}/>}
      anchorOrigin={{horizontal: 'left', vertical: 'top'}}
      targetOrigin={{horizontal: 'left', vertical: 'top'}}>
        {sequelizeDataTypes.map((dataType, i) => (
          <MenuItem key={i}
                    primaryText={dataType.textKey}
                    onClick={() => onClick('type', dataType.valueKey, idx)} />
          ))}
    </IconMenu>

    );
  }
}


const mapStateToProps = state => ({ });
const mapDispatchToProps = dispatch => ({ });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataTypeDropDown);
