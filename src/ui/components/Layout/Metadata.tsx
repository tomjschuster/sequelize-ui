import Head from 'next/head'
import React from 'react'

export type MetadataProps = {
  title: string
  metaDescription?: string
}

function Metadata({ title, metaDescription }: MetadataProps): React.ReactElement {
  return (
    <Head>
      <title>{title}</title>
      {metaDescription && <meta name="description" content={metaDescription} />}
    </Head>
  )
}

export default Metadata
