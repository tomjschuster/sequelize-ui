import React from 'react'

import TopBar from './TopBar'
import SideMenu from './SideMenu'
import ErrorDialog from './ErrorDialog'

import { Layout, Panel } from 'react-toolbox/lib/layout'

const MainLayout = ({ children }) => (
  <Layout>
    <SideMenu />
    <Panel>
      <TopBar />
      {children}
    </Panel>
    <ErrorDialog />
  </Layout>
)

export default MainLayout
