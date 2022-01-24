import { SchemaMeta } from '@src/api/meta'
import schemaApi from '@src/api/schema'
import RouteLink from '@src/routing/RouteLink'
import { newSchemaRoute } from '@src/routing/routes'
import IconButton from '@src/ui/components/form/IconButton'
import InfoIcon from '@src/ui/components/icons/Info'
import Modal from '@src/ui/components/Modal'
import useAsync from '@src/ui/hooks/useAsync'
import useIsOpen from '@src/ui/hooks/useIsOpen'
import { useAlert } from '@src/ui/lib/alert'
import {
  alignItems,
  backgroundColor,
  classnames,
  display,
  fontSize,
  fontWeight,
  height,
  letterSpacing,
  lineHeight,
  margin,
  maxWidth,
  overflow,
  padding,
  textAlign,
  verticalAlign,
  width,
} from '@src/ui/styles/classnames'
import { flexCenter, inlineButton, section, title } from '@src/ui/styles/utils'
import { clear } from '@src/utils/localStorage'
import dynamic from 'next/dynamic'
import React from 'react'
import ExampleSchemaLinks from './ExampleSchemaLinks'
import MySchemaLinks from './MySchemaLinks'
import SchemasError from './SchemasError'

const SchemaStorageInfo = dynamic(() => import('./SchemaStorageInfo'))

type HomeLayoutProps = {
  exampleMeta: SchemaMeta[]
}

const CLEAER_DATA_SUCCESS_COPY = 'All schemas deleted.'
const CLEAR_DATA_ERROR_COPY = `Failed to delete schemas. Try clearing localStorage or site data through your browser's developer console.`

export default function HomeLayout({ exampleMeta }: HomeLayoutProps): React.ReactElement {
  const { data: schemas, error, refetch } = useAsync({ getData: schemaApi.listSchemas })

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
          <div className={classnames(margin('mb-6'))}>
            <h2
              className={classnames(
                fontSize('text-5xl'),
                letterSpacing('tracking-wider'),
                fontWeight('font-semibold'),
                textAlign('text-center'),
                margin('my-6'),
              )}
            >
              <img
                width="100px"
                height="100px"
                className={classnames(
                  display('inline'),
                  height('h-12'),
                  width('w-12'),
                  margin('mr-4'),
                )}
                alt=""
                src="/images/sequelize-ui-logo-small.svg"
              />
              Sequelize UI
            </h2>

            <p
              className={classnames(
                maxWidth('max-w-md'),
                margin('mx-auto'),
                fontSize('text-2xl'),
                textAlign('text-center'),
              )}
            >
              Generate Sequelize code in TypeScript for any database, with any configuration.
            </p>
          </div>
        </div>
        <div className={classnames(section, margin('mb-12'))}>
          {error && <SchemasError onClickClearData={handleClickClearData} />}
          {schemas && schemas.length > 0 && (
            <>
              <div className={classnames(title, display('flex'), alignItems('items-center'))}>
                <h2>My Schemas</h2>
                <IconButton
                  className={classnames(margin('ml-1'))}
                  icon={InfoIcon}
                  iconProps={{ size: 5, strokeWidth: 2 }}
                  label="my schemas info"
                  onClick={openInfoModal}
                />
              </div>
              <div className={classnames(flexCenter, width('w-full'))}>
                <MySchemaLinks schemas={schemas} />
              </div>
            </>
          )}
          {schemas && schemas.length === 0 && (
            <>
              <div className={classnames(flexCenter, width('w-full'))}>
                <p className={classnames(fontSize('text-base'), lineHeight('leading-loose'))}>
                  To get started,{' '}
                  <RouteLink
                    route={newSchemaRoute()}
                    className={classnames(
                      inlineButton(),
                      margin('mx-1'),
                      fontSize('text-sm'),
                      fontWeight('font-bold'),
                      backgroundColor('hover:bg-green-100'),
                    )}
                  >
                    create a new schema
                  </RouteLink>{' '}
                  or select one of the example schemas{' '}
                  <span className={classnames(display('inline-block'))}>
                    below.
                    <span className={classnames(verticalAlign('align-middle'))}>
                      <IconButton
                        className={classnames(margin('ml-1'))}
                        icon={InfoIcon}
                        iconProps={{ size: 5, strokeWidth: 2 }}
                        label="my schemas info"
                        onClick={openInfoModal}
                      />
                    </span>
                  </span>
                </p>
              </div>
            </>
          )}
        </div>
        <div className={classnames(section, margin('mb-12'))}>
          <h2 className={title}>Example Schemas</h2>
          <ExampleSchemaLinks exampleMeta={exampleMeta} />
        </div>
        {/* <div className={classnames(section, margin('mb-12'))}>
          <h2 className={title}>About Sequelize UI</h2>
          <p className={classnames(text)}></p>
        </div> */}
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
