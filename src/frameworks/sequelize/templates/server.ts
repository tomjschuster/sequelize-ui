import { blank, lines } from '@src/core/codegen'

export { serverTemplate }

const serverTemplate = (): string =>
  lines([
    `import db from './db'`,
    `import { initModels } from './models'`,
    blank(),
    `initModels(db)`,
    blank(),
    `db.sync({ force: true })`,
    blank(),
  ])