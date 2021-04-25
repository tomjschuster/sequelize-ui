import { ProjectType } from '@src/core/framework'
import { SequelizeFramework } from '..'

describe('Sequelize Framework', () => {
  it('returns the correct name', () => {
    expect(SequelizeFramework.displayName()).toBe('Sequelize')
  })

  it('returns the correct project type', () => {
    expect(SequelizeFramework.projectType()).toBe(ProjectType.Npm)
  })
})
