Todo:

UI

- [ ] Form section
- [ ] Form buttons
- [ ] Text input
- [ ] Radio group
- [ ] Checkbox group
- [ ] Model form
- [ ] Schema form
- [ ] Form a11y review
- [ ] Code preview
  - [ ] DB options
  - [ ] Copy/download alerts
  - [ ] a11y (aria-controls?)

DB Options

- [ ] prefix id name option
- [ ] SET type
- [ ] default value
- [ ] decimal precision

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
