# Sequelize UI

![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/tomjschuster/sequelize-ui-ts/CI/main)
![Coveralls branch](https://img.shields.io/coveralls/github/tomjschuster/sequelize-ui-ts/main)

Rewrite of https://github.com/tomjschuster/sequelize-ui in TypeScript for generating TypeScript Sequelize projects: See the current [deployed app](https://sequelize-ui-ts.web.app/) for functional codegen with WIP UI.

## Todo:

### Features

#### UI

- [ ] Refactor FileTree type
- [ ] Refactor empty id logic and empty model id logic
- [ ] Enum form, validation
- [ ] Form error styling
- [ ] Form placeholders
- [ ] Refactor styles
- [ ] Refactor icon props
- [ ] Home page
  - [ ] Copy
- [ ] Copy/download alerts
- [ ] Autofocus helpers during crud
- [ ] db compatibility warnings
- [ ] a11y (aria-controls?)
- [ ] demo schema tooltips

#### Codegen

- JavaScript (non-TS) support

#### API

- Persist db options for user
- JSON schema for localStorage API

### Testing

- ci

  - run e2e sql tests in ci

- ui

  - components (after UI complete)
  - Browser tests (after UI complete)

- sql
  - verify all tables/columns for each db type with demo schema
  - review sequelize framework test coverage

### Documentation

- Document modules/functions
- Update README for project overview, contribution
