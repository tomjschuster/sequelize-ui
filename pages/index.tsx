import { listSchemas } from '@lib/api/schema'
import Layout from '@lib/components/Layout'
import { Schema } from '@lib/core'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

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
      <IndexPageContent schemas={schemas} error={error} />
    </Layout>
  )
}

type IndexPageContentProps = {
  schemas?: Schema[]
  error?: string
}
function IndexPageContent({ schemas, error }: IndexPageContentProps): React.ReactElement {
  if (error) return <p>{error}</p>
  if (schemas === undefined) return <p>Loading Schemas</p>
  if (schemas.length === 0) {
    return (
      <>
        <Link href="/demo">Demos</Link>
        <p>You have no schemas</p>
      </>
    )
  }

  return (
    <>
      <Link href="/demo">Demos</Link>
      <ul>
        {schemas.map((s) => (
          <li key={s.id}>{s.name}</li>
        ))}
      </ul>
    </>
  )
}

export default IndexPage
