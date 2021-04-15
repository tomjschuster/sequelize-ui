Todo:

UI

- [ ] Form element error fields

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
