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

export const METHODS = {
  HOOKS: 'HOOKS',
  GETTER_METHODS: 'GETTER_METHODS',
  SETTER_METHODS: 'SETTER_METHODS',
  INSTANCE_METHODS: 'INSTANCE_METHODS',
  CLASS_METHODS: 'CLASS_METHODS'
}

export const displayMethod = method => {
  switch (method) {
    case METHODS.HOOKS: return 'Hooks'
    case METHODS.GETTER_METHODS: return 'Getter Methods'
    case METHODS.SETTER_METHODS: return 'Setter Methods'
    case METHODS.INSTANCE_METHODS: return 'Instance Methods'
    case METHODS.CLASS_METHODS: return 'Class Methods'
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
