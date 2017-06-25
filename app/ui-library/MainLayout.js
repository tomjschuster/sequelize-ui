import React from 'react'
import { Layout, Panel } from 'react-toolbox/lib/layout'

import MainAppBar from './MainAppBar'

const MainLayout = ({ children }) => (
  <Layout>
    <Panel>
      <MainAppBar />
      <div style={{ padding: '2%' }}>
        { children }
      </div>
    </Panel>
  </Layout>
)

export default MainLayout
