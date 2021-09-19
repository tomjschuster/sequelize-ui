import { createSchema, listSchemas } from '@src/api/schema'
import { Schema } from '@src/core/schema'
import { DemoSchemaType, displayDemoSchemaType } from '@src/data/schemas'
import { editSchemaRoute, routeToUrl } from '@src/routing/routes'
import { classnames } from '@src/ui/classnames'
import ClockIcon from '@src/ui/components/icons/Clock'
import CollectionIcon from '@src/ui/components/icons/Collection'
import FilmIcon from '@src/ui/components/icons/Film'
import RssIcon from '@src/ui/components/icons/Rss'
import UserGroupIcon from '@src/ui/components/icons/Users'
import Layout from '@src/ui/components/Layout'
import useDemoSchema from '@src/ui/hooks/useDemoSchema'
import { now, TimeGranularity, timeSince } from '@src/utils/dateTime'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'

const CodeViewer = dynamic(() => import('@src/ui/components/CodeViewer'))

function IndexPage(): React.ReactElement {
  const [schemas, setSchemas] = useState<Schema[] | undefined>()
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    listSchemas()
      .then(setSchemas)
      .catch((e) => setError(e.message || 'Sorry, something went wrong.'))
  }, [])

  return (
    <Layout title="Home | Sequelize UI">
      <IndexPageSchemaContent schemas={schemas} error={error} />
      <IndexPageDemoContent />
    </Layout>
  )
}

type IndexPageSchemaPropsContent = {
  schemas?: Schema[]
  error?: string
}
function IndexPageSchemaContent({
  schemas,
  error,
}: IndexPageSchemaPropsContent): React.ReactElement {
  if (error) return <p>{error}</p>
  if (schemas === undefined) return <p>Loading Schemas</p>
  if (schemas.length === 0) return <p>You have no schemas</p>

  const ulClassName = classnames(
    'grid',
    'md:grid-cols-3',
    'sm:grid-cols-2',
    'grid-cols-1',
    'gap-6',
    'max-w-screen-lg',
    'lg:w-5/6',
    'pt-6',
  )
  return (
    <div className="w-full flex flex-col items-center p-6">
      <h2 className="text-2xl">My Schemas</h2>
      <ul className={ulClassName}>
        {schemas.map((s) => {
          const modelCount = s.models.flatMap((m) => m.associations).length
          const className = classnames(
            'text-sm',
            'p-2',
            'border',
            'border-gray-400',
            'hover:border-gray-800',
            'hover:bg-blue-100',
            'rounded',
            'min-h-24',
            'w-full',
            'flex',
            'flex-col',
            'justify-between',
          )
          return (
            <li key={s.id}>
              <Link href={`/schema?id=${s.id}`}>
                <a className={className}>
                  <span className="font-bold overflow-ellipsis overflow-hidden">{s.name}</span>
                  <span className="flex flex-col items-start">
                    <span className="flex items-center text-xs">
                      <span className="mr-1">
                        <CollectionIcon />
                      </span>
                      {modelCount} {modelCount === 1 ? 'model' : 'models'}
                    </span>
                    <span className="flex items-center  text-xs">
                      <span className="mr-1">
                        <ClockIcon title="last updated" />
                      </span>
                      updated {timeSince(now(), s.updatedAt, TimeGranularity.MINUTES)} ago
                    </span>
                  </span>
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default IndexPage

function IndexPageDemoContent(): React.ReactElement {
  const router = useRouter()
  const { schema: demoSchema, setType: setDemoSchemaType } = useDemoSchema()

  const handleEdit = async () => {
    if (demoSchema) {
      const schema = await createSchema(demoSchema)
      const route = editSchemaRoute(schema.id)
      router.push(routeToUrl(route))
    }
  }

  const handleClose = () => setDemoSchemaType(undefined)

  return (
    <div className="w-full flex flex-col items-center p-6">
      <h2 className="text-2xl">Demo Schemas</h2>
      <ul
        className={classnames(
          'grid',
          'md:grid-cols-3',
          'sm:grid-cols-2',
          'grid-cols-1',
          'gap-6',
          'max-w-screen-lg',
          'lg:w-5/6',
          'w-full',
          'pt-6',
        )}
      >
        {Object.values(DemoSchemaType).map((schemaType) => (
          <li key={schemaType}>
            <button
              type="button"
              className={classnames({
                'p-2': true,
                'w-full': true,
                border: true,
                'border-gray-500': true,
                'rounded-md': true,
                'flex-1': true,
                flex: true,
                'items-center': true,
                'hover:bg-green-200': true,
              })}
              onClick={setDemoSchemaType.bind(null, schemaType)}
            >
              <span className={classnames('mr-2')}>
                <DemoSchemaIcon schemaType={schemaType} />
              </span>
              {displayDemoSchemaType(schemaType)}
            </button>
          </li>
        ))}
      </ul>
      {demoSchema && (
        <CodeViewer schema={demoSchema} onClickClose={handleClose} onClickEdit={handleEdit} />
      )}
    </div>
  )
}

function DemoSchemaIcon({ schemaType }: { schemaType: DemoSchemaType }): ReactElement | null {
  switch (schemaType) {
    case DemoSchemaType.Blog:
      return <RssIcon />
    case DemoSchemaType.Employee:
      return <UserGroupIcon />
    case DemoSchemaType.Sakila:
      return <FilmIcon />
    default:
      return null
  }
}
