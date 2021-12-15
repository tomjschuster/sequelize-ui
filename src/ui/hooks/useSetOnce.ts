import React from 'react'

export default function useSetOnce(): [boolean, () => void] {
  const [state, setState_] = React.useState<boolean>(false)

  const setState = React.useCallback(() => {
    if (!state) setState_(true)
  }, [state])

  return [state, setState]
}
