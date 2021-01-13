import { pluralize, singularize, camelize } from '../../../helpers/string'
import { dataTypeToSequelize, dataTypeToTypeScript, displaySequelizeDataType } from '../dataTypes'
import { AssociationType, DataType, Field, ModelAssociation } from '../../../schema'
import { indent, blank } from '../../helpers'

export type ModelTemplateArgs = {
  modelName: string
  fields: Field[]
  associations: ModelAssociation[]
}
export const modelTemplate = ({ modelName, fields, associations }: ModelTemplateArgs): string =>
  [
    imports({ modelName, associations }),
    blank(),
    types({ modelName, fields }),
    blank(),
    classDeclaration({ modelName, fields, associations }),
  ].join('\n')

// Imports
type ImportsArgs = {
  modelName: string
  associations: ModelAssociation[]
}
const imports = ({ modelName, associations }: ImportsArgs): string =>
  [
    sequelizeImports(),
    ...getAssociationTypes({ modelName, associations }).map(([filename, types]) =>
      typeImports({ filename, types }),
    ),
  ].join('\n')

const sequelizeImports = (): string =>
  `import Sequelize, { DataTypes, Model, Optional } from 'sequelize';`

type TypeImportArgs = {
  filename: string
  types: string[]
}
const typeImports = ({ filename, types }: TypeImportArgs): string =>
  `import type { ${types.join(', ')} } from './${filename}'`

type ModelAssociationTypes = { [modelName: string]: AssociationTypeLookup }
type AssociationTypeLookup = { [type: string]: boolean }

type GetAssociationTypes = {
  modelName: string
  associations: ModelAssociation[]
}
const getAssociationTypes = ({
  modelName,
  associations,
}: GetAssociationTypes): Array<[filename: string, types: string[]]> => {
  const associationTypesByModel = associations.reduce<ModelAssociationTypes>((acc, association) => {
    if (association.modelName === modelName) {
      return acc
    }

    const types = associationTypes(association).reduce<AssociationTypeLookup>((acc, type) => {
      acc[type] = true
      return acc
    }, acc[association.modelName] || {})

    acc[association.modelName] = types

    return acc
  }, {})

  return Object.entries(associationTypesByModel)
    .sort(([modelNameA], [modelNameB]) => modelNameA.localeCompare(modelNameB))
    .map(([modelName, types]) => [modelName, Object.keys(types).sort((a, b) => a.localeCompare(b))])
}

const associationTypes = ({ modelName, type }: ModelAssociation): string[] =>
  [
    modelName,
    `${modelName}Id`,
    type === AssociationType.HasOne ? `${modelName}CreationAttributes` : null,
  ].filter((x): x is string => !!x)

// Types
type TypesArgs = {
  modelName: string
  fields: Field[]
}
const types = ({ modelName, fields }: TypesArgs): string =>
  [
    modelAttributesType({ modelName, fields }),
    blank(),
    idTypes({ modelName, fields }),
    creationAttributeType(modelName),
  ].join('\n')

type ModelAttributesTypeArgs = {
  modelName: string
  fields: Field[]
}
const modelAttributesType = ({ modelName, fields }: ModelAttributesTypeArgs): string =>
  `export interface ${modelName}Attributes {
  ${indent(2, fields.map(attributeType).join('\n'))}
}`

const attributeType = ({ name, type, required }: Field): string =>
  `${name}${required ? '?' : ''}: ${dataTypeToTypeScript(type)};`

type IdTypesArgs = {
  modelName: string
  fields: Field[]
}
const idTypes = ({ modelName, fields }: IdTypesArgs): string =>
  `export type ${modelName}Pk = ${fields
    .filter((f) => f.primaryKey)
    .map((f) => `'${f.name}'`)
    .join(' | ')}
export type ${modelName}Id = ${modelName}Attributes[${modelName}Pk]`

const creationAttributeType = (modelName: string): string =>
  `export type ${modelName}CreationAttributes = Optional<${modelName}Attributes, ${modelName}Pk>;`

// Class
type ClassDeclarationArgs = {
  modelName: string
  fields: Field[]
  associations: ModelAssociation[]
}
const classDeclaration = ({ modelName, fields, associations }: ClassDeclarationArgs): string =>
  `export class ${modelName} extends Model<${modelName}Attributes, ${modelName}CreationAttributes> implements ${modelName}Attributes {
  ${indent(2, fields.map(classFieldType).join('\n'))}${associations.length ? '\n' : ''}
  ${indent(2, associations.map((a) => associationType({ modelName, association: a })).join('\n'))}
  static initModel(sequelize: Sequelize.Sequelize): typeof ${modelName} {
    ${modelName}.init({
    ${indent(4, fields.map(fieldTemplate).join(',\n'))}
    }, {
      sequelize,
      ${/* TODO: config */ blank()}
    });

    return ${modelName};
  }
}`

const classFieldType = ({ name, type, required, primaryKey }: Field): string =>
  `public ${primaryKey ? 'readonly ' : ''}${name}${required ? '?' : '!'}: ${dataTypeToTypeScript(
    type,
  )};`

