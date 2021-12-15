import Layout from '@src/ui/components/Layout'
import Home from '@src/ui/layouts/Home'
import React from 'react'

const title = 'Sequelize UI'

const metaDescripton =
  'Use Sequelize UI to quickly generate Sequelize TypeScript code online. Customize your data model and database settings, then export your Node.js project.'

export default function IndexPage(): React.ReactElement {
  return (
    <Layout title={title} metaDescription={metaDescripton}>
      <Home />
    </Layout>
  )
}
