# Sequelize UI

![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/tomjschuster/sequelize-ui-ts/CI/main)
![Coveralls branch](https://img.shields.io/coveralls/github/tomjschuster/sequelize-ui-ts/main)

Rewrite of https://github.com/tomjschuster/sequelize-ui in TypeScript for generating TypeScript Sequelize projects: See the current [deployed app](https://sequelize-ui-ts.web.app/) for functional codegen with WIP UI.

## Todo:

### For Launch

- Update README for project overview, contribution
- Deploy legacy to CloudFlare js.sequelizeui.app
- Deploy new site to CloudFlare
- Switch domain

### Features

#### UI

- Refactor css themes
  - Typeography
  - Colors
  - Layout
  - Spacing
- Refactor code view controls
- DB compatibility warnings
- Transition panels on delete
- Loading state for schema url
- Cleanup unused code

#### Codegen

- JavaScript (non-TS) support
- Framework options

#### API

- Persist db options for user
- import swagger/json schema

### Testing

- unit
  - file tree
- ci
  - run e2e sql tests in ci for all dialects
- ui
  - Browser tests
  - Components?
- sql
  - verify all tables/columns for each dialect with each example schema
  - review sequelize framework test coverage

### Documentation

- Document modules/functions
