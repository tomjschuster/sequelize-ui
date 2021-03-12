import { blank, lines } from "@lib/core";

export { serverTemplate };

const serverTemplate = (): string =>
  lines([
    `import db from './db'`,
    `import { initModels } from './models'`,
    blank(),
    `initModels(db)`,
    blank(),
    `db.sync({ force: true })`,
    blank(),
  ]);
