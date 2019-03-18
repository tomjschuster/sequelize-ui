import Case from 'case'
import { dbTemplate, modelTemplate } from './templates.js'

export default ({ models, config = {} }) => ({
  name: 'db',
  files: [
    { name: 'index.js', content: dbTemplate({ models, config }) },
    {
      name: 'models',
      files: models.map(model => modelFile({ model, config }))
    }
  ]
})

const modelFile = ({ model, config }) => ({
  name: `${Case.kebab(model.name)}.js`,
  content: modelTemplate({ model, config })
})
