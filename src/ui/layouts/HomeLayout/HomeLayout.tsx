import { SchemaMeta } from '@src/api/meta'
import schemaApi from '@src/api/schema'
import { Schema } from '@src/core/schema'
import IconButton from '@src/ui/components/form/IconButton'
import InfoIcon from '@src/ui/components/icons/Info'
import Modal from '@src/ui/components/Modal'
import useAsync from '@src/ui/hooks/useAsync'
import useIsOpen from '@src/ui/hooks/useIsOpen'
import { useAlert } from '@src/ui/lib/alert'
import {
  classnames,
  display,
  height,
  margin,
  minHeight,
  overflow,
  padding,
  width,
} from '@src/ui/styles/classnames'
import { flexCenter, section, title } from '@src/ui/styles/utils'
import { clear } from '@src/utils/localStorage'
import dynamic from 'next/dynamic'
import React from 'react'
import ExampleSchemaLinks from './ExampleSchemaLinks'
import MySchemaLinks from './MySchemaLinks'
import SchemasError from './SchemasError'
import SchemasZeroState from './SchemasZeroState'

const SchemaStorageInfo = dynamic(() => import('./SchemaStorageInfo'))

type HomeLayoutProps = {
  exampleMeta: SchemaMeta[]
}

const CLEAER_DATA_SUCCESS_COPY = 'All schemas deleted.'
const CLEAR_DATA_ERROR_COPY = `Failed to delete schemas. Try clearing localStorage or site data through your browser's developer console.`

export default function HomeLayout({ exampleMeta }: HomeLayoutProps): React.ReactElement {
  const { data: schemas, error, refetch, loading } = useAsync({ getData: schemaApi.listSchemas })

  const { isOpen: isInfoModalOpen, open: openInfoModal, close: closeInfoModal } = useIsOpen()

  const { success, error: logError } = useAlert()

  const handleClickClearData = async () => {
    await clear()
    refetch()
  }

  const handleConfirmMySchemaInfo = async () => {
    try {
      await schemaApi.deleteAllSchemas()
      await refetch()
      success(CLEAER_DATA_SUCCESS_COPY)
      closeInfoModal()
    } catch (e) {
      console.error(e)
      logError(CLEAR_DATA_ERROR_COPY, { ttl: 10000 })
    }
  }

  return (
    <>
      <div className={classnames(overflow('overflow-y-scroll'), height('h-full'), padding('p-6'))}>
        <div className={classnames(section, margin('mb-6'))}>
          <div className={classnames(display('flex'), title)}>
            <h2>My Schemas</h2>
            <IconButton
              className={classnames(margin('ml-1'))}
              icon={InfoIcon}
              iconProps={{ size: 5, strokeWidth: 2 }}
              label="my schemas info"
              onClick={openInfoModal}
            />
          </div>
          <div className={classnames(flexCenter, width('w-full'), minHeight('min-h-20'))}>
            <MySchemas
              schemas={schemas}
              loading={loading}
              error={error}
              onClickClearData={handleClickClearData}
            />
          </div>
        </div>
        <div className={section}>
          <h2 className={title}>Example Schemas</h2>
          <ExampleSchemaLinks exampleMeta={exampleMeta} />
        </div>
      </div>
      <Modal
        id="my-schemas-info"
        title="My Schemas"
        isOpen={isInfoModalOpen}
        onClose={closeInfoModal}
        confirmText="Clear my data"
        confirmDestructive
        onConfirm={handleConfirmMySchemaInfo}
      >
        <SchemaStorageInfo />
      </Modal>
    </>
  )
}

type MySchemasProps = {
  schemas: Schema[] | undefined
  loading: boolean
  error: Error | undefined
  onClickClearData: () => void
}
function MySchemas({
  error,
  loading,
  schemas,
  onClickClearData,
}: MySchemasProps): React.ReactElement | null {
  if (error) return <SchemasError onClickClearData={onClickClearData} />

  if (loading) return null

  if (!schemas?.length) {
    return <SchemasZeroState />
  }

  return <MySchemaLinks schemas={schemas} />
}
