import { SchemaMeta } from '@src/api/meta'
import { classnames, height, margin, overflow, padding } from '@src/ui/styles/classnames'
import { section } from '@src/ui/styles/utils'
import React from 'react'
import About from './About'
import { EXAMPLE_SCHEMAS_ID, MY_SCHEMAS_ID } from './constants'
import ExampleSchemas from './ExampleSchemas'
import Intro from './Intro'
import MySchemas from './MySchemas'

type HomeLayoutProps = {
  exampleMeta: SchemaMeta[]
}

export default function HomeLayout({ exampleMeta }: HomeLayoutProps): React.ReactElement {
  return (
    <div className={classnames(overflow('overflow-y-scroll'), height('h-full'), padding('p-6'))}>
      <section className={classnames(section, margin('mb-6'))}>
        <Intro />
      </section>
      <section id={MY_SCHEMAS_ID} className={classnames(section, margin('mb-6'))}>
        <MySchemas />
      </section>
      <section id={EXAMPLE_SCHEMAS_ID} className={classnames(section, margin('mb-12'))}>
        <ExampleSchemas exampleMeta={exampleMeta} />
      </section>
      <section className={classnames(section)}>
        <About />
      </section>
    </div>
  )
}
