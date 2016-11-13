import React, { Component } from 'react';
import { connect } from 'react-redux';

/*----------  LIBRARY COMPONENTS  ----------*/
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';

/*----------  CONSTANTS  ----------*/
const sequelizeDataTypes = [
  {textKey: 'String', valueKey: 'STRING'},
  {textKey: 'Text', valueKey: 'TEXT'},
  {textKey: 'Integer', valueKey: 'INTEGER'},
  {textKey: 'Float', valueKey: 'FLOAT'},
  {textKey: 'Real', valueKey: 'REAL'},
  {textKey: 'Double', valueKey: 'DOUBLE'},
  {textKey: 'Decimal', valueKey: 'DECIMAL'},
  {textKey: 'Date', valueKey: 'DATE'},
  {textKey: 'Date (without time)', valueKey: 'DATEONLY'},
  {textKey: 'Boolean', valueKey: 'BOOLEAN'},
  {textKey: 'Array', valueKey: 'ARRAY'},
  {textKey: 'JSON', valueKey: 'JSON'},
  {textKey: 'BLOB', valueKey: 'BLOB'},
  {textKey: 'UUID', valueKey: 'UUID'},
];

const dataSourceConfig = {
  text: 'textKey',
  value: 'valueKey',
};

/*----------  COMPONENT  ----------*/
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


/*----------  CONNECT  ----------*/
const mapStateToProps = state => ({ });
const mapDispatchToProps = dispatch => ({ });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataTypeDropDown);
