# Sequelize UI

## Todo:

### Tech Debt

#### Bugs

- id_id?

```ts
Language.hasMany(Film, {
  as: 'originalLanguageFilms',
  foreignKey: 'original_language_id_id',
})
```

#### Refactor

- Switch to Jest

#### Testing

- Use data schemas in integration tests
  - Create schema with all data types
- Review missing unit tests

  - `file.io`
  - Sequelize (create additional data/schema which demonstrates all cases, test all data schemas)
    - Use/test missing data types
    - Use/test framework display name
    - Use/test hasOne
    - Use/test aliasValue
    - Use/test (non?) JSON type project
    - Use/test imports of self associated project
    - Use/test imports of hasOne
    - Use/test modelClass of hasOne
    - Use/test modelClass of default current date
    - Use/test modelClass of default current time
    - Use/test modelClass of default uuid versions

- AFTER JEST:

  - hook tests
  - api tests (mock local storage)
  - Component tests?

- Browser tests (pick framework, post UI)

#### Documentation

- Document modules/functions
- Update README for project overview, contribution

### Features

#### DB Options

- prefix id name option
- default value
  - Fix default date/time to use DataTypes.NOW

#### Codegen

- Review sequelize cli format for init models and config
- Review DataTypes.NOW
- Migrations
- JavaScript

#### UI

- Form section
- Form buttons
- Text input
- Radio group
- Checkbox group
- Model form
- db compatibility warnings
- Schema form
- Form a11y review
- Code preview
  - DB options
  - Copy/download alerts
  - a11y (aria-controls?)
- Home page
  - Intro
  - Demo section
  - Current schemas
