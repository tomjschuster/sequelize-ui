import { blank, lines } from '../../helpers'

export { serverTemplate }

const serverTemplate = (): string =>
  lines([
    `import db from './db';`,
    `import {initModels} from './models/init-models';`,
    blank(),
    `initModels(db);`,
    blank(),
    `db.sync().then(() => console.log('done'));`,
    blank(),
  ])
