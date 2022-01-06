# Sequelize UI

![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/tomjschuster/sequelize-ui-ts/CI/main)
![Coveralls branch](https://img.shields.io/coveralls/github/tomjschuster/sequelize-ui-ts/main)

Rewrite of https://github.com/tomjschuster/sequelize-ui in TypeScript for generating TypeScript Sequelize projects: See the current [deployed app](https://sequelize-ui-ts.web.app/) for functional codegen with WIP UI.

## Todo:

### Features

#### UI

- [ ] Clear data
- [ ] Error boundary
- [ ] migrate old sequelize ui
- [ ] Refactor undefined/null
- [ ] Refactor code view controls
- [ ] Home page copy
- [ ] Link to legacy
- [ ] Dark mode
- [ ] Favicon

- [ ] Cleanup unused code
- [ ] db compatibility warnings
- [ ] Schema Layout context
- [ ] Transition panels on delete
- [ ] Cache file tree by schema id
- [ ] Loading state for schema url

#### Codegen

- [ ] JavaScript (non-TS) support
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
