import withLayout from '@src/ui/hocs/withLayout'
import HomeLayout from '@src/ui/layouts/HomeLayout'
import React from 'react'

function IndexPage(): React.ReactElement {
  return <HomeLayout />
}

export default withLayout(() => ({
  title: 'Sequelize UI',
  metaDescription:
    'Use Sequelize UI to quickly generate Sequelize TypeScript code online. Customize your data model and database settings, then export your Node.js project.',
}))(IndexPage)
