import { DirectoryItem, name } from '@sequelize-ui/core/files'
import { exec as exec_ } from 'child_process'
import { promisify } from 'util'
import { clearDirectory, deleteFileOrDirectory, tmpDirPath, writeFiles } from './files'
const exec = promisify(exec_)

export async function buildNpmProject(
  directory: DirectoryItem,
  preinstall: string | null,
): Promise<void> {
  const cwd = process.cwd()

  const dirname = tmpDirPath(name(directory))
  await clearDirectory(dirname, ['node_modules', 'dist', 'db'])
  await writeFiles(directory, tmpDirPath())
  process.chdir(dirname)

  await install(preinstall)
  await build()
  await start()

  process.chdir(cwd)
}

export function deleteNpmProject(name: string): Promise<void> {
  return deleteFileOrDirectory(tmpDirPath(name))
}

const install = async (preinstall: string | null): Promise<void> => {
  if (preinstall) {
    await exec(preinstall)
  }
  return exec('npm install').then()
}
const build = (): Promise<void> => exec('npm run build -- --incremental').then()
const start = (): Promise<void> => exec('npm start').then()
