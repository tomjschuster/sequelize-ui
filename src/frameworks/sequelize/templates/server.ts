import { blank, lines } from '@src/core/codegen'
import { DbOptions } from '@src/core/database'

type ServerTemplateArgs = {
  dbOptions: DbOptions
}
export const serverTemplate = ({ dbOptions }: ServerTemplateArgs): string =>
  lines([
    `import http from 'http'`,
    `import db from './db'`,
    `import { initModels } from './models'`,
    blank(),
    defineRun({ dbOptions }),
    blank(),
    'run()',
  ])

function defineRun({ dbOptions }: ServerTemplateArgs): string {
  return lines([
    'async function run() {',
    lines(
      [
        `initModels(db)`,
        dbOptions.migrations ? null : `await db.sync()`,
        `const hostname = process.env.HOSTNAME || '127.0.0.1'`,
        `const port = parseInt(process.env.PORT || '3000')`,
        blank(),
        `const server = http.createServer((req, res) => {`,
        lines(
          [
            `res.statusCode = 200`,
            `res.setHeader('Content-Type', 'text/plain')`,
            `res.end('Hello World')`,
          ],
          { depth: 2 },
        ),
        `})`,
        blank(),
        `server.listen(port, hostname, () => {`,
        lines([`console.log(\`Server running at http://\${hostname}:\${port}/\`)`], { depth: 2 }),
        `})`,
      ],
      { depth: 2 },
    ),
    '}',
  ])
}
