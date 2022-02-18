import React from 'react'

export default function useDidMount(): boolean {
  const [didMount, setDidMount] = React.useState<boolean>(false)
  React.useEffect(() => setDidMount(true), [])
  return didMount
}
