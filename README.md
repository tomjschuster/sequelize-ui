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

#### Testing

- frameworks

  - missing data types
  - framework display name
  - hasOne
  - aliasValue
  - (non?) JSON type project
  - imports of self associated project
  - imports of hasOne
  - modelClass of hasOne
  - modelClass of default current date
  - modelClass of default current time
  - modelClass of default uuid versions

- api
  - Non-empty storage cases
- ui

  - hooks
  - components?

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
