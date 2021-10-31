import React, { ReactElement } from 'react'
import { ControlsAction, ControlsBar } from '../../Flyout'

type ModelFormControlsProps = {
  onClickSave: () => void
  onClickCancel: () => void
}

export default function ModelFormControls({
  onClickSave,
  onClickCancel,
}: ModelFormControlsProps): ReactElement {
  return (
    <ControlsBar>
      <ControlsAction onClick={onClickSave} overlayControl>
        Save
      </ControlsAction>
      <ControlsAction onClick={onClickCancel}>Cancel</ControlsAction>
    </ControlsBar>
  )
}
