# Sequelize UI

![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/tomjschuster/sequelize-ui-ts/CI/main)
![Coveralls branch](https://img.shields.io/coveralls/github/tomjschuster/sequelize-ui-ts/main)

https://sequelizeui.app/

Sequelize UI is [Sequelize ORM](https://sequelize.org/) code generator, which generates a full Node.js TypeScript project, entirely in the browser. Use the schema editor to design your database tables, fields and associations, then preview the Sequelize models and migrations in the code viewer before downloading the project as a zip file or copying code from individual files.

You can customize the generated Sequelize code with the following database configurations:

- PostgreSQL, MySQL, MariaDB, SQLite or Microsoft SQL Server dialects.
- Singular or plural table names
- camelCase or snake_case table and column names.
- Table name prefixed primary keys or plain id primary keys.
- Created/updated timestamps or no timestamps.

![Sequelize UI schema editor](./assets/schema-editor.png) ![Sequelize UI code preview](./assets/code-preview.png)

## Usage

To use Sequelize UI, either go to https://sequelizeui.app or run the project locally with:

```sh
npm ci
npm run build
npm start
```

Then go to http://localhost:3000

### Plain JavaScript

Sequelize UI currenly only generates TypeScript Sequelize code, however, an older version is still available at https://js.sequelizeui.app/ which generates plain JavaScript Sequelize code.

### Todo

- [ ] Rebase onto tomjschuster/sequelize-ui main
- [ ] Switch default/production branch to main

- [ ] **API**: Persist db options for user
- [ ] **API**: Import swagger/json schema

- [ ] **CI**: Run E2E SQL tests for all dialects before prod deploy

- [ ] **Codegen**: Add warning when SQL dialect doesn't support data type
- [ ] **Codegen**: JS support
- [ ] **Codegen**: Support multiple Sequelize versions

- [ ] **Documentation**: Document functions and modules

- [ ] **Tests**: Add E2E browser tests
- [ ] **Tests**: Run E2E SQL tests against all example schemas
- [ ] **Tests**: Consolidate snapshots
- [ ] **Tests**: Increase unit test coverage

- [ ] **UI**: Refactor css into theme
  - [ ] Typeography
  - [ ] Colors
  - [ ] Grid
  - [ ] Layout
- [ ] **UI**: Refactor code view controls
- [ ] **UI**: Animate panels on delete
