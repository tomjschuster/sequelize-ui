import { DirectoryItem, name } from '../../src/files'
import { clearDirectory, deleteDirectory, writeFiles } from './files'
import { promisify } from 'util'
import { exec as exec_ } from 'child_process'
const exec = promisify(exec_)

export async function buildNpmProject(directory: DirectoryItem): Promise<void> {
  const cwd = process.cwd()

  const dirname = testProjectDirname(name(directory))
  await clearDirectory(dirname, ['node_modules', 'dist'])
  await writeFiles(directory, TEST_PROJECT_DIR)
  process.chdir(dirname)

  await install()
  await build()
  await start()

  process.chdir(cwd)
}

export function deleteNpmProject(name: string): Promise<void> {
  return deleteDirectory(testProjectDirname(name))
}

const TEST_PROJECT_DIR = '/tmp/sequelize-ui-test'
const testProjectDirname = (path: string) => `${TEST_PROJECT_DIR}/${path}`

const install = (): Promise<void> => exec('npm install').then()
const build = (): Promise<void> => exec('npm run build -- --incremental').then()
const start = (): Promise<void> => exec('npm start').then()
