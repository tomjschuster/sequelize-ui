# Sequelize UI

![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/tomjschuster/sequelize-ui-ts/CI/main)
![Coveralls branch](https://img.shields.io/coveralls/github/tomjschuster/sequelize-ui-ts/main)

Rewrite of https://github.com/tomjschuster/sequelize-ui in TypeScript for generating TypeScript Sequelize projects: See the current [deployed app](https://sequelize-ui-ts.web.app/) for functional codegen with WIP UI.

## Todo:

### Features

#### UI

- [x] Layout
- [-] Controls
  - [ ] Icons
- [-] File tree
  - [ ] Icons
  - [ ] Expand/collapse
- [ ] Copy/download alerts
- [ ] a11y (aria-controls?)

- [ ] Form section
- [ ] Form buttons
- [ ] Text input
- [ ] Radio group
- [ ] Checkbox group
- [ ] Model form
- [ ] db compatibility warnings
- [ ] Schema form
- [ ] Form a11y review
- [ ] Home page
  - [ ] Intro
  - [ ] Demo section
  - [ ] Current schemas

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
