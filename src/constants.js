export const RELATIONSHIPS = {
  BELONGS_TO: 'BELONGS_TO',
  HAS_ONE: 'HAS_ONE',
  HAS_MANY: 'HAS_MANY',
  BELONGS_TO_MANY: 'BELONGS_TO_MANY'
}

export const displayRelationship = relationship => {
  switch (relationship) {
    case RELATIONSHIPS.BELONGS_TO: return 'Belongs To'
    case RELATIONSHIPS.HAS_ONE: return 'Has One'
    case RELATIONSHIPS.HAS_MANY: return 'Has Many'
    case RELATIONSHIPS.BELONGS_TO_MANY: return 'Belongs To Many'
    default: return undefined
  }
}

export const relationshipKey = relationship => {
  switch (relationship) {
    case RELATIONSHIPS.BELONGS_TO: return 'belongsTo'
    case RELATIONSHIPS.HAS_ONE: return 'hasOne'
    case RELATIONSHIPS.HAS_MANY: return 'hasMany'
    case RELATIONSHIPS.BELONGS_TO_MANY: return 'belongsToMany'
    default: return undefined
  }
}

export const METHODS = {
  HOOKS: 'HOOKS',
  GETTER_METHODS: 'GETTER_METHODS',
  SETTER_METHODS: 'SETTER_METHODS'
}

export const displayMethod = method => {
  switch (method) {
    case METHODS.HOOKS: return 'Hooks'
    case METHODS.GETTER_METHODS: return 'Getter Methods'
    case METHODS.SETTER_METHODS: return 'Setter Methods'
    default: return undefined
  }
}

export const methodKey = method => {
  switch (method) {
    case METHODS.HOOKS: return 'hooks'
    case METHODS.GETTER_METHODS: return 'getterMethods'
    case METHODS.SETTER_METHODS: return 'setterMethods'
    default: return undefined
  }
}

export const OPTIONS = {
  TABLE_NAME: 'TABLE_NAME',
  SINGULAR: 'SINGULAR',
  PLURAL: 'PLURAL',
  FREEZE_TABLE_NAME: 'FREEZE_TABLE_NAME',
  UNDERSCORED_COLUMNS: 'UNDERSCORED_COLUMNS',
  UNDERSCORED_TABLE_NAME: 'UNDERSCORED_TABLE_NAME'
}

export const displayOption = option => {
  switch (option) {
    case OPTIONS.TABLE_NAME: return 'Table Name'
    case OPTIONS.SINGULAR: return 'Singular Name'
    case OPTIONS.PLURAL: return 'Plural Name'
    case OPTIONS.FREEZE_TABLE_NAME: return 'Freeze Table Name'
    case OPTIONS.UNDERSCORED_COLUMNS: return 'Underscore Column Names'
    case OPTIONS.UNDERSCORED_TABLE_NAME: return 'Underscore Table Name'
  }
}