type AssociationTypeArgs = {
  modelName: string
  association: ModelAssociation
}
const associationType = ({
  modelName: baseModelName,
  association: { modelName, type },
}: AssociationTypeArgs): string => {
  const singularName = singularize(modelName)
  const pluralName = pluralize(modelName)

  switch (type) {
    case AssociationType.BelongsTo:
      return [
        `// ${baseModelName} belongsTo ${modelName}`,
        `public readonly ${camelize(singularName)}?: ${modelName};`,
        `public get${singularName}!: Sequelize.BelongsToGetAssociationMixin<${modelName}>;`,
        `public set${singularName}!: Sequelize.BelongsToSetAssociationMixin<${modelName}, ${modelName}Id>;`,
        `public create${singularName}!: Sequelize.BelongsToCreateAssociationMixin<${modelName}>;`,
        blank(),
      ].join('\n')
    case AssociationType.HasMany:
      return [
        `// ${baseModelName} hasMany ${modelName}`,
        `public readonly ${camelize(pluralName)}?: ${modelName}[];`,
        `public get${pluralName}!: Sequelize.HasManyGetAssociationsMixin<${modelName}>;`,
        `public set${pluralName}!: Sequelize.HasManySetAssociationsMixin<${modelName}, ${modelName}Id>;`,
        `public add${singularName}!: Sequelize.HasManyAddAssociationMixin<${modelName}, ${modelName}Id>;`,
        `public add${pluralName}!: Sequelize.HasManyAddAssociationsMixin<${modelName}, ${modelName}Id>;`,
        `public create${singularName}!: Sequelize.HasManyCreateAssociationMixin<${modelName}>;`,
        `public remove${singularName}!: Sequelize.HasManyRemoveAssociationMixin<${modelName}, ${modelName}Id>;`,
        `public remove${pluralName}!: Sequelize.HasManyRemoveAssociationsMixin<${modelName}, ${modelName}Id>;`,
        `public has${singularName}!: Sequelize.HasManyHasAssociationMixin<${modelName}, ${modelName}Id>;`,
        `public has${pluralName}!: Sequelize.HasManyHasAssociationsMixin<${modelName}, ${modelName}Id>;`,
        `public count${pluralName}!: Sequelize.HasManyCountAssociationsMixin;`,
        blank(),
      ].join('\n')
    case AssociationType.HasOne:
      return [
        `// ${baseModelName} hasOne ${modelName}`,
        `public readonly ${camelize(singularName)}?: ${modelName};`,
        `public get${singularName}!: Sequelize.HasOneGetAssociationMixin<${modelName}>;`,
        `public set${singularName}!: Sequelize.HasOneSetAssociationMixin<${modelName}, ${modelName}Id>;`,
        `public create${singularName}!: Sequelize.HasOneCreateAssociationMixin<${modelName}CreationAttributes>;`,
        blank(),
      ].join('\n')
    case AssociationType.ManyToMany:
      return [
        `// ${baseModelName} belonsToMany ${modelName}`,
        `public readonly ${camelize(pluralName)}?: ${modelName}[];`,
        `public get${pluralName}!: Sequelize.BelongsToManyGetAssociationsMixin<${modelName}>;`,
        `public set${pluralName}!: Sequelize.BelongsToManySetAssociationsMixin<${modelName}, ${modelName}Id>;`,
        `public add${singularName}!: Sequelize.BelongsToManyAddAssociationMixin<${modelName}, ${modelName}Id>;`,
        `public add${pluralName}!: Sequelize.BelongsToManyAddAssociationsMixin<${modelName}, ${modelName}Id>;`,
        `public create${singularName}!: Sequelize.BelongsToManyCreateAssociationMixin<${modelName}>;`,
        `public remove${singularName}!: Sequelize.BelongsToManyRemoveAssociationMixin<${modelName}, ${modelName}Id>;`,
        `public remove${pluralName}!: Sequelize.BelongsToManyRemoveAssociationsMixin<${modelName}, ${modelName}Id>;`,
        `public has${singularName}!: Sequelize.BelongsToManyHasAssociationMixin<${modelName}, ${modelName}Id>;`,
        `public has${pluralName}!: Sequelize.BelongsToManyHasAssociationsMixin<${modelName}, ${modelName}Id>;`,
        `public count${pluralName}!: Sequelize.BelongsToManyCountAssociationsMixin;`,
        blank(),
      ].join('\n')
  }
}

const fieldTemplate = ({ name, type, required, primaryKey, unique }: Field): string =>
  `${name}: {
  ${indent(
    2,
    [
      typeField(type),
      required === undefined ? '' : allowNullField(!required),
      primaryKey === undefined ? '' : primaryKeyField(primaryKey),
      unique === undefined ? '' : uniqueField(unique),
      // TODO; Unique
    ]
      .filter((x) => x)
      .join(',\n'),
  )}
}`

const typeField = (dataType: DataType): string =>
  `type: ${displaySequelizeDataType(dataTypeToSequelize(dataType))}`
const allowNullField = (allowNull: boolean): string => `allowNull: ${allowNull}`
const primaryKeyField = (primaryKey: boolean): string => `primaryKey: ${primaryKey}`
const uniqueField = (unique: boolean): string => `unique: ${unique}`

export default modelTemplate
