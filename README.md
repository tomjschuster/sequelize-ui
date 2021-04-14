Todo:

UI

- [ ] Form validation
  - [x] Name format
  - [x] Min name length
  - [ ] Max name length
  - [ ] Name uniqueness

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
