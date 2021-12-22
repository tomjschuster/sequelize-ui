# Sequelize UI

![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/tomjschuster/sequelize-ui-ts/CI/main)
![Coveralls branch](https://img.shields.io/coveralls/github/tomjschuster/sequelize-ui-ts/main)

Rewrite of https://github.com/tomjschuster/sequelize-ui in TypeScript for generating TypeScript Sequelize projects: See the current [deployed app](https://sequelize-ui-ts.web.app/) for functional codegen with WIP UI.

## Todo:

### Features

#### UI

- [ ] Action menu
  - [ ] Delete/edit assocs via action menu
  - [ ] Delete/edit model via action menu
  - [ ] Refactor action menu
- [ ] Notifications
  - [ ] CRUD specific messages
  - [ ] Fix UI
  - [ ] Aria attrs
- [ ] Error boundary
- [ ] GitHub link
- [ ] a11y
  - [ ] Form errors
- [ ] Home page copy
- [ ] demo schema tooltips
- [ ] migrate old sequelize ui
- [ ] Dark mode
- [ ] db compatibility warnings
- [ ] Schema Flyout context

#### Codegen

- [ ] JavaScript (non-TS) support
  - [ ] Link to legacy
  - [ ] Framework options

#### API

- Persist db options for user
- JSON schema for localStorage API

### Testing

- unit
  - file tree
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
