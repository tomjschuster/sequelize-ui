# Sequelize UI

## Todo:

### Tech Debt

#### Bugs

- association fieldset ts-expect-error
- id_id?

```ts
Language.hasMany(Film, {
  as: 'originalLanguageFilms',
  foreignKey: 'original_language_id_id',
})
```

#### Refactor

- Remove associations when deleting model in API

#### Upgrade

- Webpack 5

#### Testing

- ui

  - hooks
    - useGeneratedCode
    - useEditSchema
  - components
    - after UI complete

- Browser tests
  - after UI complete

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
