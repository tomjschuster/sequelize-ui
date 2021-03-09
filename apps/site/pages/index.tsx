import Layout from '@apps/site/components/Layout'
import { file, FileItem } from '@libs/core'
import React from 'react'

function IndexPage() {
  return (
    <Layout title="Home | Sequelize UI">{JSON.stringify(file('foo', 'bar') as FileItem)}</Layout>
  )
}

export default IndexPage
