import { Options } from './options'

export type CommonInputProps<T> = {
  value?: T
  onChange: (value?: T) => void
}

export type CommonFieldProps = {
  id: string
  label: string
  error?: string
}

export type CommonOptionsProps<T> = Omit<CommonInputProps<T>, 'onChange'> & {
  options: Options<T>
  display: (value: T) => string
  onChange: (value: T) => void
}
