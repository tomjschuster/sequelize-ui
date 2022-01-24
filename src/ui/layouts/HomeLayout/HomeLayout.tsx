import { SchemaMeta } from '@src/api/meta'
import schemaApi from '@src/api/schema'
import ExternalLink from '@src/routing/ExternalLink'
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
  minHeight,
  overflow,
  padding,
  textAlign,
  verticalAlign,
  width,
} from '@src/ui/styles/classnames'
import {
  flexCenter,
  inlineButton,
  list,
  section,
  subtitle,
  text,
  title,
} from '@src/ui/styles/utils'
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

const MY_SCHEMAS_ID = 'my-schemas'
const EXAMPLE_SCHEMAS_ID = 'example-schemas'
const CLEAER_DATA_SUCCESS_COPY = 'All schemas deleted.'
const CLEAR_DATA_ERROR_COPY = `Failed to delete schemas. Try clearing localStorage or site data through your browser's developer console.`

export default function HomeLayout({ exampleMeta }: HomeLayoutProps): React.ReactElement {
  const { data: schemas, error, loading, refetch } = useAsync({ getData: schemaApi.listSchemas })

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
                fontSize('text-3xl', '2xs:text-4xl', 'xs:text-5xl'),
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
              <span className={classnames(display('inline-block'))}>Sequelize UI</span>
            </h2>

            <p
              className={classnames(
                maxWidth('max-w-md'),
                margin('mx-auto'),
                fontSize('text-lg', '2xs:text-xl', 'xs:text-2xl'),
                textAlign('text-center'),
              )}
            >
              Generate Sequelize code in TypeScript for any database, with any configuration.
            </p>
          </div>
        </div>
        <div className={classnames(section, margin('mb-12'))}>
          {loading && !schemas && (
            <div className={classnames(minHeight('min-h-26', 'xs:min-h-20', 'md:min-h-10'))} />
          )}
          {error && !schemas && <SchemasError onClickClearData={handleClickClearData} />}
          {schemas && schemas.length > 0 && (
            <>
              <div
                id={MY_SCHEMAS_ID}
                className={classnames(
                  title,
                  display('flex'),
                  alignItems('items-center'),
                  minHeight('min-h-10'),
                )}
              >
                <h2>My Schemas</h2>
                <IconButton
                  className={classnames(margin('ml-1'))}
                  icon={InfoIcon}
                  iconProps={{ size: 5, strokeWidth: 2 }}
                  label="my schemas info"
                  onClick={openInfoModal}
                />
              </div>
              <div
                className={classnames(
                  flexCenter,
                  width('w-full'),
                  minHeight('min-h-26', 'xs:min-h-20', 'md:min-h-10'),
                )}
              >
                <MySchemaLinks schemas={schemas} />
              </div>
            </>
          )}
          {schemas && schemas.length === 0 && (
            <>
              <div
                id={MY_SCHEMAS_ID}
                className={classnames(
                  flexCenter,
                  width('w-full'),
                  minHeight('min-h-26', 'xs:min-h-20', 'md:min-h-10'),
                )}
              >
                <p className={classnames(fontSize('text-base'), lineHeight('leading-loose'))}>
                  To get started,&nbsp;
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
                  </RouteLink>
                  &nbsp; or select one of the example schemas&nbsp;
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
        <div id={EXAMPLE_SCHEMAS_ID} className={classnames(section, margin('mb-12'))}>
          <h2 className={title}>Example Schemas</h2>
          <ExampleSchemaLinks exampleMeta={exampleMeta} />
        </div>
        <div className={classnames(section)}>
          <div className={classnames(margin('mb-2'))}>
            <h2 className={title}>About Sequelize UI</h2>
            <p className={classnames(text)}>
              Sequelize UI is an online&nbsp;
              <ExternalLink href="https://sequelize.org/">Sequelize ORM</ExternalLink> code
              generator, which generates a full Node.js TypeScript project. Use the schema editor to
              create your database tables, fields and associations, then preview the Sequelize
              models and migrations in the code viewer before downloading the project as a zip file
              or copying code from individual files.
            </p>

            <p className={classnames(text)}>
              With Sequelize UI, you can also customize your project with the following database
              configurations:
            </p>
            <ul className={classnames(list, margin('mb-2'))}>
              <li>PostgreSQL, MySQL, MariaDB, SQLite or Microsoft SQL Server dialects.</li>
              <li>Singular or plural table names</li>
              <li>
                <code>camelCase</code> or <code>snake_case</code> table and column names.
              </li>
              <li>
                Table name prefixed primary keys or plain <code>id</code> primary keys.
              </li>
              <li>Created/updated timestamps or no timestamps.</li>
            </ul>
            <p className={text}>
              Get started quickly by choosing one of the included{' '}
              <ExternalLink href={`#${EXAMPLE_SCHEMAS_ID}`}>example schemas</ExternalLink>, or{' '}
              <ExternalLink href={`#${MY_SCHEMAS_ID}`}>create your own schema</ExternalLink>.
            </p>
          </div>
          <div className={classnames(margin('mb-2'))}>
            <h3 className={subtitle}>Sequelize UI for plain JavaScript</h3>
            <p className={classnames(text)}>
              This site currently only generates TypeScript code; however, the legacy Sequelize UI
              site is still availale at&nbsp;
              <ExternalLink href="https://js.sequelizeui.app">
                https://js.sequelizeui.app
              </ExternalLink>
              &nbsp; if you want to generate code for a plain JavaScript project. This project is
              not actively maintained, but the goal is to eventually update Sequelize UI to support
              plain JavaScript as well.
            </p>
          </div>
          <div className={classnames(margin('mb-2'))}>
            <h3 className={subtitle}>Other Sequelize code generators</h3>
            <p className={classnames(text)}>
              Sequelize UI is the only web-based code generator for Sequelize and is great for
              generating an entire Sequelize TypeScript project from scratch, or for learning how to
              support different database configurations; however, there are a number of other
              excellent Sequelize code generators.
            </p>
            <p className={classnames(text)}>
              <ExternalLink href="https://github.com/sequelize/cli">Sequelize CLI</ExternalLink> is
              the official Sequelize CLI tool. It supports generating new models and migrations in
              plain JavaScript for your Sequelize project, but does not currently support generating
              TypeScript.
            </p>
            <p className={classnames(text)}>
              If you have an existing database and want to generate compatible Sequelize code,&nbsp;
              <ExternalLink href="https://github.com/sequelize/sequelize-auto">
                Sequelize Auto
              </ExternalLink>
              &nbsp;is a CLI tool which supports all SQL dialects and generates Sequelize code in
              plain JavaScript, ES6 or TypeScript. Much of the code generated by Sequelize UI was
              modelled after the code generated by Sequelize Auto. Because Sequelize Auto is meant
              to generate code for an existing database, it does not generate any migration files.
              There is also a desktop application,&nbsp;
              <ExternalLink href="https://github.com/andyforever/sequelizer">
                Sequelizer
              </ExternalLink>
              , which is built on top of Sequelize Auto with an easy to use GUI.
            </p>
          </div>
        </div>
      </div>
      <Modal
        id="my-schemas-info"
        title="Schema Storage"
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
