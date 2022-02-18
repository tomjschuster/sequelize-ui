import { getExampleSchemaMeta, SchemaMeta } from '@src/api/meta'
import withLayout from '@src/ui/hocs/withLayout'
import HomeLayout from '@src/ui/layouts/HomeLayout'
import { GetStaticPropsResult } from 'next'
import React from 'react'

type IndexPageProps = {
  exampleMeta: SchemaMeta[]
}

function IndexPage({ exampleMeta }: IndexPageProps): React.ReactElement {
  return <HomeLayout exampleMeta={exampleMeta} />
}

export async function getStaticProps(): Promise<GetStaticPropsResult<IndexPageProps>> {
  const exampleMeta = getExampleSchemaMeta()

  return { props: { exampleMeta } }
}

export default withLayout<IndexPageProps>(() => ({
  title: 'Sequelize UI',
  metaDescription:
    'Use Sequelize UI to generate Sequelize TypeScript code online. Edit your data model and database settings, then export as a Node.js project.',
}))(IndexPage)
