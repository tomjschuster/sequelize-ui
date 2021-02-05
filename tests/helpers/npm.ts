import { DirectoryItem, name } from '../../src/files'
import { writeFiles } from './files'
import { promisify } from 'util'
import { exec as exec_ } from 'child_process'
const exec = promisify(exec_)

const TEST_PROJECT_DIR = '/tmp/sequelize-ui-test'

export async function runNpmProject(directory: DirectoryItem): Promise<void> {
  const cwd = process.cwd()
  await writeFiles(directory, TEST_PROJECT_DIR)
  process.chdir(`${TEST_PROJECT_DIR}/${name(directory)}`)
  await exec('npm install')
  await exec('npm run build')
  await exec('npm start')
  process.chdir(cwd)
}

export async function clearNpmProject(directory: DirectoryItem): Promise<void> {
  await exec(`rm -rf ${TEST_PROJECT_DIR}/${name(directory)}`)
}
