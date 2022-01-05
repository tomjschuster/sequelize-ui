/* eslint-disable react/react-in-jsx-scope */
import { MODAL_PORTAL_ID } from '@src/ui/components/Portal'
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
        <Head />
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
