Todo:

UI

- [ ] Form section
- [ ] Form buttons
- [ ] Text input
- [ ] Radio group
- [ ] Checkbox group
- [ ] Model form
- [ ] db compatibility warnings
- [ ] Schema form
- [ ] Form a11y review
- [ ] Code preview
  - [ ] DB options
  - [ ] Copy/download alerts
  - [ ] a11y (aria-controls?)
- [ ] Home page
  - [ ] Intro
  - [ ] Demo section
  - [ ] Current schemas

DB Options

- [ ] prefix id name option
- [ ] default value
  - [ ] Fix default date/time to use DataTypes.NOW

Codegen

- [ ] Review sequelize cli format for init models and config
- [ ] Review DataTypes.NOW
- [ ] Migrations
- [ ] JavaScript

Testing

- [ ] Use data schemas in integration tests
  - [ ] Create schema with all data types
- [ ] Review missing unit tests
  - [ ] codegen
  - [ ] database
  - [ ] framework
  - [ ] schema
- [ ] Switch to jest
  - [ ] hook tests
  - [ ] api tests (mock local storage)
- [ ] Browser tests

Bugs

- id_id?

```ts
Language.hasMany(Film, {
  as: 'originalLanguageFilms',
  foreignKey: 'original_language_id_id',
})
```
