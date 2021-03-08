import { file, FileItem } from '@sequelize-ui/core'
import React from 'react'
import Layout from '../components/Layout'

function IndexPage() {
  return (
    <Layout title="Home | Sequelize UI">{JSON.stringify(file('foo', 'bar') as FileItem)}</Layout>
  )
}

export default IndexPage
