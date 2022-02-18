/* eslint-disable react/react-in-jsx-scope */
import { MODAL_PORTAL_ID } from '@src/ui/components/Modal'
import { syncDomDarkModeScriptSource } from '@src/ui/utils/darkMode'
import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document'

class SequelizeUiDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx)

    return initialProps
  }

  render(): React.ReactElement {
    return (
      <Html lang="en">
        <Head>
          <script dangerouslySetInnerHTML={{ __html: syncDomDarkModeScriptSource() }} />
          <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml"></link>
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="manifest" href="/site.webmanifest" />
        </Head>
        <body>
          <Main />
          <div id={MODAL_PORTAL_ID} />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default SequelizeUiDocument
