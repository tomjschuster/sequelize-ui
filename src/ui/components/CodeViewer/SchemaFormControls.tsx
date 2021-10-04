import React, { ReactElement } from 'react'
import { ControlsAction, ControlsBar } from '../Flyout'
import CloseCircleIcon from '../icons/CloseCircle'
import SaveIcon from '../icons/Save'

type SchemaFormControlsProps = {
  onClickSave: () => void
  onClickCancel: () => void
}

export default function SchemaFormControls({
  onClickSave,
  onClickCancel,
}: SchemaFormControlsProps): ReactElement {
  return (
    <ControlsBar>
      <ControlsAction onClick={onClickCancel}>
        <CloseCircleIcon title="cancel" />
      </ControlsAction>
      <ControlsAction onClick={onClickSave} overlayControl>
        <SaveIcon title="save" />
      </ControlsAction>
    </ControlsBar>
  )
}
