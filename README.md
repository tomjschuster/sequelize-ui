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

- [ ] Migrations
- [ ] JavaScript

Testing

- [ ] Use data schemas in integration tests
- [ ] Browser tests

Bugs

- id_id?

```ts
Language.hasMany(Film, {
  as: 'originalLanguageFilms',
  foreignKey: 'original_language_id_id',
})
```
