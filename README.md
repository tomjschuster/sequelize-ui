Todo:

UI

- [ ] Edit Associations
- [ ] Form validation
  - [ ] Name format
  - [ ] Name uniqueness
  - [ ] Name length

DB Options

- [ ] prefix id name option
- [ ] SET type
- [ ] default value
- [ ] decimal precision

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
